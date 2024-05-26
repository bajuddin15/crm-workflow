import { ChevronRight, Tag, Trash2, X } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducers";

interface IProps {
  rows: any;
  setRows: any;
}

const KeyValueInput = ({ rows, setRows }: IProps) => {
  const actionItemTags = useSelector(
    (state: RootState) => state.workflowStore.actionItemTags
  );
  const [showTagsOfIndex, setShowTagsOfIndex] = React.useState<number>(-1);
  const [showTagsOfGroup, setShowTagsOfGroup] = React.useState<any[]>([]);
  const [isWebhookTag, setIsWebhookTag] = React.useState<boolean>(false);

  const addRow = () => {
    setRows([...rows, { key: "", value: "" }]);
  };
  const deleteRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleChangeKey = (index: number, key: string) => {
    const updatedRows = rows.map((item: any, idx: number) =>
      idx === index ? { key: key, value: item.value } : item
    );
    setRows(updatedRows);
  };
  const handleChangeValue = (index: number, value: string) => {
    const updatedRows = rows.map((item: any, idx: number) =>
      idx === index ? { key: item.key, value: value } : item
    );
    setRows(updatedRows);
  };

  return (
    <div className="space-y-4">
      {rows?.map((row: any, index: any) => {
        return (
          <div className="relative flex text-sm items-center gap-4">
            <input
              className="w-1/3 border border-gray-300 p-2 outline-none focus:ring-1 focus:ring-blue-500 rounded-md bg-white"
              type="text"
              value={row.key}
              onChange={(e) => handleChangeKey(index, e.target.value)}
              placeholder="Label"
            />
            <div className="w-2/3 pr-2 flex items-center justify-between border border-gray-300 hover:ring-1 hover:ring-blue-500 rounded-md">
              <input
                className="p-2 outline-none bg-white rounded-md"
                type="text"
                value={row.value}
                onChange={(e) => handleChangeValue(index, e.target.value)}
                placeholder="Value"
              />
              <button onClick={() => setShowTagsOfIndex(index)}>
                <Tag size={18} color="gray" />
              </button>
            </div>
            <button
              onClick={() => deleteRow(index)}
              className="cursor-pointer border border-gray-300 rounded-md p-2 bg-gray-100 hover:bg-gray-200"
            >
              <Trash2 size={18} color="gray" />
            </button>

            {/* absolute position tags */}
            {showTagsOfIndex === index && (
              <div className="absolute bottom-[44px] right-0 flex  text-sm border border-gray-400  min-w-44 h-52 overflow-auto z-50 bg-white shadow-sm">
                <div className="border-r border-r-gray-300">
                  <div className="flex items-center justify-between bg-gray-200 p-2 cursor-pointer rounded-sm">
                    <span className="text-blue-500">Custom Values</span>
                    <button
                      onClick={() => {
                        setShowTagsOfIndex(-1);
                        setShowTagsOfGroup([]);
                        setIsWebhookTag(false);
                      }}
                    >
                      <X size={17} color="blue" />
                    </button>
                  </div>

                  {actionItemTags.map((item: any, idx) => {
                    const key = Object.keys(item)[0]; // Extract the key
                    const value = item[key];
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between ${
                          showTagsOfGroup === value
                            ? "bg-gray-200 text-blue-500"
                            : "hover:bg-gray-100"
                        } p-2 cursor-pointer rounded-sm`}
                        onClick={() => {
                          if (key === "Webhook") {
                            setIsWebhookTag(true);
                          }
                          setShowTagsOfGroup(value);
                        }}
                      >
                        <span>{key}</span>
                        <button className="ml-2">
                          <ChevronRight
                            size={17}
                            color={showTagsOfGroup === value ? "blue" : "black"}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Tags of group -*/}
                {showTagsOfGroup.length > 0 && (
                  <div>
                    {showTagsOfGroup.map((item, index) => {
                      const key = Object.keys(item)[0]; // Extract the key
                      const value = item[key];
                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between ${
                            rows[showTagsOfIndex]?.value === value
                              ? "bg-gray-200 text-blue-500"
                              : "hover:bg-gray-100"
                          } hover:bg-gray-100 p-2 pr-4 cursor-pointer rounded-sm`}
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
                                if (isWebhookTag) {
                                  tagVal = `{{webhook.${key}}}`;
                                } else {
                                  tagVal = `{{${key}}}`;
                                }
                              }
                            }
                            if (showTagsOfIndex > -1) {
                              handleChangeValue(showTagsOfIndex, tagVal);
                              setShowTagsOfIndex(-1);
                              setShowTagsOfGroup([]);
                              setIsWebhookTag(false);
                            }
                          }}
                        >
                          <span>{key}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      <button className="text-sm text-blue-500" onClick={addRow}>
        Add Items
      </button>
    </div>
  );
};

export default KeyValueInput;
