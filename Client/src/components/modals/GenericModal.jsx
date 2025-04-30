import ReactModal from "react-modal";

//components
import { Tag } from "../Buttons/Tag";

//css
import "./GenericModal.css";

ReactModal.setAppElement("#root");

export const GenericModal = ({ closeModal, modalIsOpen, children, errors }) => {
  const modalStyle = {
    content: {
      position: "fixed",
      maxWidth: "705px",
      maxHeight: "400px",
      margin: "auto",
      overflow: "auto",
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
