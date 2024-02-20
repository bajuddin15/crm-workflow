import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import workflowReducer from "./slices/workflowSlice";

const rootReducer = combineReducers({
  // Add other reducers here
  counter: counterReducer,
  workflowStore: workflowReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
