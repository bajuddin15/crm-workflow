import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store/reducers";
import { addActions, addTriggers } from "../../store/slices/workflowSlice";

interface IState {
  triggers: Array<any>;
  actions: Array<any>;
  workflow: any;
  workflowName: string;
  workflowStatus: string;
  updateLoading: boolean;
  selectedTrigger: any;
  loading: boolean;
}

const useData = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { id: workflowId } = params;
  const triggers = useSelector(
    (state: RootState) => state?.workflowStore?.triggers
  );
  const actions = useSelector(
    (state: RootState) => state?.workflowStore?.actions
  );

  const [workflow, setWorkflow] = useState<IState["workflow"]>(null);
  const [workflowName, setWorkflowName] = useState<IState["workflowName"]>("");
  const [workflowStatus, setWorkflowStatus] =
    useState<IState["workflowStatus"]>("");

  const [updateLoading, setUpdateLoading] =
    useState<IState["updateLoading"]>(false);

  const [selectedTrigger, setSelectedTrigger] =
    useState<IState["selectedTrigger"]>(null);

  const [loading, setLoading] = useState<IState["loading"]>(false);
  console.log("params: ", params);

  const fetchWorkflowTriggers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/workflowTrigger/allTriggers/${workflowId}`
      );
      if (data && data?.success) {
        dispatch(addTriggers(data?.data));
      }
    } catch (error: any) {
      console.log("Fetch triggers error : ", error.message);
    }
    setLoading(false);
  };
  const fetchWorkflowActions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/workflowAction/allActions/${workflowId}`
      );
      if (data && data?.success) {
        dispatch(addActions(data?.data));
      }
    } catch (error: any) {
      console.log("Fetch workflow actions error : ", error.message);
    }
    setLoading(false);
  };

  const fetchSingleWorkflow = async () => {
    try {
      const { data } = await axios.get(`/api/workflow/${workflowId}`);
      if (data && data?.success) {
        setWorkflow(data?.data);
        setWorkflowName(data?.data?.name);
        setWorkflowStatus(data?.data?.status);
      }
      console.log("workflow --", { data, workflowId });
    } catch (error: any) {
      console.log("Fetch workflow error : ", error.message);
    }
  };

  const handleUpdateWorkflow = async () => {
    setUpdateLoading(true);
    console.log("updated workflow data --", {
      name: workflowName,
      status: workflowStatus,
    });
    const formData = {
      name: workflowName,
      status: workflowStatus,
    };
    try {
      const { data } = await axios.put(`/api/workflow/${workflowId}`, formData);
      if (data && data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    } catch (error: any) {
      console.log("workflow update error : ", error?.message);
      toast.error("Something went wrong");
    }
    setUpdateLoading(false);
  };

  const handleDeleteWorkflowAction = async (actionId: string) => {
    console.log("actionId--", actionId);

    const requestData = {
      workflowId: workflowId,
    };

    try {
      const { data } = await axios.delete(`/api/workflowAction/${actionId}`, {
        data: requestData,
      });
      if (data && data.success) {
        fetchWorkflowActions();
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(error?.message);
      }
    }
  };
  const handleDeleteWorkflowTrigger = async (triggerId: string) => {
    console.log("actionId--", triggerId);

    const requestData = {
      workflowId: workflowId,
    };

    try {
      const { data } = await axios.delete(`/api/workflowTrigger/${triggerId}`, {
        data: requestData,
      });
      if (data && data.success) {
        fetchWorkflowTriggers();
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(error?.message);
      }
    }
  };

  useEffect(() => {
    Promise.all([
      fetchSingleWorkflow(),
      fetchWorkflowTriggers(),
      fetchWorkflowActions(),
    ]);
  }, []);

  const state = {
    workflowId,
    triggers,
    actions,
    workflow,
    workflowName,
    workflowStatus,
    updateLoading,
    selectedTrigger,
    loading,
  };

  return {
    state,
    setWorkflow,
    setWorkflowName,
    setWorkflowStatus,
    setUpdateLoading,
    setSelectedTrigger,
    setLoading,
    handleUpdateWorkflow,
    handleDeleteWorkflowAction,
    handleDeleteWorkflowTrigger,
  };
};

export default useData;
