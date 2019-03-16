import React, { Component } from "react";
import { Api } from "../../api/api";

interface EditableTitleFieldProps {
  initialTitle: string;
  onTitleChanged?: (newTitle: string) => void;
}

interface EditableTitleFieldState {
  currentTitle: string | null;

  isBeingEdited: boolean;
}

class EditableTitleField extends Component<
  EditableTitleFieldProps,
  EditableTitleFieldState,
  any
> {
  public constructor(props: any) {
    super(props);
    this.state = {
      currentTitle: this.props.initialTitle,
      isBeingEdited: false
    };
  }

  public onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.stopEditing();
  };

  onChange(text: string) {
    this.setState({ ...this.state, currentTitle: text });
  }

  private beginEditing = () => {
    this.setState({ ...this.state, isBeingEdited: true });
  };

  private stopEditing = () => {
    if (!this.state.currentTitle) return;

    if (this.state.currentTitle === this.props.initialTitle) {
      this.setState({ ...this.state, isBeingEdited: false });
      return;
    }

    Api.Tags.rename(this.props.initialTitle, this.state.currentTitle).then(
      _ => {
        this.setState({ ...this.state, isBeingEdited: false });
        if (this.props.onTitleChanged) {
          this.props.onTitleChanged(this.state.currentTitle || "");
        }
      }
    );
  };

  render() {
    let content = null;
    if (this.state.isBeingEdited) {
      content = (
        <form
          onSubmit={e => this.onSubmit(e)}
          className="beevenue-editable-title"
        >
          <input
            className="input"
            onBlur={e => this.stopEditing()}
            type="text"
            autoFocus
            placeholder="Tag title"
            onChange={e => this.onChange(e.currentTarget.value)}
            value={this.state.currentTitle || ""}
          />
        </form>
      );
    } else {
      content = (
        <span onClick={e => this.beginEditing()}>
          "{this.state.currentTitle}" tag
        </span>
      );
    }

    return <>{content}</>;
  }
}

export { EditableTitleField };
