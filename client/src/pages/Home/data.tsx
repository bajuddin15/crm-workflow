import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWorkflows } from "../../store/slices/workflowSlice";
import { RootState } from "../../store/reducers";
import { useSearchParams } from "react-router-dom";

const useData = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token: string | null = searchParams.get("token");
  const workflows = useSelector(
    (state: RootState) => state?.workflowStore?.workflows
  );

  console.log("token ---", token);

  const fetchAllWorkflows = async () => {
    try {
      const { data } = await axios.get(`/api/workflow/all/${token}`);
      dispatch(addWorkflows(data?.data));
      console.log("workflows: ", data);
    } catch (error: any) {
      console.log("Fetching workflows error: ", error?.message);
    }
  };

  useEffect(() => {
    fetchAllWorkflows();
  }, [token]);

  const state = {
    token,
    workflows,
  };

  return {
    state,
    fetchAllWorkflows,
  };
};

export default useData;
