interface IProps {
  data: any;
}

const KeyValueComp = ({ data }: IProps) => {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-5">
        <span>Label</span>
        <span>Value</span>
      </div>
      {data?.map((item: any) => {
        return (
          <div className="grid grid-cols-2 gap-5">
            <div
              style={{ scrollbarWidth: "none" }}
              className="bg-gray-100 border border-gray-400 py-2 px-3 rounded-md overflow-x-auto overflow-y-auto"
            >
              {item?.key}
            </div>
            <div
              style={{ scrollbarWidth: "none" }}
              className="bg-gray-100 border border-gray-400 py-2 px-3 rounded-md overflow-x-auto overflow-y-auto"
            >
              {item?.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KeyValueComp;
