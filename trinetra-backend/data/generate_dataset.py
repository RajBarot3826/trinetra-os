import sqlite3
import random
import datetime
import os
from faker import Faker

fake = Faker('en_IN')

# Bengaluru specific locations
BENGALURU_LOCATIONS = [
    {"name": "Whitefield", "lat": 12.9698, "lng": 77.7499},
    {"name": "Indiranagar", "lat": 12.9784, "lng": 77.6408},
    {"name": "Koramangala", "lat": 12.9279, "lng": 77.6271},
    {"name": "Jayanagar", "lat": 12.9299, "lng": 77.5834},
    {"name": "Electronic City", "lat": 12.8399, "lng": 77.6770},
    {"name": "Malleswaram", "lat": 13.0031, "lng": 77.5643},
    {"name": "HSR Layout", "lat": 12.9121, "lng": 77.6446},
    {"name": "Yelahanka", "lat": 13.1007, "lng": 77.5963},
]

CRIME_TYPES = ["Vehicle Theft", "Burglary", "Cyber Fraud", "Assault", "Drug Trafficking", "Chain Snatching"]

def generate_database(db_path='trinetra.db'):
    if os.path.exists(db_path):
        os.remove(db_path)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create tables
    cursor.execute('''
        CREATE TABLE criminals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age INTEGER,
            risk_score INTEGER,
            last_known_location TEXT,
            status TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE firs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fir_number TEXT,
            crime_type TEXT,
            description TEXT,
            date TEXT,
            lat REAL,
            lng REAL,
            district TEXT,
            status TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE criminal_network (
            source_id INTEGER,
            target_id INTEGER,
            relationship_type TEXT,
            weight INTEGER,
            FOREIGN KEY(source_id) REFERENCES criminals(id),
            FOREIGN KEY(target_id) REFERENCES criminals(id)
        )
    ''')

    # Insert Criminals
    print("Generating Criminals...")
    criminals_data = []
    for _ in range(50):
        criminals_data.append((
            fake.name(),
            random.randint(18, 65),
            random.randint(10, 99),
            random.choice(BENGALURU_LOCATIONS)["name"],
            random.choice(["Active", "Arrested", "Wanted"])
        ))
    cursor.executemany("INSERT INTO criminals (name, age, risk_score, last_known_location, status) VALUES (?, ?, ?, ?, ?)", criminals_data)

    # Insert FIRs
    print("Generating FIRs...")
    firs_data = []
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=365)
    
    for _ in range(500):
        loc = random.choice(BENGALURU_LOCATIONS)
        # Add slight jitter to coordinates
        lat = loc["lat"] + random.uniform(-0.01, 0.01)
        lng = loc["lng"] + random.uniform(-0.01, 0.01)
        crime_date = start_date + datetime.timedelta(seconds=random.randint(0, int((end_date - start_date).total_seconds())))
        
        firs_data.append((
            f"FIR/{fake.random_int(min=1000, max=9999)}/{crime_date.year}",
            random.choice(CRIME_TYPES),
            fake.sentence(nb_words=10),
            crime_date.strftime("%Y-%m-%dT%H:%M:%S"),
            lat,
            lng,
            loc["name"],
            random.choice(["Open", "Closed", "Under Investigation"])
        ))
    cursor.executemany("INSERT INTO firs (fir_number, crime_type, description, date, lat, lng, district, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", firs_data)

    # Insert Criminal Network
    print("Generating Criminal Network...")
    network_data = []
    for _ in range(100):
        src = random.randint(1, 50)
        tgt = random.randint(1, 50)
        if src != tgt:
            network_data.append((
                src,
                tgt,
                random.choice(["Associate", "Gang Member", "Financial Link"]),
                random.randint(1, 10)
            ))
    cursor.executemany("INSERT INTO criminal_network (source_id, target_id, relationship_type, weight) VALUES (?, ?, ?, ?)", network_data)

    conn.commit()
    conn.close()
    print("Database generated successfully at", db_path)

if __name__ == "__main__":
    generate_database()
