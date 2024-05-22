import React, { useState } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [modalOpen, setModalOpen] = useState(isOpen);

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  // Function to handle confirmation action
  const handleConfirmAction = () => {
    setModalOpen(false);
    onConfirm();
  };

  return (
    <div
      className={`fixed top-0 right-0 left-0 z-50 flex justify-center items-center ${
        modalOpen ? "" : "hidden"
      }`}
    >
      <div
        className="bg-black bg-opacity-30 fixed inset-0"
        onClick={handleCloseModal}
      ></div>
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-white rounded-lg shadow">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={handleCloseModal}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 text-center">
            <svg
              className="mx-auto mb-4 text-gray-400 w-12 h-12"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete this product?
            </h3>
            <button
              type="button"
              onClick={handleConfirmAction}
              className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-3"
            >
              Yes, I'm sure
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="text-gray-900 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
