from sqlalchemy import create_engine, Column, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://appuser:passw0rd@postgres:5432/drugdb")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(String, primary_key=True, index=True)
    input_type = Column(String)
    input_value = Column(String)
    status = Column(String)
    result = Column(JSON, default={})

def init_db():
    Base.metadata.create_all(bind=engine)
