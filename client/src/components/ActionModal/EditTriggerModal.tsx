import { X } from "lucide-react";
import React, { useState } from "react";
// import component 👇
import Drawer from "react-modern-drawer";
import Loading from "../Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { addTriggers } from "../../store/slices/workflowSlice";
import { useDispatch } from "react-redux";
import useData from "./data";

interface IProps {
  item: any;
  workflowId: string;
  currentTrigger: any;
}

interface IState {
  values: any;
  loading: boolean;
}

const EditTriggerModal: React.FC<IProps> = ({
  item,
  workflowId,
  currentTrigger,
}) => {
  const dispatch = useDispatch();
  const { handleCopy } = useData();
  const [isOpenModal, setIsOpenModal] = React.useState(false);

  const [loading, setLoading] = useState<IState["loading"]>(false);

  const [values, setValues] = useState<IState["values"]>({
    workflowId: workflowId,
    name: item?.name,
    unqName: item?.unqName,
  });

  const handleToggleDrawer = () => {
    setIsOpenModal((prevState) => !prevState);
  };

  const fetchWorkflowTriggers = async () => {
    try {
      const { data } = await axios.get(
        `/api/workflowTrigger/allTriggers/${workflowId}`
      );
      if (data && data?.success) {
        dispatch(addTriggers(data?.data));
      }
    } catch (error: any) {
      console.log("Fetch triggers error : ", error.message);
    }
  };

  //   action created
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `/api/workflowTrigger/${currentTrigger?._id}`,
        values
      );
      if (data && data.success) {
        toast.success(data?.message);
        fetchWorkflowTriggers();
        handleToggleDrawer();
      } else {
        toast.error(data?.message);
      }
    } catch (error: any) {
      if (error?.response) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div
        onClick={handleToggleDrawer}
        className={`py-2 px-4 border border-gray-300 cursor-pointer rounded-md ${
          currentTrigger?.unqName === item?.unqName ? "bg-blue-500" : ""
        }`}
      >
        <span
          className={`text-sm ${
            currentTrigger?.unqName === item?.unqName
              ? "text-white"
              : "text-gray-600"
          }`}
        >
          {item?.name}
        </span>
      </div>

      <Drawer
        open={isOpenModal}
        onClose={handleToggleDrawer}
        direction="right"
        className="py-4 px-7"
        size={500}
      >
        <div>
          <div className="flex items-center justify-end">
            <div
              onClick={handleToggleDrawer}
              className="cursor-pointer hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
            >
              <X size={20} />
            </div>
          </div>
          <div className="border-b border-b-gray-200 py-4 flex flex-col">
            <span className="text-base font-semibold">{item?.name}</span>
            <span className="text-sm mt-2 text-gray-500">
              Automatically creates new contacts or updates existing ones
            </span>
          </div>

          {/* main content */}
          <div className="my-5">
            <div className="flex h-[335px] flex-col gap-1 mb-10">
              <label
                htmlFor="actionName"
                className="text-sm font-medium uppercase"
              >
                Trigger name
              </label>
              <input
                id="actionName"
                className="w-full bg-inherit px-4 py-2 outline-none text-sm  placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500"
                type="text"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />

              {/* for webhook trigger */}
              {item?.unqName === "webhook" && (
                <div className="mt-5 flex flex-col gap-5">
                  <div className="flex flex-col gap-1 text-sm">
                    <label htmlFor="webhookUrl" className="font-medium">
                      Webhook URL
                    </label>
                    <div
                      onClick={() => handleCopy(currentTrigger?.webhook_url)}
                      className="flex items-center gap-2 border border-gray-300 rounded-tl-md rounded-bl-md pl-2 hover:bg-gray-100"
                    >
                      <span
                        style={{ scrollbarWidth: "none" }}
                        className="text-sm overflow-x-auto"
                      >
                        {currentTrigger?.webhook_url}
                      </span>
                      <span className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer py-2 px-4 rounded-tr-md rounded-br-md">
                        Copy
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Copy the webhook URL and add it under the webhook section
                      of the application you're willing to integrate with. Once
                      you're done with adding the webhook URL, then do a test
                      submission/record in that application in order to capture
                      the webhook response here. Note that webhook URL is unique
                      for every workflow.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between my-5">
              <button
                onClick={handleToggleDrawer}
                className="w-16 h-10 flex items-center justify-center  bg-white border border-gray-300  hover:bg-gray-100 rounded-md"
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSubmit}
                className="w-16 h-10 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                {loading ? <Loading bgColor="#fff" /> : <span>Save</span>}
              </button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default EditTriggerModal;
