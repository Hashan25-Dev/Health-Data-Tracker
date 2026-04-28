# 🏥 Health Data Tracker

A full-stack web application for tracking daily health metrics (weight, steps, calories), viewing trends through interactive charts, and getting ML-powered predictions for the next 7 days.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Flask](https://img.shields.io/badge/Flask-3.1-000?logo=flask)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)
![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?logo=scikit-learn)

---

## ✨ Features

### Core
- **Log daily health data** — weight (kg), steps, calories, with date
- **CRUD operations** — Add, view, edit, and delete records
- **Interactive charts** — Weight, steps, and calories trends over time (Recharts)
- **Summary statistics** — Averages, min/max, latest values (Pandas)
- **ML Predictions** — 7-day forecasts using Linear Regression (scikit-learn)

### Bonus
- 🔐 **JWT Authentication** — Signup/login with token-based auth
- 🎯 **Goal Tracking** — Set a target weight and track progress
- 📥 **CSV Export** — Download all records as a CSV file
- 🌙 **Dark Mode** — Toggle between light and dark themes

---

## 🏗️ Architecture

```
health-data-tracker/
├── backend/                    # Flask REST API
│   ├── app.py                  # App factory + entry point
│   ├── config.py               # Database & JWT configuration
│   ├── models.py               # SQLAlchemy ORM models
│   ├── generate_sample_data.py # Seed 90 days of realistic data
│   ├── requirements.txt        # Python dependencies
│   ├── routes/
│   │   ├── records.py          # CRUD endpoints
│   │   ├── stats.py            # Statistics endpoint
│   │   ├── predict.py          # ML prediction endpoint
│   │   ├── auth.py             # JWT authentication
│   │   └── export.py           # CSV export
│   └── utils/
│       ├── data_processing.py  # Pandas aggregation helpers
│       └── ml_model.py         # Linear Regression model
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar          # Navigation bar
│   │   │   ├── SummaryCard     # Stat cards
│   │   │   ├── HealthChart     # Recharts line/area charts
│   │   │   ├── RecordForm      # Add/Edit form
│   │   │   ├── PredictionChart # Historical + predicted chart
│   │   │   └── GoalTracker     # Weight goal progress
│   │   ├── pages/
│   │   │   ├── Dashboard       # Main dashboard
│   │   │   ├── AddRecord       # Add/edit record
│   │   │   ├── Predictions     # ML predictions
│   │   │   └── Login           # Authentication
│   │   └── services/
│   │       └── api.js          # Axios API service
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Python 3.10+** installed
- **Node.js 18+** and npm installed

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Generate sample data (90 days)
python generate_sample_data.py

# Start the Flask server
python app.py
```

Backend runs at: **http://localhost:5000**

### 2. Frontend Setup

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 📡 API Documentation

| Method   | Endpoint         | Description                              |
|----------|------------------|------------------------------------------|
| `GET`    | `/`              | Health check                             |
| `POST`   | `/add`           | Add a health record                      |
| `GET`    | `/records`       | Get all records (sorted by date)         |
| `PUT`    | `/update/<id>`   | Update a record                          |
| `DELETE` | `/delete/<id>`   | Delete a record                          |
| `GET`    | `/stats`         | Summary statistics (avg, min, max, etc.) |
| `GET`    | `/predict`       | ML predictions (next 7 days)             |
| `POST`   | `/auth/signup`   | Create a new user account                |
| `POST`   | `/auth/login`    | Login and receive JWT token              |
| `GET`    | `/export/csv`    | Download records as CSV                  |

### Example: Add a Record

```bash
curl -X POST http://localhost:5000/add \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-04-27", "weight": 75.5, "steps": 8500, "calories": 2100}'
```

### Example: Get Predictions

```bash
curl http://localhost:5000/predict
```

Response:
```json
{
  "predictions": [
    {"date": "2026-04-28", "predicted_weight": 74.8, "predicted_steps": 9200, "predicted_calories": 2050},
    ...
  ],
  "model_accuracy": {"weight_r2": 0.85, "steps_r2": 0.45, "calories_r2": 0.30},
  "training_samples": 90
}
```

---

## 🧠 Machine Learning

The prediction engine uses **scikit-learn's Linear Regression**:

1. Converts dates to ordinal numbers (numerical features)
2. Trains separate models for weight, steps, and calories
3. Predicts the next 7 days from the last recorded date
4. Returns predictions with R² accuracy scores

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Recharts, Axios         |
| Backend    | Flask, Flask-CORS, Flask-JWT-Extended    |
| Database   | SQLite (via SQLAlchemy ORM)             |
| Data       | Pandas                                  |
| ML         | scikit-learn (LinearRegression)         |
| Styling    | Vanilla CSS with custom properties      |

---

## 📄 License

MIT License — free to use for learning and portfolio purposes.
