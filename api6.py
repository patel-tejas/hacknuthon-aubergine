from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from collections import defaultdict
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import uvicorn

app = FastAPI()

# MongoDB Configuration
MONGO_URI = "mongodb+srv://tejas:hn5NumpMCz4WhM1g@cluster0.ogdjiko.mongodb.net/hacknuthon?retryWrites=true&w=majority"
SANCTIONED_COUNTRIES = {"Iran", "North Korea", "Syria", "Russia", "Cuba", "Sudan"}

class TransactionFeatures(BaseModel):
    amount_usd: float
    from_country: str
    to_country: str
    hour: float
    from_tx_count: float
    from_avg_amount: float
    from_total_amount: float
    to_tx_count: float
    to_avg_amount: float
    to_total_amount: float
    is_midnight: int
    is_high_amount: int
    is_new_sender: int

def get_db_connection():
    try:
        client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
        client.admin.command('ping')
        return client
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MongoDB connection failed: {str(e)}")

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "AML Fraud Detection API",
        "status": "active",
        "endpoints": {
            "analyze": "/analyze (POST)",
            "health": "/health (GET)"
        }
    }

@app.get("/health", tags=["Health Check"])
async def health_check():
    try:
        client = get_db_connection()
        client.admin.command('ping')
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'client' in locals():
            client.close()

@app.post("/analyze", tags=["Transaction Analysis"])
async def analyze_transaction(features: TransactionFeatures):
    try:
        client = get_db_connection()
        db = client.hacknuthon
        
        # Get recent transactions
        transactions = list(db.transactions.find({
            'timestamp': {'$gte': datetime.now() - timedelta(hours=24)}
        }))
        
        # Analyze transaction patterns
        loop_analysis = detect_transaction_loops(transactions)
        risk_analysis = assess_risk(features)
        
        return {
            "transaction": {
                "from": features.from_country,
                "to": features.to_country,
                "amount": f"${features.amount_usd:,.2f}"
            },
            "loop_analysis": loop_analysis,
            "risk_analysis": risk_analysis,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'client' in locals():
            client.close()

def detect_transaction_loops(transactions: List) -> Dict:
    """Detect circular transaction patterns"""
    if not transactions:
        return {"detected": False, "message": "✅ No recent transactions found"}
    
    graph = defaultdict(list)
    amounts = defaultdict(list)
    
    # Build transaction graph
    for tx in transactions:
        graph[tx['from']].append(tx['to'])
        amounts[(tx['from'], tx['to'])].append(tx['amount_usd'])
    
    # Detect cycles using DFS
    cycles = []
    visited = set()
    
    def dfs(node, path):
        if node in path:
            cycle = path[path.index(node):] + [node]
            if len(cycle) > 2:  # Minimum 3-node loop
                cycles.append(cycle)
            return
        if node in visited:
            return
        visited.add(node)
        for neighbor in graph.get(node, []):
            dfs(neighbor, path + [node])
    
    for node in graph:
        dfs(node, [])
    
    if not cycles:
        return {"detected": False, "message": "✅ No suspicious loops detected"}
    
    # Analyze the largest cycle
    main_cycle = max(cycles, key=len)
    total_amount = sum(
        sum(amounts[(main_cycle[i], main_cycle[i+1])])
        for i in range(len(main_cycle)-1)
    )
    
    return {
        "detected": True,
        "cycle_size": len(main_cycle),
        "participants": main_cycle,
        "total_amount": f"${total_amount:,.2f}",
        "risk_indicators": [
            "🔴 High-risk circular pattern",
            f"🔄 {len(main_cycle)}-node transaction loop",
            f"💸 Total amount cycled: ${total_amount:,.2f}",
            "⚠️ Potential money laundering pattern"
        ]
    }

def assess_risk(features: TransactionFeatures) -> Dict:
    """Evaluate transaction risk factors"""
    risk_factors = []
    risk_score = 0.0
    
    # Amount analysis
    if features.amount_usd > 10000:
        risk_factors.append("💰 High value (>$10k)")
        risk_score += 0.3
    elif features.amount_usd > 5000:
        risk_factors.append("💵 Medium value (>$5k)")
        risk_score += 0.15
    
    # Geographic analysis
    if features.from_country in SANCTIONED_COUNTRIES:
        risk_factors.append(f"🌍 Sanctioned sender: {features.from_country}")
        risk_score += 0.4
    if features.to_country in SANCTIONED_COUNTRIES:
        risk_factors.append(f"🗺️ Sanctioned recipient: {features.to_country}")
        risk_score += 0.3
    
    # Temporal analysis
    if features.is_midnight:
        risk_factors.append("🌙 Midnight transaction (3AM-5AM)")
        risk_score += 0.1
    
    # Behavioral analysis
    if features.from_tx_count > 10:
        risk_factors.append("🔔 High sender activity (>10 tx)")
        risk_score += 0.2
    elif features.from_tx_count > 5:
        risk_factors.append("🛎️ Moderate sender activity (>5 tx)")
        risk_score += 0.1
    
    # New sender risk
    if features.is_new_sender:
        risk_factors.append("👤 New sender (no history)")
        risk_score += 0.15
    
    # Determine risk level
    risk_level = (
        "🔴 Critical" if risk_score > 0.7 else
        "🟠 High" if risk_score > 0.5 else
        "🟡 Medium" if risk_score > 0.3 else
        "🟢 Low"
    )
    
    return {
        "score": min(risk_score, 1.0),
        "level": risk_level,
        "factors": risk_factors,
        "actions": [
            "📝 File SAR report" if risk_score > 0.7 else None,
            "🔒 Temporary hold" if risk_score > 0.5 else None,
            "🧐 Enhanced review" if risk_score > 0.3 else "✅ Approve normally"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)