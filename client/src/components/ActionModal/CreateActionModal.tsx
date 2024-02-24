import { PlusCircle, Trash2, X } from "lucide-react";
import React, { useState } from "react";
// import component 👇
import Drawer from "react-modern-drawer";
import Loading from "../Loading";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import { addActions } from "../../store/slices/workflowSlice";
import { useDispatch } from "react-redux";

interface IProps {
  item: any;
  workflowId: string;
}

interface IState {
  values: any;
  loading: boolean;
}

const CreateActionModal: React.FC<IProps> = ({ item, workflowId }) => {
  const dispatch = useDispatch();

  const [isOpenModal, setIsOpenModal] = React.useState(false);

  const [loading, setLoading] = useState<IState["loading"]>(false);
  const [countItem, setCountItem] = useState<number>(0);
  console.log(countItem);
  const [selectedDelayFormate, setSelectedDelayFormate] = useState({
    value: "seconds",
    label: "Seconds",
  });

  const [values, setValues] = useState<IState["values"]>({
    workflowId: workflowId,
    name: item?.name,
    unqName: item?.unqName,
    delayTime: 0, // it should be in miliseconds
    delayFormate: "seconds",
    pickFromPayload: true,
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

  const fetchWorkflowActions = async () => {
    try {
      const { data } = await axios.get(
        `/api/workflowAction/allActions/${workflowId}`
      );
      if (data && data?.success) {
        dispatch(addActions(data?.data));
      }
    } catch (error: any) {
      console.log("Fetch workflow actions error : ", error.message);
    }
  };

  //   action created
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // If user have added delay event
    const formData = { ...values, delayFormate: selectedDelayFormate.value };

    console.log("form values --", formData);

    setLoading(true);
    try {
      const { data } = await axios.post("/api/workflowAction/create", formData);
      if (data && data.success) {
        toast.success(data?.message);
        fetchWorkflowActions();
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

          <div className="mt-10">
            {/* add item */}

            <div className="flex items-center gap-4">
              <input
                className="w-1/3 border border-gray-300 p-2 outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                type="text"
                placeholder="Key"
              />
              <input
                className="w-1/2 border border-gray-300 p-2 outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                type="text"
                placeholder="Value"
              />
              <div className="cursor-pointer border border-gray-300 rounded-md p-2 bg-gray-100 hover:bg-gray-200">
                <Trash2 size={22} color="gray" />
              </div>
            </div>

            <div
              onClick={() => setCountItem((prev) => prev + 1)}
              className="flex items-center gap-2 cursor-pointer my-2"
            >
              <PlusCircle size={18} color="rgba(0,0,255,0.5)" />
              <span className="text-blue-500 text-sm">Add item</span>
            </div>
          </div>
          <form className="my-5">
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

            <div className="">
              <div className="flex items-center gap-4 mb-5">
                <span>Custom Values</span>
                <input
                  type="checkbox"
                  className={`toggle toggle-sm ${
                    !values.pickFromPayload
                      ? "[--tglbg:white]"
                      : "[--tglbg:blue]"
                  }  ${
                    !values.pickFromPayload
                      ? "bg-blue-700 hover:bg-blue-600"
                      : "bg-white hover:bg-white"
                  }  border-blue-500`}
                  checked={!values.pickFromPayload ? false : true}
                  onChange={() =>
                    setValues({
                      ...values,
                      pickFromPayload: !values.pickFromPayload,
                    })
                  }
                />
                <span>Pick From Payload</span>
              </div>

              {!values.pickFromPayload && (
                <div>
                  {renderFormByAction(
                    item?.unqName,
                    values,
                    setValues,
                    selectedDelayFormate,
                    setSelectedDelayFormate
                  )}
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
          </form>
        </div>
      </Drawer>
    </>
  );
};

const renderFormByAction = (
  actionUnqName: string,
  values: any,
  setValues: any,
  selectedDelayFormate: any,
  setSelectedDelayFormate: any
) => {
  if (actionUnqName === "addContact") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="phoneNumber"
            className="text-sm font-medium uppercase"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            className="w-full bg-inherit px-4 py-2 outline-none text-sm  placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500"
            type="text"
            value={values.phoneNumber}
            onChange={(e) =>
              setValues({ ...values, phoneNumber: e.target.value })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="contactName"
            className="text-sm font-medium uppercase"
          >
            Contact Name
          </label>
          <input
            id="contactName"
            className="w-full bg-inherit px-4 py-2 outline-none text-sm  placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500"
            type="text"
            value={values.contactName}
            onChange={(e) =>
              setValues({ ...values, contactName: e.target.value })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium uppercase">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full bg-inherit px-4 py-2 outline-none text-sm  placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="groupName" className="text-sm font-medium uppercase">
            Group Name
          </label>
          <input
            id="groupName"
            className="w-full bg-inherit px-4 py-2 outline-none text-sm  placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500"
            value={values.groupName}
            onChange={(e) =>
              setValues({ ...values, groupName: e.target.value })
            }
            required
          />
        </div>
      </div>
    );
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
    const options = [
      { value: "seconds", label: "Seconds" },
      { value: "minutes", label: "Minutes" },
      { value: "hours", label: "Hours" },
      { value: "days", label: "Days" },
    ];
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium uppercase">Delay Time</label>
        <div className="flex flex-1 items-center gap-4">
          <div className="flex-1">
            <input
              className="border border-gray-300 px-3 outline-none p-[6px] w-full rounded-md"
              type="number"
              value={values.delayTime}
              onChange={(e) =>
                setValues({ ...values, delayTime: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Select
              defaultValue={selectedDelayFormate}
              value={selectedDelayFormate}
              onChange={setSelectedDelayFormate}
              placeholder="Seconds"
              options={options}
            />
          </div>
        </div>
      </div>
    );
  } else if (actionUnqName === "filter") {
    return <div></div>;
  } else if (actionUnqName === "sendWhatsAppTemplates") {
    return <div></div>;
  } else if (actionUnqName === "sendWhatsAppNonTemplates") {
    return <div></div>;
  }
};

export default CreateActionModal;
