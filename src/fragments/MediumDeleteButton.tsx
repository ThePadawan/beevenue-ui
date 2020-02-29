import React, { useState } from "react";

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
      <button className="button" onClick={e => onClick()}>
        Delete
      </button>
    </>
  );
};

export { MediumDeleteButton };
