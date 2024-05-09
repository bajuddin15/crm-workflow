import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface workflowState {
  workflows: Array<any>;
  triggers: Array<any>;
  actions: Array<any>;
  currentWorkflow: any;
  actionItemTags: Array<any>;
  reEnrollment: boolean;
}

const tags = [
  {
    "Contact Name": "{{contact.name}}",
  },
  {
    "Contact Email": "{{contact.email}}",
  },
  {
    "Contact Phone": "{{contact.phoneNumber}}",
  },
  {
    "Group Name": "{{contact.groupName}}",
  },
  {
    "To Number": "{{toNumber}}",
  },
  {
    "From Number": "{{fromNumber}}",
  },
  {
    Message: "{{message}}",
  },
  {
    "Media Url": "{{mediaUrl}}",
  },
  {
    "Template Name": "{{templateName}}",
  },
  {
    "Template Language": "{{templateLang}}",
  },
  {
    "Delay Time": "{{delayTime}}",
  },
  {
    "Delay Formate": "{{delayFormate}}",
  },
  {
    seconds: "seconds",
  },
  {
    minutes: "minutes",
  },
  {
    hours: "hours",
  },
  {
    days: "days",
  },
  {
    voiceText: "{{voiceText}}",
  },
];

const initialState: workflowState = {
  workflows: [],
  triggers: [],
  actions: [],
  currentWorkflow: null,
  actionItemTags: tags,
  reEnrollment: true,
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
    setCurrentWorkflow: (state, action) => {
      state.currentWorkflow = action.payload;
    },
    setActionItemTags: (state, action) => {
      state.actionItemTags = action.payload;
    },
    setReEnrollment: (state, action: PayloadAction<boolean>) => {
      state.reEnrollment = action.payload;
    },
  },
});

export const {
  addWorkflows,
  addTriggers,
  addActions,
  setCurrentWorkflow,
  setActionItemTags,
  setReEnrollment,
} = workflowSlice.actions;

export default workflowSlice.reducer;
