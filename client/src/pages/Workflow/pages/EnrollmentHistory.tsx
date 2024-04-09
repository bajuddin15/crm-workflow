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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/workflowHistory/allHistory/${workflowId}`
        );
        if (data && data?.success) {
          setAllHistory(data?.data);
        }
        setLoading(false);
      } catch (error: any) {
        console.log("Error : ", error.message);
      }
    };
    fetchHistory();
  }, [workflowId]);
  return (
    <div>
      <Layout>
        <div className="container py-10 min-h-screen bg-white dark:bg-slate-800">
          {loading ? (
            <div className="flex items-center justify-center">
              <Loading bgColor="rgba(0,0,255,0.5)" />
            </div>
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 dark:border dark:border-gray-700">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                        className="bg-white cursor-pointer border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <th
                          scope="row"
                          className="px-6 py-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {item?.actionId?._id}
                        </th>
                        <th
                          scope="row"
                          className="px-6 py-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {item?.contact}
                        </th>
                        <td className="px-6 py-6">{createdDate}</td>
                        <td className="px-6 py-6">
                          {item?.actionId?.name || item?.actionName}
                          {item?.actionId?.unqName === "delay" && (
                            <span>
                              {`: ${item?.actionId?.delayTime} ${item?.actionId?.delayFormate}`}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-6">
                          {" "}
                          <div className="flex items-center gap-2">
                            {item?.status === "waiting" ? (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-4 py-2 rounded-full dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
                                Waiting
                              </span>
                            ) : item?.status === "finshed" ? (
                              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-4 py-2 rounded-full dark:bg-gray-700 dark:text-green-400 border border-green-400">
                                Finshed
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-4 py-2 rounded-full dark:bg-gray-700 dark:text-red-400 border border-red-400">
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
          )}
        </div>
      </Layout>
    </div>
  );
};

export default EnrollmentHistory;
