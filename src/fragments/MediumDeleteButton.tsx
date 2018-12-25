import React, { Component } from "react";

interface MediumDeleteButtonProps {
  onConfirm: () => void;
}

class MediumDeleteButton extends Component<MediumDeleteButtonProps, any, any> {
  public constructor(props: MediumDeleteButtonProps) {
    super(props);
    this.state = { isShowingModel: false };
  }

  public onClick = () => {
    this.setState({ isShowingModel: true });
  };

  public onCloseModal = () => {
    this.setState({ isShowingModel: false });
  };

  public onConfirm = () => {
    this.props.onConfirm();
    this.onCloseModal();
  }

  render() {
    let maybeModal = null;
    if (this.state.isShowingModel) {
      maybeModal = (
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={e => this.onCloseModal()}
          />

          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Confirm</p>
              <button
                className="delete"
                aria-label="close"
                onClick={e => this.onCloseModal()}
              />
            </header>
            <section className="modal-card-body">
              Are you sure you want to delete this?
            </section>
            <footer className="modal-card-foot">
              <button
                className="button is-danger"
                onClick={e => this.onConfirm()}
              >
                Definitely delete forever
              </button>
              <button className="button" onClick={e => this.onCloseModal()}>
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
        <button className="button" onClick={e => this.onClick()}>
          Delete
        </button>
      </>
    );
  }
}

export { MediumDeleteButton };
