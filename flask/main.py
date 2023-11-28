from flask import Flask, request
from os import getenv
from datetime import datetime
from pathlib import Path
from uuid import uuid4

import csv

app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"


@app.after_request
def after_request(response):
    # cors
    origin = "*"

    response.headers.add(
        "Access-Control-Allow-Origin",
        origin,
    )
    response.headers.add(
        "Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With"
    )
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    response.headers.add("Access-Control-Allow-Credentials", "true")

    return response


@app.route("/final-score", methods=["POST", "OPTIONS"])
def store_score():
    if request.method == "OPTIONS":
        return ""
    data = request.get_json()
    score = data.get("score")
    times = data.get("times")
    id = str(uuid4())

    with open(Path(__file__).resolve().parent / "scores.csv", "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([id, score])

    with open(Path(__file__).resolve().parent / "times.csv", "a", newline="") as file:
        writer = csv.writer(file)
        for time in times:
            writer.writerow([id, time["problem"], time["time"]])

    return "Score stored successfully"


if __name__ == "__main__":
    port = getenv("PORT")

    app.run(host="0.0.0.0", debug=bool(port), port=port if port else 5000)
