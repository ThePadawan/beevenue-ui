import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";

interface MediumDeleteButtonProps {
  onConfirm: () => void;
}

const MediumDeleteButton = (props: MediumDeleteButtonProps) => {
  const [isShowingModel, setIsShowingModel] = useState(false);

  const onClick = () => {
    setIsShowingModel(true);
  };

  const onCloseModal = () => {
    setIsShowingModel(false);
  };

  const onConfirm = () => {
    props.onConfirm();
    onCloseModal();
  };

  let maybeModal = null;
  if (isShowingModel) {
    maybeModal = (
      <div className="modal is-active">
        <div className="modal-background" onClick={e => onCloseModal()} />

        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Confirm</p>
            <button
              className="delete"
              aria-label="close"
              onClick={e => onCloseModal()}
            />
          </header>
          <section className="modal-card-body">
            Are you sure you want to delete this?
          </section>
          <footer className="modal-card-foot">
            <button className="button is-danger" onClick={e => onConfirm()}>
              Definitely delete forever
            </button>
            <button className="button" onClick={e => onCloseModal()}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <>
      {maybeModal}
      <button
        className="button is-danger beevenue-medium-action-button"
        title="Delete"
        onClick={e => onClick()}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </>
  );
};

export { MediumDeleteButton };
