import { combineReducers } from "@reduxjs/toolkit";
import workflowReducer from "./slices/workflowSlice";

const rootReducer = combineReducers({
  // Add other reducers here
  workflowStore: workflowReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
