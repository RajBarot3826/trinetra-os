from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
import sys

# Add current dir to path to import models
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from models.ml_engine import get_hotspots, get_network_graph

app = FastAPI(title="TRINETRA AI OS", version="1.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = 'data/trinetra.db'

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"status": "TRINETRA AI Engine is running", "version": "1.0"}

@app.get("/api/firs")
def get_recent_firs(limit: int = 50):
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM firs ORDER BY date DESC LIMIT ?", (limit,))
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/hotspots")
def fetch_hotspots():
    hotspots = get_hotspots(db_path=DB_PATH)
    return {"hotspots": hotspots}

@app.get("/api/network")
def fetch_network():
    network = get_network_graph(db_path=DB_PATH)
    return network

@app.post("/api/crimegpt")
def crimegpt_chat(request: ChatRequest):
    """
    Simulated CrimeGPT endpoint that answers common demo questions.
    In a real scenario, this would use an LLM API with RAG against the DB.
    """
    msg = request.message.lower()
    
    if "vehicle theft" in msg or "whitefield" in msg:
        response = "I have analyzed the recent data. There is a cluster of 8 Vehicle Thefts in Whitefield over the last 72 hours. Graph analytics suggest this is orchestrated by a syndicate linked to 'Suspect ID 42'. I recommend deploying 2 undercover units to Sector 4."
    elif "predict" in msg or "hotspot" in msg:
        response = "Based on Temporal Fusion Transformer forecasts, the highest risk area for tomorrow night is Koramangala (85% probability for assault/burglary). Re-routing Patrol Unit 7 is advised."
    elif "connect" in msg or "suspect" in msg:
        response = "Scanning criminal network... Found hidden connections. Suspects A and B have never been arrested together, but both share financial transactions with 'Suspect C', a known gang leader in Electronic City. Check the Network view for the hierarchy."
    else:
        response = "I am TRINETRA CrimeGPT. I am analyzing the intelligence graph. Please ask me about recent crime trends, predict future hotspots, or map criminal connections."
        
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    # Make sure DB exists
    if not os.path.exists(DB_PATH):
        print("Database not found. Please run 'python data/generate_dataset.py' first.")
    else:
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
