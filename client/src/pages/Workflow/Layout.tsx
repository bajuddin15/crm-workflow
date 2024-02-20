import React, { ReactNode } from "react";
import { ChevronLeft, Pencil } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useData from "./data";
import Loading from "../../components/Loading";

interface IProps {
  children: ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  const { state, setWorkflowName, setWorkflowStatus, handleUpdateWorkflow } =
    useData();
  const { workflowId, workflowName, workflowStatus, updateLoading } = state;

  const location = useLocation();
  const pathname = location?.pathname;

  console.log("location.pathname", pathname);

  return (
    <div className="flex flex-col">
      {/* header */}
      <div className="container h-14 border-b border-b-gray-200 text-sm flex items-center justify-between">
        <Link to="/">
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
        <div>
          <button
            onClick={handleUpdateWorkflow}
            className="w-16 h-10 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {updateLoading ? <Loading bgColor="#fff" /> : <span>Save</span>}
          </button>
        </div>
      </div>

      {/* menu header */}
      <div className="bg-white container flex items-center justify-between border-b border-b-gray-200 ">
        <div></div>
        <div className="flex items-center gap-8 text-sm">
          <Link
            to={`/workflow/${workflowId}`}
            className={`py-3 tracking-wide ${
              pathname === `/workflow/${workflowId}`
                ? "border-b-2 border-b-blue-500 text-blue-500"
                : "border-b-2 border-white"
            }  hover:text-blue-500 hover:border-b-2 hover:border-blue-500`}
          >
            Builder
          </Link>
          <Link
            to={`/workflow/${workflowId}/settings`}
            className={`py-3 tracking-wide ${
              pathname === `/workflow/${workflowId}/settings`
                ? "border-b-2 border-b-blue-500 text-blue-500"
                : "border-b-2 border-white"
            } hover:text-blue-500 hover:border-b-2 hover:border-blue-500`}
          >
            Settings
          </Link>
          <Link
            to={`/workflow/${workflowId}/status`}
            className={`py-3 tracking-wide ${
              pathname === `/workflow/${workflowId}/status`
                ? "border-b-2 border-b-blue-500 text-blue-500"
                : "border-b-2 border-white"
            } hover:text-blue-500 hover:border-b-2 hover:border-blue-500`}
          >
            Enrollment History
          </Link>
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span>Draft</span>
            <input
              type="checkbox"
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
