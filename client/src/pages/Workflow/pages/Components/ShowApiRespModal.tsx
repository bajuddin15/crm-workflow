import { Eye, X } from "lucide-react";
import { useState } from "react";
import KeyValueComp from "../../../../components/KeyValueComp";

interface IState {
  openModal: boolean;
  name: string;
  description: string;
  loading: boolean;
}

interface IProps {
  data: any;
}

const ShowApiRespModal: React.FC<IProps> = ({ data }) => {
  const [openModal, setOpenModal] = useState<IState["openModal"]>(false);

  return (
    <div>
      {/* Open the modal using setOpenModal */}
      <button
        onClick={() => setOpenModal(true)}
        className="bg-blue-500 text-white flex items-center gap-2 p-1 rounded-md"
      >
        <Eye size={16} color="white" />
      </button>
      {openModal && (
        <dialog
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          className="modal modal-bottom sm:modal-middle"
          open
        >
          <div className="modal-box">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-bold text-lg">Api Response</h3>

              <div
                className="cursor-pointer"
                onClick={() => setOpenModal(false)}
              >
                <X size={20} />
              </div>
            </div>

            <div>
              <KeyValueComp data={data} />
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ShowApiRespModal;
