import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface workflowState {
  workflows: Array<any>;
  triggers: Array<any>;
  actions: Array<any>;
}

const initialState: workflowState = {
  workflows: [],
  triggers: [],
  actions: [],
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    addWorkflows: (state, action: PayloadAction<any>) => {
      state.workflows = action.payload;
    },
    addTriggers: (state, action: PayloadAction<any>) => {
      state.triggers = action.payload;
    },
    addActions: (state, action: PayloadAction<any>) => {
      state.actions = action.payload;
    },
  },
});

export const { addWorkflows, addTriggers, addActions } = workflowSlice.actions;

export default workflowSlice.reducer;
