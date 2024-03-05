import React, { ReactNode } from "react";
import { ChevronLeft, Pencil } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useData from "./data";
import Loading from "../../components/Loading";
import Switcher from "../../components/Switcher";

interface IProps {
  children: ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  const {
    state,
    setWorkflowName,
    setWorkflowStatus,
    handleUpdateWorkflow,
    handleDeleteWorkflow,
  } = useData();
  const {
    token,
    workflowId,
    workflowName,
    workflowStatus,
    updateLoading,
    deleteWorkflowLoading,
    actions,
  } = state;

  const disablePublishBtn = actions.length > 0 ? false : true;

  const location = useLocation();
  const pathname = location?.pathname;

  console.log("location.pathname", {
    pathname,
    path: `/workflow/${workflowId}/?token=${token}`,
  });

  return (
    <div className="flex flex-col">
      {/* header */}
      <div className="container h-14 border-b border-b-gray-200 dark:border-b-gray-700 text-sm flex items-center justify-between bg-white text-black dark:bg-slate-800 dark:text-white">
        <Link to={`/?token=${token}`}>
          <div className="flex items-center gap-2 cursor-pointer">
            <ChevronLeft size={28} />
            <span className="font-medium">Back to Workflows</span>
          </div>
        </Link>
        <div className="flex items-center gap-4 hover:bg-gray-100 px-3 hover:border-2 hover:border-gray-500">
          <input
            className="py-2 w-full bg-inherit border-none outline-none"
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />
          <Pencil size={16} />
        </div>
        <div className="flex items-center gap-4">
          {/* light and dark mode switch */}
          <div>
            <Switcher />
          </div>
          <button
            onClick={() => handleDeleteWorkflow(workflowId)}
            className="w-16 h-9 flex items-center justify-center text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            {deleteWorkflowLoading ? (
              <Loading bgColor="#fff" />
            ) : (
              <span>Delete</span>
            )}
          </button>
          <button
            onClick={handleUpdateWorkflow}
            className="w-16 h-9 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {updateLoading ? <Loading bgColor="#fff" /> : <span>Save</span>}
          </button>
        </div>
      </div>

      {/* menu header */}
      <div className="container bg-white flex items-center justify-between border-b border-b-gray-200 dark:border-b-gray-700 dark:bg-slate-800">
        <div></div>
        <div className="flex items-center gap-8 text-sm">
          <Link
            to={`/workflow/${workflowId}/?token=${token}`}
            className={`py-3 tracking-wide ${
              pathname === `/workflow/${workflowId}/`
                ? "border-b-2 border-b-blue-500 text-blue-500"
                : "border-b-2 border-white dark:border-slate-800"
            }  hover:text-blue-500 hover:border-b-2 hover:border-blue-500 text-black dark:text-white`}
          >
            Builder
          </Link>
          <Link
            to={`/workflow/${workflowId}/settings/?token=${token}`}
            className={`py-3 tracking-wide ${
              pathname === `/workflow/${workflowId}/settings/`
                ? "border-b-2 border-b-blue-500 text-blue-500"
                : "border-b-2 border-white dark:border-slate-800"
            } hover:text-blue-500 hover:border-b-2 hover:border-blue-500 text-black dark:text-white`}
          >
            Settings
          </Link>
          <Link
            to={`/workflow/${workflowId}/status/?token=${token}`}
            className={`py-3 tracking-wide ${
              pathname === `/workflow/${workflowId}/status/`
                ? "border-b-2 border-b-blue-500 text-blue-500"
                : "border-b-2 border-white dark:border-slate-800"
            } hover:text-blue-500 hover:border-b-2 hover:border-blue-500 text-black dark:text-white`}
          >
            Enrollment History
          </Link>
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span>Draft</span>
            <input
              type="checkbox"
              disabled={disablePublishBtn}
              className={`toggle toggle-sm ${
                workflowStatus === "draft"
                  ? "[--tglbg:white]"
                  : "[--tglbg:blue]"
              }  ${
                workflowStatus === "draft"
                  ? "bg-blue-700 hover:bg-blue-600"
                  : "bg-white hover:bg-white"
              }  border-blue-500`}
              checked={workflowStatus === "draft" ? false : true}
              onChange={() =>
                setWorkflowStatus(
                  workflowStatus === "draft" ? "publish" : "draft"
                )
              }
            />
            <span>Publish</span>
          </div>
        </div>
      </div>

      {/* children */}
      <div className="">{children}</div>
    </div>
  );
};

export default Layout;
