import { useEffect, useState } from "react";
import Layout from "../Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import Loading from "../../../components/Loading";
import ShowApiRespModal from "./Components/ShowApiRespModal";

// interface IProps {
//   workflowId: any;
// }

const EnrollmentHistory = () => {
  const params = useParams();
  const { id: workflowId } = params;
  const [allHistory, setAllHistory] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const handleNextClick = () => {
    setPage(page + 1);
  };

  const handlePrevClick = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/workflowHistory/allHistory/${workflowId}/?page=${page}`
        );
        if (data && data?.success) {
          setAllHistory(data?.data);
          setTotalPages(data?.totalPages);
          setTotalResults(data?.totalResults);
        }
        setLoading(false);
      } catch (error: any) {
        console.log("Error : ", error.message);
      }
    };
    fetchHistory();
  }, [workflowId, page]);

  return (
    <div>
      <Layout>
        <div className="container py-10 min-h-screen bg-white ">
          {loading ? (
            <div className="flex items-center justify-center">
              <Loading bgColor="rgba(0,0,255,0.5)" />
            </div>
          ) : (
            <div className="">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" className="px-6 py-6">
                        Action Id
                      </th>
                      <th scope="col" className="px-6 py-6">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-6">
                        Date Enrolled
                      </th>
                      <th scope="col" className="px-6 py-6">
                        Current Action
                      </th>
                      <th scope="col" className="px-6 py-6">
                        Current Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allHistory?.map((item) => {
                      const createdDate = moment(item?.createdAt).format(
                        "MMM DD YYYY, h:mm A"
                      );
                      // const updatedDate = moment(item?.updatedAt).format(
                      //   "MMM DD YYYY, h:mm A"
                      // );
                      return (
                        <tr
                          key={item?._id}
                          className="bg-white cursor-pointer border-b  hover:bg-gray-50 "
                        >
                          <th
                            scope="row"
                            className="p-4 font-medium text-gray-900 whitespace-nowrap "
                          >
                            {item?.actionId?._id
                              ? item?.actionId?._id
                              : "Not Applicable"}
                          </th>
                          <th
                            scope="row"
                            className="p-4 font-medium text-gray-900 whitespace-nowrap "
                          >
                            {item?.contact}
                          </th>
                          <td className="p-4">{createdDate}</td>
                          <td className="p-4">
                            {item?.actionId?.name || item?.actionName
                              ? item?.actionId?.name || item?.actionName
                              : "Not Applicable"}
                            {item?.actionId?.unqName === "delay" && (
                              <span>
                                {`: ${item?.actionId?.delayTime} ${item?.actionId?.delayFormate}`}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {" "}
                            <div className="flex items-center gap-2">
                              {item?.status === "waiting" ? (
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-4 py-2 rounded-full  border border-yellow-300">
                                  Waiting
                                </span>
                              ) : item?.status === "skipped" ? (
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-4 py-2 rounded-full  border border-yellow-300">
                                  Skipped
                                </span>
                              ) : item?.status === "finshed" ? (
                                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-4 py-2 rounded-full  border border-green-400">
                                  Finshed
                                </span>
                              ) : (
                                <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-4 py-2 rounded-full border border-red-400">
                                  Failed
                                </span>
                              )}
                              {(item?.apiResponse?.length > 0 ||
                                item?.actionName === "REST API") && (
                                <ShowApiRespModal data={item?.apiResponse} />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-2">
                <span className="text-sm">
                  Showing {(page - 1) * 10 + 1}-
                  {(page - 1) * 10 + allHistory?.length} of {totalResults}
                </span>
              </div>
              {/* pagination  */}
              <div className="flex items-center justify-between mt-5">
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
      </Layout>
    </div>
  );
};

export default EnrollmentHistory;
