from pydantic import BaseModel

class SubmissionCreate(BaseModel):
    input_type: str  # "protein" | "dna" | "rna" | "smiles"
    input_value: str

class SubmissionOut(BaseModel):
    id: str
    input_type: str
    input_value: str
    status: str
    result: dict | None = None

    class Config:
        orm_mode = True
