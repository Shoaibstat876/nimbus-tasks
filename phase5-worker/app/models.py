from pydantic import BaseModel
from typing import Optional, Any, Dict

class CloudEvent(BaseModel):
    id: str
    source: str
    specversion: str = "1.0"
    type: str
    datacontenttype: Optional[str] = "application/json"
    data: Dict[str, Any]
