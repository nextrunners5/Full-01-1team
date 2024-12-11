import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import projectReducer from "./reducers/projectSlice";
import scheduleReducer from "./reducers/scheduleSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    schedule: scheduleReducer
  }
});

export default store;
