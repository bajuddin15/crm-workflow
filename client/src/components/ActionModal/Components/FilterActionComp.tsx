import React, { useEffect, useState } from "react";
import { filterTypes, makeExpressions } from "../../../utils";
import SearchableSelect from "../../Shared/SearchableSelect";
import { Minus, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { addActions } from "../../../store/slices/workflowSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";

interface AndValues {
  label: string;
  filterType: string;
  value: string;
}
interface OrValues {
  label: string;
  filterType: string;
  value: string;
}

type Type = "create" | "edit";

interface IProps {
  type: Type;
  values: any;
  handleToggleDrawer: any;
  item?: any;
  addActionIndex?: number;
}

const FilterActionComp: React.FC<IProps> = ({
  type,
  values,
  handleToggleDrawer,
  item,
  addActionIndex,
}) => {
  const dispatch = useDispatch();
  const filterLabels = useSelector(
    (state: RootState) => state.workflowStore.filterLabels
  );

  const [andValues, setAndValues] = useState<AndValues[]>([
    {
      label: "",
      filterType: "",
      value: "",
    },
  ]);
  const [orValues, setOrValues] = useState<OrValues[]>([
    {
      label: "",
      filterType: "",
      value: "",
    },
  ]);

  const [showAndValues, setShowAndValues] = useState<boolean>(false);
  const [showOrValues, setShowOrValues] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const handleChangeAndLabel = (index: number, label: string) => {
    const updated = andValues.map((item, idx) =>
      idx === index ? { ...item, label: label } : item
    );
    setAndValues(updated);
  };

  const handleChangeAndFilterType = (index: number, filterType: string) => {
    const updated = andValues.map((item, idx) =>
      idx === index ? { ...item, filterType: filterType } : item
    );
    setAndValues(updated);
  };
  const handleChangeAndValue = (index: number, value: string) => {
    const updated = andValues.map((item, idx) =>
      idx === index ? { ...item, value: value } : item
    );
    setAndValues(updated);
  };
  const handleChangeOrLabel = (index: number, label: string) => {
    const updated = orValues.map((item, idx) =>
      idx === index ? { ...item, label: label } : item
    );
    setOrValues(updated);
  };

  const handleChangeOrFilterType = (index: number, filterType: string) => {
    const updated = orValues.map((item, idx) =>
      idx === index ? { ...item, filterType: filterType } : item
    );
    setOrValues(updated);
  };
  const handleChangeOrValue = (index: number, value: string) => {
    const updated = orValues.map((item, idx) =>
      idx === index ? { ...item, value: value } : item
    );
    setOrValues(updated);
  };

  const addAndRow = () => {
    setAndValues([...andValues, { label: "", filterType: "", value: "" }]);
  };

  const deleteAndRow = (index: number) => {
    const updated = [...andValues];
    updated.splice(index, 1);
    if (updated.length === 0) {
      setShowAndValues(false);
    }
    setAndValues(updated);
  };
  const addOrRow = () => {
    setOrValues([...orValues, { label: "", filterType: "", value: "" }]);
  };

  const deleteOrRow = (index: number) => {
    const updated = [...orValues];
    updated.splice(index, 1);
    if (updated.length === 0) {
      setShowOrValues(false);
    }
    setOrValues(updated);
  };

  const handleMakeExpression = (
    andValues: AndValues[],
    orValues: OrValues[]
  ) => {
    const expression1 = makeExpressions(andValues, "&&");
    const expression2 = makeExpressions(orValues, "||");
    if (expression1 && expression2) {
      const expression = `(${expression1}) && (${expression2})`;
      return expression;
    } else if (expression1) {
      return expression1;
    } else if (expression2) {
      return expression2;
    }
    return "";
  };

  const fetchWorkflowActions = async () => {
    try {
      const { data } = await axios.get(
        `/api/workflowAction/allActions/${values?.workflowId}`
      );
      if (data && data?.success) {
        dispatch(addActions(data?.data));
      }
    } catch (error: any) {
      console.log("Fetch workflow actions error : ", error.message);
    }
  };

  const handleSubmit = async () => {
    // filter unnecessary And or Or values
    const andValuesData = andValues.filter(
      (item: AndValues) => item.label !== "" || item.filterType !== ""
    );
    const orValuesData = orValues.filter(
      (item: OrValues) => item.label !== "" || item.filterType !== ""
    );

    const expression = handleMakeExpression(andValuesData, orValuesData);
    if (
      (andValuesData.length === 0 && orValuesData.length === 0) ||
      !expression.trim()
    ) {
      toast.error("Filter should not empty");
      return;
    }
    const formData = {
      ...values,
      filterValues: {
        andValues: andValuesData,
        orValues: orValuesData,
      },
      filterExpression: expression,
      index: addActionIndex,
    };

    setLoading(true);
    // filterValues->andValues, orValues
    // filterExpression
    try {
      let resData;
      if (type === "create") {
        const { data } = await axios.post(
          "/api/workflowAction/create",
          formData
        );
        resData = data;
      } else {
        const { data } = await axios.put(
          `/api/workflowAction/${item?._id}`,
          formData
        );
        resData = data;
      }
      if (resData && resData.success) {
        toast.success(resData?.message);
        fetchWorkflowActions();
        handleToggleDrawer();
      } else {
        toast.error(resData?.message);
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
    if (type === "edit") {
      const andValuesData = item?.filterValues?.andValues;
      const orValuesData = item?.filterValues?.orValues;
      setAndValues(andValuesData);
      setOrValues(orValuesData);
      if (andValuesData.length > 0) {
        setShowAndValues(true);
      }
      if (orValuesData.length > 0) {
        setShowOrValues(true);
      }
    }
  }, [item]);

  const findLabel = (item: any) => {
    // First, check if it's a direct match
    let selectedOptionLabel = filterLabels.find(
      (data: any) => data.value === item.label
    );

    // If not found, check within the "Webhook" options
    if (!selectedOptionLabel) {
      const webhook = filterLabels.find(
        (data: any) => data.label === "Webhook"
      );
      if (webhook && webhook.options) {
        selectedOptionLabel = webhook.options.find(
          (option: any) => option.label === item.label
        );
      }
    }

    return selectedOptionLabel;
  };

  return (
    <div className="mt-5 text-sm">
      {/* And Conditions */}
      {showAndValues && (
        <div className="border border-gray-400 p-5 rounded-md">
          <div className="grid grid-cols-3 gap-4">
            <h2 className="text-sm font-medium">Select Label</h2>
            <h2 className="text-sm font-medium">Filter Type</h2>
            <h2 className="text-sm font-medium">Value</h2>
          </div>
          {andValues.map((item: AndValues, index: number) => {
            const selectedOptionLabel = findLabel(item);
            const selectedOptionFilterType = filterTypes.find(
              (data) => data.value === item.filterType
            );
            return (
              <div
                key={index}
                className="grid grid-cols-3 gap-x-4 gap-y-2 mt-2"
              >
                <SearchableSelect
                  options={filterLabels}
                  value={item.label ? selectedOptionLabel : null}
                  onChange={(selected: any) =>
                    handleChangeAndLabel(index, selected.value)
                  }
                />
                <SearchableSelect
                  options={filterTypes}
                  value={item.filterType ? selectedOptionFilterType : null}
                  onChange={(selected: any) => {
                    handleChangeAndFilterType(index, selected.value);
                  }}
                />
                <div className="space-y-2 text-sm flex items-center gap-5">
                  <input
                    className="w-full p-2 border border-gray-400 outline-none focus:ring-1 focus:ring-blue-500 rounded-[4px]"
                    type="text"
                    placeholder="Enter text or map data."
                    value={item.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChangeAndValue(index, e.target.value)
                    }
                  />

                  <button
                    onClick={() => deleteAndRow(index)}
                    className="border border-gray-400 rounded-sm p-[2px]"
                  >
                    <Minus size={18} color="gray" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="mt-4">
            <button
              onClick={addAndRow}
              className="flex items-center gap-2 border border-blue-500 py-2 px-3 rounded-md"
            >
              <div className="bg-blue-500 p-[1px] rounded-full">
                <Plus size={14} color="white" />
              </div>
              <span className="text-sm font-medium text-blue-500">
                AND Condition
              </span>
            </button>
          </div>
        </div>
      )}

      {showAndValues && showOrValues && (
        <div className="flex items-center justify-center my-4">
          <span className="text-base">AND</span>
        </div>
      )}

      {/* Or conditions */}
      {showOrValues && (
        <div className="border border-gray-400 p-5 rounded-md">
          <div className="grid grid-cols-3 gap-4">
            <h2 className="text-sm font-medium">Select Label</h2>
            <h2 className="text-sm font-medium">Filter Type</h2>
            <h2 className="text-sm font-medium">Value</h2>
          </div>
          {orValues.map((item: OrValues, index: number) => {
            const selectedOptionLabel = findLabel(item);
            const selectedOptionFilterType = filterTypes.find(
              (data) => data.value === item.filterType
            );
            return (
              <div
                key={index}
                className="grid grid-cols-3 gap-x-4 gap-y-2 mt-2"
              >
                <SearchableSelect
                  options={filterLabels}
                  value={item.label ? selectedOptionLabel : null}
                  onChange={(selected: any) =>
                    handleChangeOrLabel(index, selected.value)
                  }
                />
                <SearchableSelect
                  options={filterTypes}
                  value={item.filterType ? selectedOptionFilterType : null}
                  onChange={(selected: any) =>
                    handleChangeOrFilterType(index, selected.value)
                  }
                />
                <div className="space-y-2 text-sm flex items-center gap-5">
                  <input
                    className="w-full p-2 border border-gray-400 outline-none focus:ring-1 focus:ring-blue-500 rounded-[4px]"
                    type="text"
                    placeholder="Enter text or map data."
                    value={item.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChangeOrValue(index, e.target.value);
                    }}
                  />

                  <button
                    onClick={() => deleteOrRow(index)}
                    className="border border-gray-400 rounded-sm p-[2px]"
                  >
                    <Minus size={18} color="gray" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="mt-4">
            <button
              onClick={addOrRow}
              className="flex items-center gap-2 border border-blue-500 py-2 px-3 rounded-md"
            >
              <div className="bg-blue-500 p-[1px] rounded-full">
                <Plus size={14} color="white" />
              </div>
              <span className="text-sm font-medium text-blue-500">
                OR Condition
              </span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mt-4">
        {!showAndValues && (
          <button
            onClick={() => setShowAndValues(true)}
            className="flex items-center gap-2 border border-blue-500 py-2 px-3 rounded-md"
          >
            <div className="bg-blue-500 p-[1px] rounded-full">
              <Plus size={14} color="white" />
            </div>
            <span className="text-sm font-medium text-blue-500">
              AND Condition
            </span>
          </button>
        )}

        {!showOrValues && (
          <button
            onClick={() => setShowOrValues(true)}
            className="flex items-center gap-2 border border-blue-500 py-2 px-3 rounded-md"
          >
            <div className="bg-blue-500 p-[1px] rounded-full">
              <Plus size={14} color="white" />
            </div>
            <span className="text-sm font-medium text-blue-500">
              OR Condition
            </span>
          </button>
        )}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={handleToggleDrawer}
          className="border border-blue-500 py-2 px-3 rounded-md text-sm text-blue-500"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 py-2 px-3 rounded-md text-sm text-white hover:bg-blue-600"
        >
          {loading ? "Please wait.." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default FilterActionComp;
