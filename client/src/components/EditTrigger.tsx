import { Pencil, X } from "lucide-react";
import React from "react";
// import component 👇
import Drawer from "react-modern-drawer";
import EditTriggerModal from "./ActionModal/EditTriggerModal";

interface IProps {
  workflowTriggers: Array<any>;
  workflowId: any;
  currentTrigger: any;
}

const EditTrigger: React.FC<IProps> = ({
  workflowTriggers,
  workflowId,
  currentTrigger,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <button
        onClick={toggleDrawer}
        className="cursor-pointer w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md"
      >
        <Pencil size={12} color="gray" />
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
          <span className="text-base text-gray-700 font-semibold">
            Update Workflow Trigger
          </span>
          <span className="text-sm mt-2 text-gray-500">
            Update a workflow trigger, and on execution, the contact gets added
            to <br />
            the workflow
          </span>
        </div>

        <div className="my-5 flex flex-col gap-2">
          {workflowTriggers?.map((item, index) => {
            return (
              <EditTriggerModal
                key={index}
                workflowId={workflowId}
                currentTrigger={currentTrigger}
                item={item}
              />
            );
          })}
        </div>
      </Drawer>
    </>
  );
};

export default EditTrigger;
