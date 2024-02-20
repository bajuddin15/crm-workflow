import { X } from "lucide-react";
import React, { useState } from "react";
// import component 👇
import Drawer from "react-modern-drawer";
import Loading from "../Loading";
import axios from "axios";
import toast from "react-hot-toast";

interface IProps {
  item: any;
  workflowId: string;
}

interface IState {
  values: any;
  loading: boolean;
}

const CreateActionModal: React.FC<IProps> = ({ item, workflowId }) => {
  const [isOpenModal, setIsOpenModal] = React.useState(false);

  const [loading, setLoading] = useState<IState["loading"]>(false);

  const [values, setValues] = useState<IState["values"]>({
    workflowId: workflowId,
    name: item?.name,
    unqName: item?.unqName,
    contactName: "",
    email: "",
    phoneNumber: "",
    groupName: "",
    toNumber: "",
    fromNumber: "",
    message: "",
    mediaUrl: "",
    templateName: "",
    templateLang: "",
  });

  const handleToggleDrawer = () => {
    setIsOpenModal((prevState) => !prevState);
  };

  //   action created
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("form values --", values);
    setLoading(true);
    try {
      const { data } = await axios.post("/api/workflowAction/create", values);
      if (data && data.success) {
        toast.success(data?.message);
        handleToggleDrawer();
      } else {
        toast.error(data?.message);
      }
      console.log("action created--", data);
    } catch (error: any) {
      console.log("Action creation Error : ", error);
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
        className="py-2 px-4 border border-gray-300 cursor-pointer"
      >
        <span className="text-sm text-gray-600">{item?.name}</span>
      </div>

      <Drawer
        open={isOpenModal}
        onClose={handleToggleDrawer}
        direction="right"
        className="py-4 px-7 overflow-y-auto"
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
          <form className="my-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1 mb-10">
              <label
                htmlFor="actionName"
                className="text-sm font-medium uppercase"
              >
                Action name
              </label>
              <input
                id="actionName"
                className="w-full bg-inherit px-4 py-2 outline-none text-sm  placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500"
                type="text"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
            </div>

            <div>{renderFormByAction(item?.unqName, values, setValues)}</div>
            {/* footer */}
            <div className="flex items-center justify-between my-5">
              <button
                onClick={handleToggleDrawer}
                className="w-16 h-10 flex items-center justify-center  bg-white border border-gray-300  hover:bg-gray-100 rounded-md"
              >
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="w-16 h-10 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                {loading ? <Loading bgColor="#fff" /> : <span>Save</span>}
              </button>
            </div>
          </form>
        </div>
      </Drawer>
    </>
  );
};

const renderFormByAction = (
  actionUnqName: string,
  values: any,
  setValues: any
) => {
  if (actionUnqName === "addContact") {
    return <div></div>;
  } else if (actionUnqName === "sendSMS") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="toNumber" className="text-sm font-medium uppercase">
            To Number
          </label>
          <input
            id="toNumber"
            className="w-full bg-inherit px-4 py-2 outline-none text-sm  placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500"
            type="text"
            value={values.toNumber}
            onChange={(e) => setValues({ ...values, toNumber: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="fromNumber" className="text-sm font-medium uppercase">
            From Number
          </label>
          <input
            id="fromNumber"
            className="w-full bg-inherit px-4 py-2 outline-none text-sm  placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500"
            type="text"
            value={values.fromNumber}
            onChange={(e) =>
              setValues({ ...values, fromNumber: e.target.value })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="message" className="text-sm font-medium uppercase">
            Message
          </label>
          <textarea
            id="message"
            className="w-full bg-inherit px-4 py-2 outline-none text-sm  placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500"
            value={values.message}
            onChange={(e) => setValues({ ...values, message: e.target.value })}
            required
          />
        </div>
      </div>
    );
  } else if (actionUnqName === "delay") {
    return <div></div>;
  } else if (actionUnqName === "filter") {
    return <div></div>;
  } else if (actionUnqName === "sendWhatsAppTemplates") {
    return <div></div>;
  } else if (actionUnqName === "sendWhatsAppNonTemplates") {
    return <div></div>;
  }
};

export default CreateActionModal;
