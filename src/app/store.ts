import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

import modeReducer from "../features/mode/modeSlice";
import settingsReducer from "../features/settings/settingsSlice";
import horaReducer from "../features/hora/horaSlice";
import haipaiReducer from "../features/haipai/haipaiSlice";

export const store = configureStore({
  reducer: {
    mode: modeReducer,
    settings: settingsReducer,
    hora: horaReducer,
    haipaiSetting: haipaiReducer,
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
