import { ChevronRight, Pencil, PlusCircle, Tag, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
// import component 👇
import Drawer from "react-modern-drawer";
import { actionItemTags } from "./constants";
// import Loading from "../Loading";
import axios from "axios";
import toast from "react-hot-toast";
// import Select from "react-select";
import { addActions } from "../../store/slices/workflowSlice";
import { useDispatch } from "react-redux";
import Loading from "../Loading";

interface IProps {
  item: any;
  workflowId: string | undefined;
}

interface IState {
  values: any;
  loading: boolean;
}
interface FormData {
  key: string;
  value: string;
}

function Row({
  index,
  formData,
  onChangeKey,
  onChangeValue,
  onDelete,
  setShowTagsOfIndex,
}: {
  index: number;
  formData: FormData;
  onChangeKey: (index: number, key: string) => void;
  onChangeValue: (index: number, value: string) => void;
  onDelete: (index: number) => void;
  setShowTagsOfIndex: (showTags: number) => void;
}) {
  return (
    <>
      <div className="flex items-center gap-4">
        <input
          className="w-1/3 border border-gray-300 p-2 outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
          type="text"
          value={formData.key}
          onChange={(e) => onChangeKey(index, e.target.value)}
          placeholder="Key"
        />
        <div className="w-1/2 flex items-center border border-gray-300 p-2 focus:ring-1 focus:ring-blue-500 rounded-md">
          <input
            className="border-none outline-none"
            type="text"
            value={formData.value}
            onChange={(e) => onChangeValue(index, e.target.value)}
            placeholder="Value"
          />
          <button onClick={() => setShowTagsOfIndex(index)}>
            <Tag size={18} color="gray" />
          </button>
        </div>
        <button
          onClick={() => onDelete(index)}
          className="cursor-pointer border border-gray-300 rounded-md p-2 bg-gray-100 hover:bg-gray-200"
        >
          <Trash2 size={22} color="gray" />
        </button>
      </div>
    </>
  );
}

const EditActionModal: React.FC<IProps> = ({ item, workflowId }) => {
  console.log("s item--------------------", item);
  const dispatch = useDispatch();

  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [showTagsOfIndex, setShowTagsOfIndex] = useState<number>(-1);

  const [loading, setLoading] = useState<IState["loading"]>(false);
  // const [selectedDelayFormate, setSelectedDelayFormate] = useState({
  //   value: "seconds",
  //   label: "Seconds",
  // });

  const [values, setValues] = useState<IState["values"]>({
    workflowId: workflowId,
    name: item?.name,
    unqName: item?.unqName,
  });
  const [formData, setFormData] = useState<FormData[]>([
    { key: "", value: "" },
  ]);

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

    const fromValues: any = {};
    formData.forEach((item: any) => {
      fromValues[item.key] = item.value;
    });

    // If user have added delay event
    const formDataAction = { ...values, ...fromValues };

    console.log("form values --", formDataAction);

    setLoading(true);
    try {
      const { data } = await axios.put(
        `/api/workflowAction/${item?._id}`,
        formDataAction
      );
      if (data && data.success) {
        toast.success(data?.message);
        fetchWorkflowActions();
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

  const addRow = () => {
    setFormData([...formData, { key: "", value: "" }]);
  };

  const deleteRow = (index: number) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const handleChangeKey = (index: number, key: string) => {
    const updatedFormData = [...formData];
    updatedFormData[index].key = key;
    setFormData(updatedFormData);
  };

  const handleChangeValue = (index: number, value: string) => {
    const updatedFormData = [...formData];
    updatedFormData[index].value = value;
    setFormData(updatedFormData);
  };

  const handleUpdateKeyOfTag = (index: number, tagValue: string) => {
    console.log({ index, tagValue });
    if (tagValue === "{{contact.name}}") {
      handleChangeKey(index, "contactName");
    } else if (tagValue === "{{contact.email}}") {
      handleChangeKey(index, "email");
    } else if (tagValue === "{{contact.phoneNumber}}") {
      handleChangeKey(index, "phoneNumber");
    } else if (tagValue === "{{contact.groupName}}") {
      handleChangeKey(index, "groupName");
    } else if (tagValue === "{{toNumber}}") {
      handleChangeKey(index, "toNumber");
    } else if (tagValue === "{{fromNumber}}") {
      handleChangeKey(index, "fromNumber");
    } else if (tagValue === "{{message}}") {
      handleChangeKey(index, "message");
    } else if (tagValue === "{{mediaUrl}}") {
      handleChangeKey(index, "mediaUrl");
    } else if (tagValue === "{{templateName}}") {
      handleChangeKey(index, "templateName");
    } else if (tagValue === "{{templateLang}}") {
      handleChangeKey(index, "templateLang");
    } else if (tagValue === "{{delayTime}}") {
      handleChangeKey(index, "delayTime");
    } else if (
      tagValue === "{{delayFormate}}" ||
      tagValue === "seconds" ||
      tagValue === "minutes" ||
      tagValue === "hours" ||
      tagValue === "days"
    ) {
      handleChangeKey(index, "delayFormate");
    }
  };

  useEffect(() => {
    const {
      delayTime,
      delayFormate,
      contactName,
      email,
      phoneNumber,
      groupName,
      toNumber,
      fromNumber,
      message,
      mediaUrl,
      templateName,
      templateLang,
    } = item;

    const formDataArray = [];

    if (item?.unqName === "delay") {
      if (delayTime !== undefined)
        formDataArray.push({ key: "delayTime", value: delayTime });
      if (delayFormate !== undefined)
        formDataArray.push({ key: "delayFormate", value: delayFormate });
    } else {
      if (contactName !== undefined)
        formDataArray.push({ key: "contactName", value: contactName });
      if (email !== undefined)
        formDataArray.push({ key: "email", value: email });
      if (phoneNumber !== undefined)
        formDataArray.push({ key: "phoneNumber", value: phoneNumber });
      if (groupName !== undefined)
        formDataArray.push({ key: "groupName", value: groupName });
      if (toNumber !== undefined)
        formDataArray.push({ key: "toNumber", value: toNumber });
      if (fromNumber !== undefined)
        formDataArray.push({ key: "fromNumber", value: fromNumber });
      if (message !== undefined)
        formDataArray.push({ key: "message", value: message });
      if (mediaUrl !== undefined)
        formDataArray.push({ key: "mediaUrl", value: mediaUrl });
      if (templateName !== undefined)
        formDataArray.push({ key: "templateName", value: templateName });
      if (templateLang !== undefined)
        formDataArray.push({ key: "templateLang", value: templateLang });
    }

    setFormData(formDataArray);
  }, [item, setFormData]);

  return (
    <>
      <div
        onClick={handleToggleDrawer}
        className="cursor-pointer w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md"
      >
        <Pencil size={12} color="gray" />
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
          <div className="flex flex-col gap-1 my-4">
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

          <div className=" flex flex-col my-5">
            {/* add item */}
            <span className="text-sm font-medium uppercase mb-1">
              QUERY STRING PARAMS
            </span>
            <div className="flex flex-col gap-4">
              {formData.map((data, index) => (
                <div className="relative">
                  <Row
                    key={index}
                    index={index}
                    formData={data}
                    onChangeKey={handleChangeKey}
                    onChangeValue={handleChangeValue}
                    onDelete={deleteRow}
                    setShowTagsOfIndex={setShowTagsOfIndex}
                  />

                  {showTagsOfIndex === index && (
                    <div className="absolute -top-24 right-0 text-sm border border-gray-300  w-48 h-52 overflow-auto z-50 bg-white shadow-sm">
                      <div className="flex items-center justify-between bg-gray-200 p-2 cursor-pointer rounded-sm">
                        <span className="text-blue-500">Custom Values</span>
                        <button onClick={() => setShowTagsOfIndex(-1)}>
                          <X size={17} color="blue" />
                        </button>
                      </div>

                      {actionItemTags.map((item: any, idx) => {
                        const key = Object.keys(item)[0]; // Extract the key
                        const value = item[key];
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between hover:bg-gray-100 p-2 cursor-pointer rounded-sm"
                            onClick={() => {
                              handleChangeValue(index, value);
                              handleUpdateKeyOfTag(index, value);
                              setShowTagsOfIndex(-1);
                            }}
                          >
                            <span>{key}</span>
                            <button>
                              <ChevronRight size={17} color="black" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div>
              <button
                onClick={addRow}
                className="flex items-center gap-2 cursor-pointer my-4"
              >
                <PlusCircle size={18} color="rgba(0,0,255,0.5)" />
                <span className="text-blue-500 text-sm">Add items</span>
              </button>
            </div>

            <div className="text-sm flex items-center justify-between mt-10">
              <button
                onClick={handleToggleDrawer}
                className="border border-gray-300 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleSubmit}
              >
                {loading ? (
                  <Loading bgColor="#fff" size="21" />
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default EditActionModal;
