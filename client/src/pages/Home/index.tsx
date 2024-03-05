import CreateWorkflow from "./Components/CreateWorkflow";
import useData from "./data";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { state, fetchAllWorkflows } = useData();
  const { token, workflows } = state;

  const navigate = useNavigate();
  console.log("...workflows", workflows);
  return (
    <div className="container py-20">
      {/* headers */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold">Workflow List</span>
          <span className="text-sm text-gray-500 dark:text-white">
            Create and manage Workflows to automate business processes, <br />{" "}
            improve efficiency, and increase conversions.
          </span>
        </div>

        <div>
          <CreateWorkflow token={token} fetchAllWorkflows={fetchAllWorkflows} />
        </div>
      </div>
      <div className="my-10 relative overflow-x-auto shadow-sm border border-gray-200 sm:rounded-lg">
        {workflows?.length === 0 ? (
          <div className="py-4 px-4">
            <span className="text-sm">
              Workflows not found, Please create workflow..
            </span>
          </div>
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-6">
                  Name
                </th>
                <th scope="col" className="px-6 py-6">
                  Status
                </th>
                <th scope="col" className="px-6 py-6">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-6">
                  Created On
                </th>
              </tr>
            </thead>
            <tbody>
              {workflows?.map((item) => {
                const createdDate = moment(item?.createdAt).format(
                  "MMM DD YYYY, h:mm A"
                );
                const updatedDate = moment(item?.updatedAt).format(
                  "MMM DD YYYY, h:mm A"
                );
                return (
                  <tr
                    key={item?._id}
                    className="bg-white cursor-pointer border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() =>
                      navigate(`/workflow/${item?._id}/?token=${token}`)
                    }
                  >
                    <th
                      scope="row"
                      className="px-6 py-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item?.name}
                    </th>
                    <td className="px-6 py-6">
                      <div>
                        {item?.status === "draft" ? (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-4 py-2 rounded-full dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
                            Draft
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-4 py-2 rounded-full dark:bg-gray-700 dark:text-green-400 border border-green-400">
                            Published
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">{updatedDate}</td>
                    <td className="px-6 py-6">{createdDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Home;
