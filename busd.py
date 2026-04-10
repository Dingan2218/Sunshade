from playwright.sync_api import sync_playwright
import json

BASE_URL = "https://www.kbuses.in"

all_data = []

PLACES = [
    "Kochi", "Thrissur", "Calicut", "Trivandrum",
    "Kannur", "Palakkad", "Kottayam", "Alappuzha",
    "Ernakulam", "Kasaragod", "Malappuram"
]


def get_inputs(page):
    page.wait_for_selector("input", timeout=60000)
    inputs = page.query_selector_all("input")

    if len(inputs) < 2:
        raise Exception("❌ Inputs not found")

    return inputs[0], inputs[1]


def fill_input(page, input_box, text):
    input_box.click()
    input_box.fill("")
    input_box.fill(text)

    page.wait_for_timeout(800)

    page.keyboard.press("ArrowDown")
    page.keyboard.press("Enter")

    page.wait_for_timeout(800)


def extract_data(page, src, dst):
    data = []

    elements = page.query_selector_all("div, li")

    for el in elements[:60]:
        try:
            text = el.inner_text().strip()

            if len(text) > 30:
                data.append({
                    "from": src,
                    "to": dst,
                    "data": text
                })
        except:
            pass

    return data


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)

        for src in PLACES:
            for dst in PLACES:

                if src == dst:
                    continue

                print(f"\n🚀 {src} → {dst}")

                try:
                    page = browser.new_page()
                    page.goto(BASE_URL)
                    page.wait_for_timeout(4000)

                    # ✅ FIX: get inputs every time
                    from_input, to_input = get_inputs(page)

                    fill_input(page, from_input, src)
                    fill_input(page, to_input, dst)

                    page.keyboard.press("Enter")
                    page.wait_for_timeout(4000)

                    results = extract_data(page, src, dst)
                    all_data.extend(results)

                    page.close()

                except Exception as e:
                    print("❌ Error:", e)

        browser.close()

    with open("bus_data.json", "w", encoding="utf-8") as f:
        json.dump(all_data, f, indent=2, ensure_ascii=False)

    print(f"\n✅ DONE: {len(all_data)} records saved")


if __name__ == "__main__":
    run()