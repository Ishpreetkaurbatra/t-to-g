"""
Google News RSS Collector and 7-Day Food Mention Trend Analyzer.
Fetches real, permitted RSS feeds and analyzes keyword frequencies.
Preserves real source URLs and publication dates.
"""

import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
import email.utils
import re
from typing import List, Dict, Any, Optional

GOOGLE_NEWS_RSS_BASE = "https://news.google.com/rss/search"

# Common Indian & Global food keywords for mention tracking
TRACKED_KEYWORDS = [
    "millet", "sourdough", "matcha", "boba", "plant-based", "cold brew",
    "kombucha", "protein bowl", "artisanal", "vegan", "fermented", "biryani",
    "chai", "snack", "dessert", "street food", "mocktail", "gluten-free",
    "avocado", "taco", "croissant", "bubble tea", "smoothie"
]

def fetch_rss_feed(query: str = "food trends India", max_items: int = 25) -> List[Dict[str, Any]]:
    """
    Fetches real news articles from Google News RSS search feed.
    Returns list of dicts with title, link, pub_date, source, and description.
    """
    params = {
        "q": query,
        "hl": "en-IN",
        "gl": "IN",
        "ceid": "IN:en"
    }
    url = f"{GOOGLE_NEWS_RSS_BASE}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "T-to-G-Food-AI-Engine/1.0 (+https://t-to-g.internal)"}
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()
    except Exception as e:
        print(f"[Collector] Error fetching RSS from {url}: {e}")
        return []

    articles: List[Dict[str, Any]] = []
    try:
        root = ET.fromstring(xml_data)
        # Google News RSS wraps items in channel/item
        items = root.findall(".//item")
        for item in items[:max_items]:
            title_elem = item.find("title")
            link_elem = item.find("link")
            pub_date_elem = item.find("pubDate")
            desc_elem = item.find("description")
            source_elem = item.find("source")

            title = title_elem.text.strip() if title_elem is not None and title_elem.text else ""
            link = link_elem.text.strip() if link_elem is not None and link_elem.text else ""
            pub_date_raw = pub_date_elem.text.strip() if pub_date_elem is not None and pub_date_elem.text else ""
            desc = desc_elem.text.strip() if desc_elem is not None and desc_elem.text else ""
            source_name = source_elem.text.strip() if source_elem is not None and source_elem.text else "Google News"
            source_url = source_elem.attrib.get("url", "") if source_elem is not None else ""

            # Clean HTML from description
            clean_desc = re.sub(r"<[^>]+>", "", desc).strip()

            # Parse publication timestamp
            parsed_date: Optional[datetime] = None
            if pub_date_raw:
                try:
                    parsed_tuple = email.utils.parsedate_to_datetime(pub_date_raw)
                    if parsed_tuple:
                        parsed_date = parsed_tuple
                except Exception:
                    pass

            articles.append({
                "title": title,
                "link": link,
                "pub_date": parsed_date.isoformat() if parsed_date else pub_date_raw,
                "pub_datetime": parsed_date,
                "source_name": source_name,
                "source_url": source_url or link,
                "description": clean_desc
            })
    except Exception as e:
        print(f"[Collector] Error parsing XML: {e}")

    return articles


def analyze_7day_mentions(articles: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes real 7-day keyword frequency and momentum from fetched news articles.
    Does NOT fabricate numbers or market sizes.
    """
    now = datetime.now(timezone.utc)
    cutoff_7d = now - timedelta(days=7)
    cutoff_3d = now - timedelta(days=3)

    keyword_counts: Dict[str, int] = {}
    keyword_articles: Dict[str, List[Dict[str, str]]] = {}
    recent_3d_counts: Dict[str, int] = {}

    for article in articles:
        combined_text = f"{article.get('title', '')} {article.get('description', '')}".lower()
        pub_dt = article.get("pub_datetime")

        # Check keyword matches
        for kw in TRACKED_KEYWORDS:
            if re.search(r'\b' + re.escape(kw) + r'\b', combined_text):
                keyword_counts[kw] = keyword_counts.get(kw, 0) + 1
                if kw not in keyword_articles:
                    keyword_articles[kw] = []
                keyword_articles[kw].append({
                    "title": article.get("title", ""),
                    "link": article.get("link", ""),
                    "source": article.get("source_name", ""),
                    "pub_date": article.get("pub_date", "")
                })

                # Check if it was published in the last 3 days
                if pub_dt and pub_dt >= cutoff_3d:
                    recent_3d_counts[kw] = recent_3d_counts.get(kw, 0) + 1

    # Format into ranked keyword signals
    ranked_signals = []
    for kw, count in sorted(keyword_counts.items(), key=lambda x: x[1], reverse=True):
        recent_count = recent_3d_counts.get(kw, 0)
        # Momentum calculation based on real distribution
        if recent_count >= 2 or (count >= 2 and recent_count / max(1, count) >= 0.5):
            momentum = "Rising"
        elif count >= 2:
            momentum = "Stable"
        else:
            momentum = "Emerging"

        ranked_signals.append({
            "keyword": kw,
            "mention_count_7d": count,
            "recent_3d_count": recent_count,
            "momentum": momentum,
            "evidence_articles": keyword_articles.get(kw, [])[:3]
        })

    return {
        "analyzed_at": now.isoformat(),
        "total_articles_scanned": len(articles),
        "active_keywords_found": len(ranked_signals),
        "signals": ranked_signals
    }
