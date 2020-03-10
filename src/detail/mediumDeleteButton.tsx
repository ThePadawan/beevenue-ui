import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { Api } from "api";
import { useDispatch } from "react-redux";
import { addNotification } from "../redux/actions";
import { forceRedirect } from "../redirect";

interface MediumDeleteButtonProps {
  mediumId: number;
}

const doConfirm = (dispatch: (x: any) => void, mediumId: number) => {
  Api.Medium.delete(mediumId)
    .then(
      res => {
        dispatch(
          addNotification({
            level: "info",
            contents: ["Successfully deleted medium."]
          })
        );
      },
      err => {
        dispatch(
          addNotification({
            level: "error",
            contents: ["Could not delete medium!"]
          })
        );
      }
    )
    .finally(() => {
      forceRedirect("/");
    });
};

const renderModalFooter = (onCloseModal: () => void, onConfirm: () => void) => {
  return (
    <footer className="modal-card-foot">
      <button className="button is-danger" onClick={e => onConfirm()}>
        Definitely delete forever
      </button>
      <button className="button" onClick={e => onCloseModal()}>
        Cancel
      </button>
    </footer>
  );
};

const renderModal = (onCloseModal: () => void, onConfirm: () => void) => {
  return (
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
        {renderModalFooter(onCloseModal, onConfirm)}
      </div>
    </div>
  );
};

const MediumDeleteButton = (props: MediumDeleteButtonProps) => {
  const [isShowingModel, setIsShowingModel] = useState(false);
  const dispatch = useDispatch();

  const onCloseModal = () => {
    setIsShowingModel(false);
  };

  const onConfirm = () => {
    doConfirm(dispatch, props.mediumId);
    onCloseModal();
  };

  return (
    <>
      {isShowingModel ? renderModal(onCloseModal, onConfirm) : null}
      <button
        className="button is-danger beevenue-medium-action-button"
        title="Delete"
        onClick={e => {
          setIsShowingModel(true);
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </>
  );
};

export { MediumDeleteButton };
