from celery import Celery
import os
import requests
from .models import SessionLocal, Submission

redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
celery = Celery("tasks", broker=redis_url, backend=redis_url)

ML_SERVER = os.getenv("ML_SERVER_URL", "http://ml_server:8001")

@celery.task
def enqueue_job(job_id: str, input_type: str, input_value: str):
    db = SessionLocal()
    job = db.query(Submission).filter(Submission.id==job_id).first()
    try:
        job.status = "processing"
        db.add(job); db.commit()
        # call ML server
        payload = {"input_type": input_type, "input_value": input_value}
        r = requests.post(f"{ML_SERVER}/predict", json=payload, timeout=600)
        r.raise_for_status()
        result = r.json()
        job.result = result
        job.status = "done"
    except Exception as e:
        job.status = "failed"
        job.result = {"error": str(e)}
    finally:
        db.add(job); db.commit()
