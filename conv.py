import json
import re
import sqlite3

INPUT_FILE = "bus_data.json"
CLEAN_FILE = "cleaned.json"
FINAL_FILE = "final.json"
DB_FILE = "buses.db"


# -------------------------------
# 🧹 STEP 1: CLEAN DATA
# -------------------------------
def is_valid_bus(text):
    return (
        ("KSRTC" in text or "RTC" in text)
        and len(text) > 30
    )


def clean_data(raw):
    cleaned = []

    for item in raw:
        text = item["data"]

        # ❌ remove junk
        if any(x in text for x in [
            "Discover", "Loading", "Verified", "Unsure",
            "No Service", "dark-mode", "Service quality",
            "Bus Service Type", "Frequent searches"
        ]):
            continue

        if not is_valid_bus(text):
            continue

        cleaned.append({
            "from": item["from"],
            "to": item["to"],
            "raw": text.strip()
        })

    return cleaned


# -------------------------------
# 🧠 STEP 2: PARSE DATA
# -------------------------------
def extract_time(text):
    match = re.findall(r'\d{1,2}:\d{2}\s?(am|pm)', text, re.IGNORECASE)
    return match


def parse_bus(text):
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    result = {
        "operator": None,
        "route": None,
        "bus_type": None,
        "departure": None,
        "arrival": None,
        "duration": None
    }

    for line in lines:
        if "KSRTC" in line or "RTC" in line:
            result["operator"] = line

        elif "hours" in line or "minutes" in line:
            result["duration"] = line

        elif "@" in line:
            result["arrival"] = line

        elif re.search(r'\d{1,2}:\d{2}', line):
            result["departure"] = line

        elif any(x in line for x in [
            "Fast", "Deluxe", "AC", "Express", "Passenger"
        ]):
            result["bus_type"] = line

        elif "  " in line:
            result["route"] = line

    return result


# -------------------------------
# 🔄 STEP 3: STRUCTURE DATA
# -------------------------------
def structure_data(cleaned):
    structured = []
    seen = set()

    for item in cleaned:
        parsed = parse_bus(item["raw"])

        key = (
            item["from"],
            item["to"],
            parsed["departure"],
            parsed["route"]
        )

        if key in seen:
            continue

        seen.add(key)

        structured.append({
            "from": item["from"],
            "to": item["to"],
            **parsed
        })

    return structured


# -------------------------------
# 🗄️ STEP 4: SAVE DATABASE
# -------------------------------
def save_to_db(data):
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


# -------------------------------
# 🚀 MAIN PIPELINE
# -------------------------------
def main():
    print("🚀 Starting processing...")

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        raw = json.load(f)

    print(f"📦 Raw records: {len(raw)}")

    cleaned = clean_data(raw)
    print(f"🧹 Cleaned records: {len(cleaned)}")

    with open(CLEAN_FILE, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, indent=2, ensure_ascii=False)

    structured = structure_data(cleaned)
    print(f"🧠 Structured records: {len(structured)}")

    with open(FINAL_FILE, "w", encoding="utf-8") as f:
        json.dump(structured, f, indent=2, ensure_ascii=False)

    save_to_db(structured)

    print("✅ DONE!")
    print("📁 Files created:")
    print("- cleaned.json")
    print("- final.json")
    print("- buses.db")


if __name__ == "__main__":
    main()