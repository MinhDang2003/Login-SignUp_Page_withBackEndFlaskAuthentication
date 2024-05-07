from typing import Protocol

class Presenter(Protocol):
    def handle_get_temp(self) -> list[float]:
        ...
    def handle_get_humid(self) -> list[float]:
        ...

class View():
    def __init__(self) -> None:
        pass
    def get_temp(presenter: Presenter)-> list[float]:
        return presenter.handle_get_temp()
    def get_humid(presenter: Presenter)-> list[float]:
        return presenter.handle_get_humid()