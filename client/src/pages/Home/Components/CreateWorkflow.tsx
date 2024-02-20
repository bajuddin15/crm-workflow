import axios from "axios";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface IState {
  openModal: boolean;
  name: string;
  description: string;
  loading: boolean;
}

interface IProps {
  fetchAllWorkflows: () => void;
}

const CreateWorkflow: React.FC<IProps> = ({ fetchAllWorkflows }) => {
  const [openModal, setOpenModal] = useState<IState["openModal"]>(false);
  const [name, setName] = useState<IState["name"]>("");
  const [description, setDescription] = useState<IState["description"]>("");
  const [loading, setLoading] = useState<IState["loading"]>(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    const formData = {
      name,
      description,
      token: "OMs5rXuCphJxcYqSnmVP9RQAy",
    };

    try {
      const res = await axios.post("/api/workflow/create", formData);
      if (res && res.status === 201) {
        toast.success(res?.data?.message);
        setOpenModal(false);
        fetchAllWorkflows();
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
    setLoading(false);
  };
  return (
    <div>
      {/* Open the modal using setOpenModal */}
      <button
        onClick={() => setOpenModal(true)}
        className="bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-md"
      >
        <Plus size={20} color="white" />
        <span className="text-sm font-medium">Create Workflow</span>
      </button>
      {openModal && (
        <dialog
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          className="modal modal-bottom sm:modal-middle"
          open
        >
          <div className="modal-box">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-bold text-lg">Create Workflow</h3>

              <div
                className="cursor-pointer"
                onClick={() => setOpenModal(false)}
              >
                <X size={20} />
              </div>
            </div>

            <form className="flex flex-col gap-4">
              <div className="space-y-2 flex flex-col">
                <span>Name *</span>
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-bordered w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <span>Description</span>
                <input
                  type="text"
                  placeholder="Description"
                  className="input input-bordered w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white my-2 px-4 py-3 rounded-lg hover:bg-blue-600"
              >
                {loading ? "Please wait.." : "Create"}
              </button>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default CreateWorkflow;
