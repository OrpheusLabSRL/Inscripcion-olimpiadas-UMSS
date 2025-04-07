import ReactModal from "react-modal";

//components
import { Tag } from "../Buttons/Tag";

//css
import "./GenericModal.css";

ReactModal.setAppElement("#root");

export const GenericModal = ({ closeModal, modalIsOpen, children }) => {
  const modalStyle = {
    content: {
      position: "fixed",
      maxWidth: "600px",
      maxHeight: "300px",
      margin: "auto",
      overflow: "none",
      border: "1px solid black",
    },

    overlay: {
      backgroundColor: "none",
    },
  };

  return (
    <>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Ejemplo de Modal"
        style={modalStyle}
      >
        <div className="container-modal">{children}</div>
      </ReactModal>
    </>
  );
};
