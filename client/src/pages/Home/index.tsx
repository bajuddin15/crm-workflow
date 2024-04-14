import CreateWorkflow from "./Components/CreateWorkflow";
import useData from "./data";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { state, fetchAllWorkflows, handleNextClick, handlePrevClick } =
    useData();
  const { token, page, totalPages, totalResults, workflows } = state;

  const navigate = useNavigate();
  return (
    <div className="container py-20 min-h-screen">
      {/* headers */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-lg text-gray-700 font-semibold">
            Workflow List
          </span>
          <span className="text-sm text-gray-500">
            Create and manage Workflows to automate business processes, <br />{" "}
            improve efficiency, and increase conversions.
          </span>
        </div>

        <div>
          <CreateWorkflow token={token} fetchAllWorkflows={fetchAllWorkflows} />
        </div>
      </div>
      <div className="my-10 relative overflow-x-auto">
        {workflows?.length === 0 ? (
          <div className="py-4 px-4">
            <span className="text-sm">
              Workflows not found, Please create workflow..
            </span>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="shadow-sm border border-gray-200 rounded-lg">
                <table className="w-full  text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="p-6">
                        Name
                      </th>
                      <th scope="col" className="p-6">
                        Status
                      </th>
                      <th scope="col" className="p-6">
                        Last Updated
                      </th>
                      <th scope="col" className="p-6">
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
                          className="bg-white cursor-pointer border-b hover:bg-gray-50"
                          onClick={() =>
                            navigate(`/workflow/${item?._id}/?token=${token}`)
                          }
                        >
                          <th
                            scope="row"
                            className="p-6 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {item?.name}
                          </th>
                          <td className="p-6">
                            <div>
                              {item?.status === "draft" ? (
                                <span
                                  className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-4 py-2 rounded-full
                                  border border-yellow-300"
                                >
                                  Draft
                                </span>
                              ) : (
                                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-4 py-2 rounded-full border border-green-400">
                                  Published
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-6">{updatedDate}</td>
                          <td className="p-6">{createdDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div>
                <span className="text-sm">
                  Showing {(page - 1) * 10 + 1}-
                  {(page - 1) * 10 + workflows?.length} of {totalResults}
                </span>
              </div>
            </div>

            {/* pagination  */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevClick}
                disabled={page === 1}
                className={`flex items-center justify-center px-4 h-10 text-base font-medium ${
                  page === 1
                    ? "bg-gray-200 text-gray-500 border border-gray-200"
                    : "text-white bg-blue-500 hover:bg-gray-100 hover:text-gray-700"
                } rounded-lg `}
              >
                <svg
                  className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 5H1m0 0 4 4M1 5l4-4"
                  />
                </svg>
                Previous
              </button>
              <button
                onClick={handleNextClick}
                disabled={totalPages <= page}
                className={`flex items-center justify-center px-4 h-10 text-base font-medium ${
                  totalPages <= page
                    ? "bg-gray-200 text-gray-500 border border-gray-200"
                    : "text-white bg-blue-500 hover:bg-gray-100 hover:text-gray-700"
                } rounded-lg `}
              >
                Next
                <svg
                  className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
