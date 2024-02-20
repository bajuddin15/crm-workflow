import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWorkflows } from "../../store/slices/workflowSlice";
import { RootState } from "../../store/reducers";

// interface IState {
//   workflows: Array<any>;
// }

const useData = () => {
  const dispatch = useDispatch();
  const workflows = useSelector(
    (state: RootState) => state?.workflowStore?.workflows
  );

  // const [workflows, setWorkflows] = useState<IState["workflows"]>([]);

  const fetchAllWorkflows = async () => {
    try {
      const { data } = await axios.get(
        "/api/workflow/all/OMs5rXuCphJxcYqSnmVP9RQAy"
      );
      dispatch(addWorkflows(data?.data));
      // setWorkflows(data?.data);
      console.log("workflows: ", data);
    } catch (error: any) {
      console.log("Fetching workflows error: ", error?.message);
    }
  };

  useEffect(() => {
    fetchAllWorkflows();
  }, []);

  const state = {
    workflows,
  };

  return {
    state,
    fetchAllWorkflows,
  };
};

export default useData;
