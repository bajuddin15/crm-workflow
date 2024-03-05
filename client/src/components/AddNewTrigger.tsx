import { Plus, X } from "lucide-react";
import React from "react";
// import component 👇
import Drawer from "react-modern-drawer";
import CreateTriggerModal from "./ActionModal/CreateTriggerModal";

interface IProps {
  workflowTriggers: Array<any>;
  workflowId: any;
}

const AddNewTrigger: React.FC<IProps> = ({ workflowTriggers, workflowId }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div>
      <button
        onClick={toggleDrawer}
        className="p-3 bg-blue-50 cursor-pointer border border-dashed border-blue-500 flex items-center gap-4 w-64 h-20 rounded-md dark:bg-slate-800"
      >
        <div className="bg-blue-100 w-8 h-8 flex items-center justify-center rounded-md dark:bg-white">
          <Plus size={20} color="blue" />
        </div>
        <span className="text-sm text-blue-600">Add New Trigger</span>
      </button>

      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
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
          <span className="text-base font-semibold">Workflow Trigger</span>
          <span className="text-sm mt-2 text-gray-500">
            Adds a workflow trigger, and on execution, the contact gets added to{" "}
            <br />
            the workflow
          </span>
        </div>

        <div className="my-5 flex flex-col gap-2">
          {workflowTriggers?.map((item, index) => {
            return (
              <CreateTriggerModal
                key={index}
                workflowId={workflowId}
                item={item}
              />
            );
          })}
        </div>
      </Drawer>
    </div>
  );
};

export default AddNewTrigger;
