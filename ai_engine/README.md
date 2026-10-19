# T-to-G Food AI Engine (Python FastAPI Microservice)

This microservice houses the **T-to-G Food Classifier** and **Google News RSS Trend Collector**. It bridges your scikit-learn model with the T-to-G web application cleanly without running Python binaries directly inside Node.js.

---

## 1. Directory Structure

```
ai_engine/
├── main.py              # FastAPI server (health, predict, collect-trends endpoints)
├── collector.py         # Google News RSS fetcher and 7-day keyword mention counter
├── requirements.txt     # Python dependencies (FastAPI, scikit-learn, joblib, etc.)
└── models/
    └── t2g_food_classifier.joblib  # Scikit-learn trained food classifier model file
```

---

## 2. Model Specification & Google Colab Export

The model classifies text into 5 target categories:
- `beverage`
- `dessert`
- `main_dish`
- `snack`
- `street_food`

### How to Export from Google Colab to this Project:
If you retrain or update your model in Google Colab, export it as follows:

```python
import joblib

# Assuming 'pipeline' or 'model' is your fitted scikit-learn model/pipeline:
joblib.dump(pipeline, 't2g_food_classifier.joblib')

# Download to your local machine:
from google.colab import files
files.download('t2g_food_classifier.joblib')
```

**Target Location**:
Place the downloaded file exactly at:
```
t-to-g-main/ai_engine/models/t2g_food_classifier.joblib
```

> **Note**: If this file is missing or fails to load, the service health check will report `model_loaded: false`, and prediction requests will return a clear HTTP 503 explanation rather than fabricated predictions.

---

## 3. Local Setup & Running Instructions

### Step 1: Install Python 3.10+
Ensure Python 3.10 or 3.11 is installed on your system.

### Step 2: Create a Virtual Environment
From the `ai_engine` directory:

```bash
cd ai_engine

# On Windows:
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux:
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run the Service
```bash
# Start FastAPI with Uvicorn on port 5001:
uvicorn main:app --host 0.0.0.0 --port 5001 --reload
```

The service will now be available at `http://127.0.0.1:5001`.
- Swagger Docs: `http://127.0.0.1:5001/docs`
- Health check: `http://127.0.0.1:5001/health`

---

## 4. API Endpoints

### `GET /health`
Returns runtime status, whether the model file is loaded, and the 5 supported categories.

**Response Example**:
```json
{
  "status": "ok",
  "service": "T-to-G Food AI Engine",
  "model_loaded": true,
  "model_classes": ["beverage", "dessert", "main_dish", "snack", "street_food"],
  "python_version": "3.11.x"
}
```

### `POST /predict`
Classifies a food text string into one of the 5 categories.

**Request Payload**:
```json
{
  "text": "Artisanal cold brew infused with organic almond milk and cardamom"
}
```

**Response Example**:
```json
{
  "success": true,
  "text": "Artisanal cold brew infused with organic almond milk and cardamom",
  "category": "beverage",
  "confidence": 92.4,
  "probabilities": {
    "beverage": 0.924,
    "dessert": 0.021,
    "main_dish": 0.012,
    "snack": 0.035,
    "street_food": 0.008
  }
}
```

### `POST /collect-trends`
Fetches real Google News RSS articles, calculates 7-day keyword frequencies and velocities, and tags each article with its predicted food category.

---

## 5. Node.js Backend Connection

The existing Node.js Express server connects to this microservice via an environment variable.
In your `.env` file:

```env
FOOD_AI_SERVICE_URL="http://127.0.0.1:5001"
```

For production deployments, change `FOOD_AI_SERVICE_URL` to your hosted Python service URL (e.g. on Cloud Run, Render, or Railway).
