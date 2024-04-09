import { Trash2 } from "lucide-react";

interface IProps {
  rows: any;
  setRows: any;
}

const KeyValueInput = ({ rows, setRows }: IProps) => {
  const addRow = () => {
    setRows([...rows, { key: "", value: "" }]);
  };
  const deleteRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleChangeKey = (index: number, key: string) => {
    const updatedRows = [...rows];
    updatedRows[index].key = key;
    setRows(updatedRows);
  };
  const handleChangeValue = (index: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index].value = value;
    setRows(updatedRows);
  };
  return (
    <div className="space-y-4">
      {rows?.map((row: any, index: any) => {
        return (
          <div className="flex text-sm items-center gap-4">
            <input
              className="w-1/3 border border-gray-300 p-2 outline-none focus:ring-1 focus:ring-blue-500 rounded-md bg-white"
              type="text"
              value={row.key}
              onChange={(e) => handleChangeKey(index, e.target.value)}
              placeholder="Label"
            />
            <input
              className="w-2/3 border border-gray-300 p-2 outline-none focus:ring-1 focus:ring-blue-500 rounded-md bg-white"
              type="text"
              value={row.value}
              onChange={(e) => handleChangeValue(index, e.target.value)}
              placeholder="Value"
            />
            <button
              onClick={() => deleteRow(index)}
              className="cursor-pointer border border-gray-300 rounded-md p-2 bg-gray-100 hover:bg-gray-200"
            >
              <Trash2 size={18} color="gray" />
            </button>
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
