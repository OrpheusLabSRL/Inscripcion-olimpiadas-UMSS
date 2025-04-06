import ReactModal from "react-modal";

//components
import { Tag } from "../Buttons/Tag";

//css
import "./likesModal.css";

ReactModal.setAppElement("#root");

export const LikesModal = ({
  closeModal,
  modalIsOpen,
  likes = [],
  onSelectedLike,
}) => {
  const modalStyle = {
    content: {
      position: "fixed",
      maxWidth: "500px",
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
        <h2>Elige tus gustos!</h2>

        <div className="container-modal-likes-choose">
          {likes.map((like) => {
            return (
              <Tag
                value={like}
                key={like}
                onClick={() => onSelectedLike(like)}
              />
            );
          })}
        </div>
      </ReactModal>
    </>
  );
};
