import ModalComponent from "react-modal";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    overflow: "auto",
    maxHeight: "70vh",
    backgroundColor: "#101010",
    color: "white",
  },
};

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onRequestClose, children }: ModalProps) => {
  return (
    <ModalComponent
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      {children}
    </ModalComponent>
  );
};
