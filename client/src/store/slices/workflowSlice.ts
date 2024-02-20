import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface workflowState {
  workflows: Array<any>;
}

const initialState: workflowState = {
  workflows: [],
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    addWorkflows: (state, action: PayloadAction<any>) => {
      state.workflows = action.payload;
    },
  },
});

export const { addWorkflows } = workflowSlice.actions;

export default workflowSlice.reducer;
