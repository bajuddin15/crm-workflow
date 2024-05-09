import React from "react";
import Layout from "../Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setReEnrollment } from "../../../store/slices/workflowSlice";
import { RootState } from "../../../store/reducers";

interface IState {
  // workflow: any;
  reEnrollment: boolean;
  loading: boolean;
}

const Settings = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { id: workflowId } = params;

  // const [workflow, setWorkflow] = React.useState<IState["workflow"]>(null);

  const reEnrollment = useSelector(
    (state: RootState) => state.workflowStore.reEnrollment
  );
  const [loading, setLoading] = React.useState<IState["loading"]>(false);

  const handleReEnrollmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // updateWorkflowReEnrollment(e.target.checked);
    dispatch(setReEnrollment(e.target.checked));
    // setReEnrollment(e.target.checked);
  };

  // const updateWorkflowReEnrollment = async (reEnrollment: boolean) => {
  //   try {
  //     await axios.put(`/api/workflow/${workflowId}`, {
  //       reEnrollment,
  //     });
  //   } catch (error: any) {
  //     console.log("Re-enrollment changed error : ", error?.message);
  //   }
  // };

  React.useEffect(() => {
    const fetchSingleWorkflow = async () => {
      setLoading(true);
      const { data } = await axios.get(`/api/workflow/${workflowId}`);
      if (data && data?.success) {
        dispatch(setReEnrollment(data.data.reEnrollment));
      }
      setLoading(false);
    };
    fetchSingleWorkflow();
  }, [workflowId]);

  return (
    <div>
      <Layout>
        <div className="container py-10 min-h-screen bg-white">
          {loading ? (
            <div className="flex items-center justify-center">
              <Loading bgColor="rgba(0,0,255,0.5)" />
            </div>
          ) : (
            <div className="">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-700">
                  Do you want to enroll contact multiple times in this workflow?
                </span>
                <label className="inline-flex items-center mb-5 cursor-pointer">
                  <span className="me-5 text-sm md:text-base font-medium text-gray-900">
                    Re-enrollment
                  </span>
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    onChange={handleReEnrollmentChange}
                    checked={reEnrollment}
                  />
                  <div
                    className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4
                   peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Settings;
