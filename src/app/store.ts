import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

import counterReducer from "../features/counter/counterSlice";
import modeReducer from "../features/mode/modeSlice";
import settingsReducer from "../features/settings/settingsSlice";
import gameReducer from "../features/game/gameSlice";
import horaReducer from "../features/hora/horaSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    mode: modeReducer,
    settings: settingsReducer,
    // game: gameReducer,
    hora: horaReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
