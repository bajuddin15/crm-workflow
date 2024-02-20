import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers"; // You'll define your reducers in this file

const store = configureStore({
  reducer: rootReducer,
});

export default store;
