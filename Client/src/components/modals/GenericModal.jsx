import ReactModal from "react-modal";

//css
import "./GenericModal.css";

ReactModal.setAppElement("#root");

export const GenericModal = ({ closeModal, modalIsOpen, children, errors }) => {
  const modalStyle = {
    content: {
      position: "fixed",
      maxWidth: "fit-content",
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
        className='container-modal'
      >
        <div className="container-content-modal">{children}</div>
      </ReactModal>
    </>
  );
};
