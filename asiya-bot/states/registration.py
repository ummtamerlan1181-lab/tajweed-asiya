from aiogram.fsm.state import State, StatesGroup


class Registration(StatesGroup):
    name        = State()
    age         = State()
    reads_quran = State()
    level       = State()
    difficulties = State()
    for_whom    = State()
    online_ok   = State()
    contact     = State()
