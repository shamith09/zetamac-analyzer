from flask import Flask, request
from os import getenv
from dotenv import load_dotenv
import psycopg2
from uuid import uuid4

load_dotenv()

app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"

def get_db_connection():
    return psycopg2.connect(
        dbname=getenv("PGDATABASE"),
        user=getenv("PGUSER"),
        password=getenv("PGPASSWORD"),
        host=getenv("PGHOST"),
        port=getenv("PGPORT"),
    )

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

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            try:
                query = "INSERT INTO scores (score) VALUES (%s) RETURNING id"
                values = (score,)
                cursor.execute(query, values)
                inserted_id = cursor.fetchone()[0]

                data = [(inserted_id, obj["problem"], obj["time"]) for obj in times]

                query = "INSERT INTO times (id, problem, time) VALUES (%s, %s, %s)"
                cursor.executemany(query, data)
                conn.commit()
            except psycopg2.DatabaseError as e:
                conn.rollback()
                raise e

    return "Score stored successfully"

if __name__ == "__main__":
    port = getenv("PORT")
    app.run(host="0.0.0.0", debug=bool(port), port=port if port else 5000)
