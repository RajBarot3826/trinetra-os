import sqlite3
import pandas as pd
from sklearn.cluster import DBSCAN
import numpy as np

def get_hotspots(db_path='trinetra.db', eps=0.015, min_samples=5):
    """
    Uses DBSCAN to cluster recent FIRs into geographical hotspots.
    eps: The maximum distance between two samples for one to be considered as in the neighborhood of the other. (approx 1.5km)
    min_samples: The number of samples in a neighborhood for a point to be considered as a core point.
    """
    try:
        conn = sqlite3.connect(db_path)
        df = pd.read_sql_query("SELECT id, lat, lng, crime_type, district FROM firs ORDER BY date DESC LIMIT 200", conn)
        conn.close()

        if df.empty:
            return []

        coords = df[['lat', 'lng']].values
        
        # Convert eps to radians for Haversine if using actual haversine distance.
        # For simplicity in MVP, we use standard euclidean on projected lat/lng (good enough for small city scale)
        db = DBSCAN(eps=eps, min_samples=min_samples).fit(coords)
        
        df['cluster'] = db.labels_
        
        hotspots = []
        # Filter out noise (-1)
        clusters = df[df['cluster'] != -1]
        
        for cluster_id, group in clusters.groupby('cluster'):
            center_lat = group['lat'].mean()
            center_lng = group['lng'].mean()
            main_crime = group['crime_type'].mode()[0] if not group.empty else "Mixed"
            
            hotspots.append({
                "cluster_id": int(cluster_id),
                "lat": center_lat,
                "lng": center_lng,
                "intensity": len(group),
                "primary_crime": main_crime,
                "district": group['district'].iloc[0]
            })
            
        return hotspots
    except Exception as e:
        print(f"Error in ML Engine: {e}")
        return []

def get_network_graph(db_path='trinetra.db'):
    """
    Retrieves the criminal network for the frontend force graph.
    """
    try:
        conn = sqlite3.connect(db_path)
        nodes_df = pd.read_sql_query("SELECT id, name, risk_score, status FROM criminals", conn)
        edges_df = pd.read_sql_query("SELECT source_id as source, target_id as target, relationship_type, weight FROM criminal_network", conn)
        conn.close()

        nodes = []
        for _, row in nodes_df.iterrows():
            nodes.append({
                "id": str(row['id']),
                "name": row['name'],
                "val": row['risk_score'] / 10,  # node size
                "status": row['status']
            })

        links = []
        for _, row in edges_df.iterrows():
            links.append({
                "source": str(row['source']),
                "target": str(row['target']),
                "type": row['relationship_type'],
                "value": row['weight']
            })

        return {"nodes": nodes, "links": links}
    except Exception as e:
        print(f"Error getting network: {e}")
        return {"nodes": [], "links": []}
