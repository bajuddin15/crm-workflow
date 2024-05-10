import { Plus, X } from "lucide-react";
import React from "react";
// import component 👇
import Drawer from "react-modern-drawer";
import CreateActionModal from "./ActionModal/CreateActionModal";

interface IProps {
  workflowActions: Array<any>;
  workflowId: any;
  addActionIndex: number;
}

const AddNewAction: React.FC<IProps> = ({
  workflowActions,
  workflowId,
  addActionIndex,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <button
        onClick={toggleDrawer}
        className="cursor-pointer w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-300 hover:bg-blue-200 dark:bg-white"
      >
        <Plus size={20} color="rgba(0,0,255,0.5)" />
      </button>

      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        style={{ scrollbarWidth: "none" }}
        className="py-4 px-7"
        size={500}
      >
        <div className="flex items-center justify-end">
          <div
            onClick={toggleDrawer}
            className="cursor-pointer hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
          >
            <X size={20} />
          </div>
        </div>
        <div className="border-b border-b-gray-200 py-4 flex flex-col">
          <span className="text-base text-gray-700 font-semibold">Actions</span>
          <span className="text-sm mt-2 text-gray-500">
            Pick an action for this step
          </span>
        </div>

        <div className="my-5 flex flex-col gap-2 h-[75vh] overflow-y-auto pb-5">
          {workflowActions?.map((item, index) => {
            return (
              <CreateActionModal
                key={index}
                item={item}
                workflowId={workflowId}
                addActionIndex={addActionIndex}
              />
            );
          })}
        </div>
      </Drawer>
    </>
  );
};

export default AddNewAction;
