import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWorkflows } from "../../store/slices/workflowSlice";
import { RootState } from "../../store/reducers";
import { useSearchParams } from "react-router-dom";

const useData = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token: string | null = searchParams.get("token");

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
  const workflows = useSelector(
    (state: RootState) => state?.workflowStore?.workflows
  );

  const fetchAllWorkflows = async () => {
    try {
      const { data } = await axios.get(
        `/api/workflow/all/${token}/?page=${page}`
      );

      setTotalPages(data?.totalPages);
      setTotalResults(data?.totalResults);
      dispatch(addWorkflows(data?.data));
    } catch (error: any) {
      console.log("Fetching workflows error: ", error?.message);
    }
  };

  useEffect(() => {
    fetchAllWorkflows();
  }, [token, page]);

  const state = {
    token,
    page,
    totalPages,
    totalResults,
    workflows,
  };

  return {
    state,
    setPage,
    fetchAllWorkflows,
    handleNextClick,
    handlePrevClick,
  };
};

export default useData;
