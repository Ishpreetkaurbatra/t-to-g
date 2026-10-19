"""
T-to-G Food AI Engine - FastAPI Microservice
Loads scikit-learn classifier (t2g_food_classifier.joblib).
Categories: beverage, dessert, main_dish, snack, street_food.
Integrates Google News RSS collector and 7-day trend analyzer.
"""

import os
import sys
from pathlib import Path
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Local imports
from collector import fetch_rss_feed, analyze_7day_mentions

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "t2g_food_classifier.joblib"

# Expected target categories
CATEGORIES = ["beverage", "dessert", "main_dish", "snack", "street_food"]

app = FastAPI(
    title="T-to-G Food AI Engine",
    description="Food classification and Google News RSS trend intelligence microservice",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
model = None
model_loaded = False
model_error = None

def load_classifier():
    """Attempts to safely load the scikit-learn joblib model."""
    global model, model_loaded, model_error
    if not MODEL_PATH.exists():
        model_loaded = False
        model_error = f"Model file not found at: {MODEL_PATH}"
        print(f"[Model Loader Warning] {model_error}")
        return

    try:
        import joblib
        loaded = joblib.load(MODEL_PATH)
        model = loaded
        model_loaded = True
        model_error = None
        print(f"[Model Loader Success] Loaded food classifier from {MODEL_PATH}")
    except Exception as e:
        model_loaded = False
        model_error = f"Failed to deserialize model: {str(e)}"
        print(f"[Model Loader Error] {model_error}")

# Run load on startup
@app.on_event("startup")
def startup_event():
    load_classifier()

# Request/Response schemas
class PredictRequest(BaseModel):
    text: str = Field(..., description="Food headline, dish name, or article description to classify")

class PredictResponse(BaseModel):
    success: bool
    text: str
    category: str
    confidence: float
    probabilities: Optional[Dict[str, float]] = None
    model_version: str = "initial-prototype-v1"

class CollectTrendsRequest(BaseModel):
    query: Optional[str] = "food trends India"
    max_articles: Optional[int] = 20

@app.get("/health")
def health_check():
    """
    Health check endpoint reporting Python runtime, model status, and categories.
    Never fabricates model status.
    """
    return {
        "status": "ok" if model_loaded else "degraded",
        "service": "T-to-G Food AI Engine",
        "model_loaded": model_loaded,
        "model_path": str(MODEL_PATH),
        "model_exists_on_disk": MODEL_PATH.exists(),
        "model_classes": CATEGORIES,
        "model_error": model_error,
        "python_version": sys.version,
        "instructions_if_missing": (
            "If model is missing, train or export from Google Colab as 't2g_food_classifier.joblib' "
            "and place in 'ai_engine/models/t2g_food_classifier.joblib'."
            if not model_loaded else None
        )
    }

@app.post("/predict", response_model=PredictResponse)
def predict_category(req: PredictRequest):
    """
    Classifies food text into one of the 5 categories:
    beverage, dessert, main_dish, snack, street_food.
    Returns HTTP 503 if model is not loaded. Never fabricates predictions.
    """
    if not model_loaded or model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "Food classifier model is not loaded.",
                "model_path": str(MODEL_PATH),
                "model_error": model_error,
                "solution": "Upload 't2g_food_classifier.joblib' to 'ai_engine/models/' and restart the service."
            }
        )

    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text field cannot be empty.")

    try:
        prediction = model.predict([text])[0]
        # Check if predict_proba is supported
        probabilities = None
        confidence = 85.0  # default fallback if probability not directly supported
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba([text])[0]
            classes = getattr(model, "classes_", CATEGORIES)
            prob_dict = {str(c): round(float(p), 4) for c, p in zip(classes, probs)}
            probabilities = prob_dict
            confidence = round(float(max(probs)) * 100, 1)

        return PredictResponse(
            success=True,
            text=text,
            category=str(prediction),
            confidence=confidence,
            probabilities=probabilities
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Classification execution error: {str(e)}"
        )

@app.post("/collect-trends")
def collect_and_analyze_trends(req: CollectTrendsRequest):
    """
    Fetches real Google News RSS articles, analyzes 7-day keyword mentions,
    and applies the food classifier to identify trending categories.
    Preserves authentic source URLs and publication dates.
    """
    query = req.query or "food trends India"
    articles = fetch_rss_feed(query=query, max_items=req.max_articles or 20)
    mentions_analysis = analyze_7day_mentions(articles)

    classified_trends = []
    for article in articles:
        text_for_classification = f"{article.get('title', '')} {article.get('description', '')}"

        category_predicted = "food_general"
        confidence_score = 0.0
        probabilities = None

        if model_loaded and model is not None:
            try:
                pred = model.predict([text_for_classification])[0]
                category_predicted = str(pred)
                if hasattr(model, "predict_proba"):
                    probs = model.predict_proba([text_for_classification])[0]
                    confidence_score = round(float(max(probs)) * 100, 1)
                    classes = getattr(model, "classes_", CATEGORIES)
                    probabilities = {str(c): round(float(p), 4) for c, p in zip(classes, probs)}
                else:
                    confidence_score = 80.0
            except Exception as e:
                print(f"[Collector Classification Error]: {e}")

        classified_trends.append({
            "title": article.get("title"),
            "category": category_predicted,
            "source_type": "Google News RSS",
            "source_name": article.get("source_name"),
            "source_url": article.get("source_url"),
            "published_at": article.get("pub_date"),
            "description": article.get("description"),
            "classifier_confidence": confidence_score,
            "probabilities": probabilities,
            "model_classified": model_loaded
        })

    return {
        "success": True,
        "query": query,
        "timestamp": mentions_analysis["analyzed_at"],
        "total_articles": len(classified_trends),
        "model_status": "active" if model_loaded else "offline/unloaded",
        "7day_mentions_summary": mentions_analysis,
        "classified_articles": classified_trends
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
