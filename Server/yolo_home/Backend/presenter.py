from __future__ import annotations

from typing import Protocol

from Backend.Model.model import Model

class View(Protocol):
    ...
    
class Presenter:
    def __init__(self,model: Model,view: View) -> None:
        self.model = model
        self.view = view
        
        
    def handle_get_temp(self) -> list[float]:
        #return self.model.getTemp()
        pass
        
    def handle_get_humid(self) -> list[float]:
        pass 
        
    def listenAda(self) -> None:
        self.model.listen()

