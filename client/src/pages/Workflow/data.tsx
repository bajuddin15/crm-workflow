import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RootState } from "../../store/reducers";
import {
  addActions,
  addTriggers,
  setActionItemTags,
  setCurrentWorkflow,
  setFilterLabels,
} from "../../store/slices/workflowSlice";
import { itemTags, parseDataInJSON } from "../../utils";

interface IState {
  triggers: Array<any>;
  actions: Array<any>;
  workflow: any;
  workflowName: string;
  workflowStatus: string;
  updateLoading: boolean;
  selectedTrigger: any;
  loading: boolean;
  deleteWorkflowLoading: boolean;
}

const useData = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { id: workflowId } = params;
  const [searchParams] = useSearchParams();
  const token: string | null = searchParams.get("token");
  const navigate = useNavigate();

  const triggers = useSelector(
    (state: RootState) => state?.workflowStore?.triggers
  );
  const actions = useSelector(
    (state: RootState) => state?.workflowStore?.actions
  );

  // reEnrollment
  const reEnrollment = useSelector(
    (state: RootState) => state.workflowStore.reEnrollment
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
  const [deleteWorkflowLoading, setDeleteWorkflowLoading] =
    useState<IState["deleteWorkflowLoading"]>(false);

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
        let webhookRespData = data?.data?.webhookResponse || [];
        let webhookLabelValue = webhookRespData.map((item: any) => ({
          label: `webhook.${item?.key}`,
          value: `webhook.${item?.key}`,
        }));
        if (webhookLabelValue?.length > 0) {
          dispatch(
            setFilterLabels({ label: "Webhook", options: webhookLabelValue })
          );
        }
        let parsedRespData = parseDataInJSON(data?.data?.apiResponse);
        let webhookResp = parseDataInJSON(data?.data?.webhookResponse);
        setWorkflow(data?.data);
        dispatch(setCurrentWorkflow(data?.data));
        if (parsedRespData?.length > 0 || webhookResp?.length > 0) {
          dispatch(
            setActionItemTags([
              ...itemTags,
              { Webhook: [...parsedRespData, ...webhookResp] },
            ])
          );
        }
        setWorkflowName(data?.data?.name);
        setWorkflowStatus(data?.data?.status);
      }
    } catch (error: any) {
      console.log("Fetch workflow error : ", error.message);
    }
  };

  const handleUpdateWorkflow = async () => {
    setUpdateLoading(true);
    const formData = {
      name: workflowName,
      status: workflowStatus,
      reEnrollment,
    };
    try {
      const { data } = await axios.put(`/api/workflow/${workflowId}`, formData);
      if (data && data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    } catch (error: any) {
      console.log("Error in workflow update : ", error?.message);
      toast.error("Something went wrong");
    }
    setUpdateLoading(false);
  };

  const handleDeleteWorkflowAction = async (actionId: string) => {
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

  const handleDeleteWorkflow = async (workflowId: string | undefined) => {
    if (!workflowId) {
      toast.error("workflow not found");
      return;
    }
    try {
      setDeleteWorkflowLoading(true);
      const { data } = await axios.delete(`/api/workflow/${workflowId}`);
      if (data && data.success) {
        toast.success(data?.message);
        navigate(`/?token=${token}`);
      } else {
        toast.error(data?.message);
      }
      setDeleteWorkflowLoading(false);
    } catch (error: any) {
      let errResp = error?.response?.data;
      if (errResp) {
        toast.error(errResp?.message);
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
    token,
    workflowId,
    triggers,
    actions,
    workflow,
    workflowName,
    workflowStatus,
    updateLoading,
    selectedTrigger,
    loading,
    deleteWorkflowLoading,
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
    handleDeleteWorkflow,
  };
};

export default useData;
