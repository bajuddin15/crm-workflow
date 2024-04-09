import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Drawer from "react-modern-drawer";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { ChevronRight, PlusCircle, Tag, Trash2, X } from "lucide-react";
import {
  authApiOptions,
  getEventOptions,
  parseSingleData,
  payloadTypeOptions,
} from "./constants";
import {
  addActions,
  setCurrentWorkflow,
} from "../../store/slices/workflowSlice";
import Loading from "../Loading";
import KeyValueInput from "../KeyValueInput";
import useData from "./data";
import KeyValueComp from "../KeyValueComp";
import { RootState } from "../../store/reducers";

interface IProps {
  item: any;
  workflowId: string;
}

interface IState {
  values: any;
  loading: boolean;
}
interface FormData {
  key: string;
  value: string | number;
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
          className="w-1/3 border border-gray-300 p-2 outline-none focus:ring-1 focus:ring-blue-500 rounded-md bg-white"
          type="text"
          value={formData.key}
          onChange={(e) => onChangeKey(index, e.target.value)}
          placeholder="Key"
        />
        <div className="w-1/2 flex items-center border border-gray-300 p-2 focus:ring-1 focus:ring-blue-500 rounded-md">
          <input
            className="border-none outline-none bg-white"
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

const CreateActionModal: React.FC<IProps> = ({ item, workflowId }) => {
  const dispatch = useDispatch();
  const { executeApiAndGetResp } = useData();

  const actionItemTags = useSelector(
    (state: RootState) => state.workflowStore.actionItemTags
  );

  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [showTagsOfIndex, setShowTagsOfIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<IState["loading"]>(false);
  const [values, setValues] = useState<IState["values"]>({
    workflowId: workflowId,
    name: item?.name,
    unqName: item?.unqName,
  });
  const [formData, setFormData] = useState<FormData[]>([
    { key: "", value: "" },
  ]);
  const [apiActionHeaders, setApiActionHeaders] = useState<FormData[]>([
    { key: "", value: "" },
  ]);
  const [apiActionParameters, setApiActionParameters] = useState<FormData[]>([
    { key: "", value: "" },
  ]);
  const [parsedApiResp, setParsedApiResp] = useState<FormData[]>([]);

  const [selectedActionMethod, setSelectedActionMethod] = useState<any>({
    value: "GET",
    label: "GET",
  });
  const [selectedPayloadType, setSelectedPayloadType] = useState<any>({
    value: "JSON",
    label: "JSON",
  });
  const [selectedAuthType, setSelectedAuthType] = useState<any>({
    value: "No Auth",
    label: "No Auth",
  });

  const [apiEndpointUrl, setApiEndpointUrl] = useState<string>("");

  const [isAddHeader, setIsAddHeader] = useState<boolean>(false);
  const [isAddParameters, setIsAddParameters] = useState<boolean>(false);

  const [testApiLoading, setTestApiLoading] = useState<boolean>(false);

  const actionEventOptions = getEventOptions();

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
  const handleSubmit = async () => {
    const fromValues: any = {};
    formData.forEach((item: any) => {
      fromValues[item.key] = item.value;
    });

    // If user have added delay event
    const formDataAction = { ...values, ...fromValues };

    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/workflowAction/create",
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
    if (tagValue === "{{contact.name}}") {
      handleChangeKey(index, "contactName");
    } else if (tagValue === "{{contact.email}}") {
      handleChangeKey(index, "email");
    } else if (tagValue === "{{contact.phoneNumber}}") {
      handleChangeKey(index, "phoneNumber");
    } else if (tagValue === "{{contact.groupName}}") {
      handleChangeKey(index, "groupName");
    } else if (tagValue === "{{toNumber}}") {
      handleChangeKey(index, "fromNumber");
    } else if (tagValue === "{{fromNumber}}") {
      handleChangeKey(index, "toNumber");
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
    } else if (tagValue === "{{voiceText}}") {
      handleChangeKey(index, "voiceText");
    }
  };

  const handleRestApiActionCreate = async (isSaveAndTest = false) => {
    const formData = {
      workflowId,
      name: item?.name,
      unqName: item?.unqName,
      actionEventMethod: selectedActionMethod?.value,
      endpointUrl: apiEndpointUrl,
      payloadType: selectedPayloadType?.value,
      authType: selectedAuthType?.value,
      headers: apiActionHeaders,
      parameters: apiActionParameters,
    };
    if (!formData.endpointUrl) {
      toast.error("Enter api endpoint url");
      return;
    }
    if (!isAddHeader) {
      formData.headers = [];
    }
    if (!isAddParameters) {
      formData.parameters = [];
    }

    if (isSaveAndTest) {
      // execute response
      setTestApiLoading(true);
      const apiResp = await executeApiAndGetResp(formData);

      if (apiResp) {
        const parsedRespInKeyValue = parseSingleData(apiResp);
        setParsedApiResp(parsedRespInKeyValue);
        const { data } = await axios.put(`/api/workflow/${workflowId}`, {
          apiResponse: parsedRespInKeyValue,
        });
        if (data && data?.success) {
          dispatch(setCurrentWorkflow(data?.data));
          toast.success("Response received");
          const formHistData = {
            workflowId,
            status: "finshed",
            actionName: "REST API",
            apiResponse: parsedRespInKeyValue,
          };
          const res = await axios.post(
            "/api/workflowHistory/create",
            formHistData
          );
          if (res?.data && res?.data?.success) {
            console.log("history created", res?.data);
          }
        }
      }
      setTestApiLoading(false);
      return;
    }
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
    } catch (error: any) {
      if (error?.response) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const formDataArray = [];
    if (item?.unqName === "sendSMS") {
      formDataArray.push({ key: "toNumber", value: "" });
      formDataArray.push({ key: "fromNumber", value: "" });
      formDataArray.push({ key: "message", value: "" });
      formDataArray.push({ key: "mediaUrl", value: "" });
    } else if (item?.unqName === "delay") {
      formDataArray.push({ key: "delayTime", value: "0" });
      formDataArray.push({ key: "delayFormate", value: "seconds" });
    } else if (item?.unqName === "sendWhatsAppTemplates") {
      formDataArray.push({ key: "toNumber", value: "" });
      formDataArray.push({ key: "fromNumber", value: "" });
      formDataArray.push({ key: "message", value: "" });
      formDataArray.push({ key: "mediaUrl", value: "" });
      formDataArray.push({ key: "templateName", value: "" });
    } else if (item?.unqName === "sendWhatsAppNonTemplates") {
      formDataArray.push({ key: "toNumber", value: "" });
      formDataArray.push({ key: "fromNumber", value: "" });
      formDataArray.push({ key: "message", value: "" });
      formDataArray.push({ key: "mediaUrl", value: "" });
    } else if (item?.unqName === "addContact") {
      formDataArray.push({ key: "phoneNumber", value: "" });
      formDataArray.push({ key: "contactName", value: "" });
      formDataArray.push({ key: "email", value: "" });
      formDataArray.push({ key: "groupName", value: "" });
    } else if (item?.unqName === "outgoingVoiceCall") {
      formDataArray.push({ key: "toNumber", value: "" });
      formDataArray.push({ key: "fromNumber", value: "" });
      formDataArray.push({ key: "voiceText", value: "" });
    }

    setFormData(formDataArray);
  }, [item]);

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
          <div className="flex flex-col gap-1 my-4 text-sm">
            <label htmlFor="actionName" className="text-sm">
              Action Name
            </label>
            <input
              id="actionName"
              className="w-full bg-inherit px-4 py-2 outline-none text-sm  placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500"
              type="text"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>

          {/* ----------------- if action is restApi start -------------  */}
          {item?.unqName === "restApi" && (
            <div className="space-y-5">
              <div className="text-sm space-y-1">
                <label htmlFor="actionEventMethod">Action Event Method</label>
                <Select
                  defaultValue={selectedActionMethod}
                  onChange={setSelectedActionMethod}
                  options={actionEventOptions}
                />
              </div>
              <div className="text-sm space-y-1">
                <label htmlFor="apiEndPointUrl">
                  API Endpoint URL{" "}
                  <span className="text-red-500">(Required)</span>
                </label>
                <input
                  id="apiEndPointUrl"
                  className="w-full bg-inherit px-4 py-2 outline-none text-sm  placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500"
                  type="text"
                  placeholder="Enter text or map data."
                  required
                  value={apiEndpointUrl}
                  onChange={(e) => setApiEndpointUrl(e.target.value)}
                />
              </div>
              <div className="text-sm space-y-1 flex flex-col">
                <label htmlFor="payloadType">Payload Type</label>
                <Select
                  defaultValue={selectedPayloadType}
                  onChange={setSelectedPayloadType}
                  options={payloadTypeOptions}
                />
              </div>
              <div className="text-sm space-y-1">
                <label htmlFor="actionEventMethod">Authentication</label>
                <Select
                  defaultValue={selectedAuthType}
                  onChange={setSelectedAuthType}
                  options={authApiOptions}
                />
              </div>
              <div className="text-sm flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={isAddHeader}
                  onChange={() => setIsAddHeader(!isAddHeader)}
                  className="w-4 h-4"
                />
                <span>Add Headers</span>
              </div>
              {isAddHeader && (
                <KeyValueInput
                  rows={apiActionHeaders}
                  setRows={setApiActionHeaders}
                />
              )}
              <div className="text-sm flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={isAddParameters}
                  onChange={() => setIsAddParameters(!isAddParameters)}
                  className="w-4 h-4"
                />
                <span>Set Parameters</span>
              </div>
              {isAddParameters && (
                <KeyValueInput
                  rows={apiActionParameters}
                  setRows={setApiActionParameters}
                />
              )}

              {/* Api Response */}
              {parsedApiResp?.length > 0 && (
                <div>
                  <KeyValueComp data={parsedApiResp} />
                </div>
              )}
            </div>
          )}
          {/* ----------------- if action is restApi end -------------  */}

          {!(item?.unqName === "restApi") && (
            <div className=" flex flex-col my-5">
              {/* add item */}
              <span className="text-sm mb-1">Query String Params</span>
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
                                let tagVal = value;
                                if (
                                  key !== "seconds" &&
                                  key !== "minutes" &&
                                  key !== "hours" &&
                                  key !== "days"
                                ) {
                                  if (
                                    !value?.includes("{{") &&
                                    !value?.includes("{{")
                                  ) {
                                    tagVal = `{{${key}}}`;
                                  }
                                }
                                handleChangeValue(index, tagVal);
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
            </div>
          )}

          {/* footer action buttons */}
          <div className="text-sm flex items-center justify-between mt-10">
            <button
              onClick={handleToggleDrawer}
              className="border border-gray-500 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              {item?.unqName === "restApi" && (
                <button
                  className="bg-blue-500 text-white border border-gray-400 hover:bg-blue-600 px-4 py-2 rounded-md"
                  onClick={() => handleRestApiActionCreate(true)}
                >
                  {testApiLoading ? (
                    <Loading bgColor="#fff" size="21" />
                  ) : (
                    <span>Test Request</span>
                  )}
                </button>
              )}
              <button
                className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 rounded-md"
                onClick={() => {
                  if (item?.unqName === "restApi") {
                    handleRestApiActionCreate();
                  } else {
                    handleSubmit();
                  }
                }}
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

export default CreateActionModal;
