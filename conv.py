import json
import re
import sqlite3

INPUT_FILE = "bus_data.json"
FINAL_FILE = "final_clean.json"
DB_FILE = "buses.db"


# -------------------------------
# 🧠 SMART VALIDATION
# -------------------------------
def is_real_bus(text):
    if "KSRTC" not in text and "RTC" not in text:
        return False

    if not re.search(r'\d{1,2}:\d{2}', text):
        return False

    if len(text) < 40:
        return False

    return True


# -------------------------------
# 🧠 SMART PARSER
# -------------------------------
def parse_bus(text):
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    operator = None
    route = None
    bus_type = None
    departure = None
    arrival = None
    duration = None

    for line in lines:

        # operator
        if "KSRTC" in line or "RTC" in line:
            operator = line

        # route (contains 2 places)
        elif "  " in line and len(line.split()) >= 2:
            route = line

        # bus type
        elif any(x in line for x in [
            "Fast", "Deluxe", "AC", "Express", "Passenger", "Air Bus"
        ]):
            bus_type = line

        # duration
        elif "hours" in line or "minutes" in line:
            duration = line

        # arrival
        elif "@" in line:
            arrival = line

        # time
        elif re.search(r'\d{1,2}:\d{2}\s?(am|pm)', line, re.IGNORECASE):
            if departure is None:
                departure = line

    # reject incomplete entries
    if not operator or not departure:
        return None

    return {
        "operator": operator,
        "route": route,
        "bus_type": bus_type,
        "departure": departure,
        "arrival": arrival,
        "duration": duration
    }


# -------------------------------
# 🔄 PROCESS PIPELINE
# -------------------------------
def process():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        raw = json.load(f)

    final = []
    seen = set()

    for item in raw:
        text = item["data"]

        # 🔥 STRICT FILTER
        if not is_real_bus(text):
            continue

        parsed = parse_bus(text)

        if not parsed:
            continue

        key = (
            item["from"],
            item["to"],
            parsed["departure"],
            parsed["route"]
        )

        if key in seen:
            continue

        seen.add(key)

        final.append({
            "from": item["from"],
            "to": item["to"],
            **parsed
        })

    print(f"✅ Final clean buses: {len(final)}")

    with open(FINAL_FILE, "w", encoding="utf-8") as f:
        json.dump(final, f, indent=2, ensure_ascii=False)

    return final


# -------------------------------
# 🗄️ SAVE TO DB
# -------------------------------
def save_db(data):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS buses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT,
        destination TEXT,
        operator TEXT,
        route TEXT,
        bus_type TEXT,
        departure TEXT,
        arrival TEXT,
        duration TEXT
    )
    """)

    for bus in data:
        c.execute("""
        INSERT INTO buses (
            source, destination, operator, route,
            bus_type, departure, arrival, duration
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            bus["from"], bus["to"], bus["operator"],
            bus["route"], bus["bus_type"],
            bus["departure"], bus["arrival"],
            bus["duration"]
        ))

    conn.commit()
    conn.close()

    print("✅ Database saved")


# -------------------------------
# 🚀 MAIN
# -------------------------------
def main():
    print("🚀 Processing REAL bus data only...")

    data = process()
    save_db(data)

    print("🔥 DONE — CLEAN DATA READY")


if __name__ == "__main__":
    main()