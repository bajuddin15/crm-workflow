import Layout from "./Layout";
import AddNewTrigger from "../../components/AddNewTrigger";
import useData from "./data";
import AddNewAction from "../../components/AddNewAction";
import { workflowActions, workflowTriggers } from "./constants";
import { Trash2 } from "lucide-react";
import Loading from "../../components/Loading";

// builder page

const Workflow = () => {
  const { state, handleDeleteWorkflowAction, handleDeleteWorkflowTrigger } =
    useData();
  const { workflowId, triggers, actions, loading } = state;
  return (
    <div className="bg-white">
      <Layout>
        <div className="flex flex-col items-center justify-center bg-gray-50 min-h-[80vh] py-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <Loading bgColor={"rgba(0,0,255,0.5)"} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              {/* render trigger if already added one trigger */}
              {triggers.length > 0 ? (
                <div className="p-3 bg-white shadow-sm cursor-pointer border border-solid border-gray-300 flex items-center justify-between gap-4 w-52 rounded-md">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-blue-500">
                      Trigger
                    </span>
                    <span className="text-sm text-gray-500">
                      {triggers[0]?.name}
                    </span>
                  </div>
                  <div
                    onClick={() =>
                      handleDeleteWorkflowTrigger(triggers[0]?._id)
                    }
                    className="cursor-pointer w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md"
                  >
                    <Trash2 size={12} color="gray" />
                  </div>
                </div>
              ) : (
                <AddNewTrigger
                  workflowTriggers={workflowTriggers}
                  workflowId={workflowId}
                />
              )}
              <div className="w-[1px] h-10 bg-gray-300"></div>
              <AddNewAction
                workflowActions={workflowActions}
                workflowId={workflowId}
              />
              {actions?.map((item) => {
                return (
                  <>
                    <div className="w-[1px] h-10 bg-gray-300"></div>
                    <div className="p-3 bg-white shadow-sm cursor-pointer border border-solid border-gray-300 flex items-center justify-between gap-4 w-52 rounded-md">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-blue-500">
                          Action
                        </span>
                        <span className="text-sm text-gray-500">
                          {item?.name}
                        </span>
                      </div>
                      <div
                        onClick={() => handleDeleteWorkflowAction(item?._id)}
                        className="cursor-pointer w-6 h-6 flex items-center justify-center  rounded-md"
                      >
                        <Trash2 size={14} color="gray" />
                      </div>
                    </div>
                    <div className="w-[1px] h-10 bg-gray-300"></div>
                    <AddNewAction
                      workflowActions={workflowActions}
                      workflowId={workflowId}
                    />
                  </>
                );
              })}

              <div className="w-[1px] h-10 bg-gray-300"></div>
              <div className="bg-gray-200 text-gray-500 cursor-pointer text-sm px-4 py-1 rounded-full">
                <span>END</span>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Workflow;
