import sqlite3

DB_NAME = "history.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS analysis_history (
            id TEXT PRIMARY KEY,
            filename TEXT,
            disease_name TEXT,
            disease_readable TEXT,
            is_healthy INTEGER DEFAULT 0,
            confidence REAL,
            reasoning TEXT,
            timestamp REAL
        )
    ''')
    conn.commit()
    conn.close()

def add_entry(entry: dict):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        INSERT INTO analysis_history (id, filename, disease_name, disease_readable, is_healthy, confidence, reasoning, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        entry['id'],
        entry['filename'],
        entry['disease_name'],
        entry.get('disease_readable', ''),
        1 if entry.get('is_healthy', False) else 0,
        entry['confidence'],
        entry['reasoning'],
        entry['timestamp']
    ))
    conn.commit()
    conn.close()

def get_all_entries():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM analysis_history ORDER BY timestamp DESC')
    rows = c.fetchall()
    conn.close()
    results = []
    for row in rows:
        d = dict(row)
        d['is_healthy'] = bool(d.get('is_healthy', 0))
        results.append(d)
    return results

def delete_all_entries():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('DELETE FROM analysis_history')
    conn.commit()
    conn.close()
