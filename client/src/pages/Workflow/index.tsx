import Layout from "./Layout";
import AddNewTrigger from "../../components/AddNewTrigger";
import useData from "./data";
import AddNewAction from "../../components/AddNewAction";
import { workflowActions, workflowTriggers } from "./constants";
import { Trash2 } from "lucide-react";
import Loading from "../../components/Loading";
import EditTrigger from "../../components/EditTrigger";
import EditActionModal from "../../components/ActionModal/EditActionModal";

// builder page

const Workflow = () => {
  const { state, handleDeleteWorkflowAction, handleDeleteWorkflowTrigger } =
    useData();
  const { workflowId, triggers, actions, loading } = state;
  return (
    <div className="bg-white min-h-screen dark:bg-slate-800">
      <Layout>
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800 min-h-[80vh] py-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <Loading bgColor={"rgba(0,0,255,0.5)"} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              {/* render trigger if already added one trigger */}
              {triggers.length > 0 ? (
                <div className="p-3 bg-white shadow-sm cursor-pointer border border-solid border-gray-300 flex items-center justify-between gap-4 w-64 h-20 rounded-md dark:bg-slate-800">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-blue-500">
                      Trigger
                    </span>
                    <span className="text-sm text-gray-500">
                      {triggers[0]?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <EditTrigger
                      workflowId={workflowId}
                      workflowTriggers={workflowTriggers}
                      currentTrigger={triggers[0]}
                    />
                    <div
                      onClick={() =>
                        handleDeleteWorkflowTrigger(triggers[0]?._id)
                      }
                      className="cursor-pointer w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md"
                    >
                      <Trash2 size={12} color="gray" />
                    </div>
                  </div>
                </div>
              ) : (
                <AddNewTrigger
                  workflowTriggers={workflowTriggers}
                  workflowId={workflowId}
                />
              )}
              <div className="w-[1px] h-10 bg-gray-300"></div>
              {actions.length === 0 && (
                <AddNewAction
                  workflowActions={workflowActions}
                  workflowId={workflowId}
                />
              )}
              {actions?.map((item, index) => {
                return (
                  <>
                    <div className="p-3 bg-white shadow-sm cursor-pointer border border-solid border-gray-300 flex items-center justify-between gap-4 w-64 h-20 rounded-md dark:bg-slate-800">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-blue-500">
                          Action
                        </span>
                        <span className="text-sm text-gray-500">
                          {item?.name}{" "}
                          {item.unqName === "delay" && (
                            <span>
                              {`: ${item?.delayTime} ${item?.delayFormate}`}{" "}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <EditActionModal workflowId={workflowId} item={item} />
                        <div
                          onClick={() => handleDeleteWorkflowAction(item?._id)}
                          className="cursor-pointer w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md"
                        >
                          <Trash2 size={12} color="gray" />
                        </div>
                      </div>
                    </div>
                    <div className="w-[1px] h-10 bg-gray-300"></div>
                    {index === actions.length - 1 && (
                      <AddNewAction
                        workflowActions={workflowActions}
                        workflowId={workflowId}
                      />
                    )}
                  </>
                );
              })}

              <div className="w-[1px] h-10 bg-gray-300"></div>
              <div className="bg-gray-200 text-gray-500 cursor-pointer text-sm px-4 py-1 rounded-full border border-gray-300 dark:bg-slate-800">
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
