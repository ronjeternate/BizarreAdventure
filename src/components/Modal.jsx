import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-30 flex items-center  ">
      <div className="fixed inset-0 backdrop-blur-sm "></div>   
        {children}
    </div>
  );
};

export default Modal;
