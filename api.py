from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from pydantic import BaseModel
import requests
import uuid, os
from .tasks import enqueue_job
from .schemas import SubmissionCreate, SubmissionOut
from .models import init_db, SessionLocal, Submission

router = APIRouter()
init_db()  # create tables if not exists

API_ML_SERVER = os.getenv("ML_SERVER_URL", "http://ml_server:8001")

@router.post("/submit", response_model=SubmissionOut)
async def submit_item(data: SubmissionCreate, background_tasks: BackgroundTasks):
    """
    Accepts a sequence (protein/DNA/RNA) or SMILES. Enqueue job and return job id.
    """
    db = SessionLocal()
    job_id = str(uuid.uuid4())
    new = Submission(id=job_id, input_type=data.input_type, input_value=data.input_value, status="queued")
    db.add(new); db.commit(); db.refresh(new)
    # enqueue background task
    enqueue_job.delay(job_id, data.input_type, data.input_value)
    return SubmissionOut.from_orm(new)

@router.get("/status/{job_id}", response_model=SubmissionOut)
def get_status(job_id: str):
    db = SessionLocal()
    job = db.query(Submission).filter(Submission.id==job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return SubmissionOut.from_orm(job)

@router.get("/fetch_pdb/{pdb_id}")
def fetch_pdb(pdb_id: str):
    """
    Fetch raw PDB file from RCSB
    """
    pdb_url = f"https://files.rcsb.org/download/{pdb_id}.pdb"
    r = requests.get(pdb_url)
    if r.status_code != 200:
        raise HTTPException(status_code=404, detail="PDB not found")
    return {"pdb": r.text}

