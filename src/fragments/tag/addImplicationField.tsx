import React, { Component } from "react";
import { Api } from "../../api/api";

export type Mode = "ImplyingThis" | "ImpliedByThis";

interface AddImplicationFieldProps {
  tag: string;
  mode: Mode;
  onImplicationAdded: (implication: string) => void;
}

interface AddImplicationFieldState {
  currentName: string | null;

  isSubmitting: boolean;
}

class AddImplicationField extends Component<
  AddImplicationFieldProps,
  AddImplicationFieldState,
  any
> {
  public constructor(props: any) {
    super(props);
    this.state = { currentName: null, isSubmitting: false };
  }

  public onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!this.state.currentName) return;

    this.setState({ ...this.state, isSubmitting: true });
    const name = this.state.currentName;

    switch (this.props.mode) {
      case "ImpliedByThis":
        Api.Tags.addImplication(this.props.tag, name).then(
          res => {
            this.props.onImplicationAdded(name);
            this.setState({
              ...this.state,
              currentName: null,
              isSubmitting: false
            });
          },
          err => {
            this.setState({ ...this.state, isSubmitting: false });
          }
        );
        break;

      case "ImplyingThis":
        Api.Tags.addImplication(name, this.props.tag).then(
          res => {
            this.props.onImplicationAdded(name);
            this.setState({
              ...this.state,
              currentName: null,
              isSubmitting: false
            });
          },
          err => {
            this.setState({ ...this.state, isSubmitting: false });
          }
        );
        break;
    }
  };

  onChange(text: string) {
    this.setState({ ...this.state, currentName: text });
  }

  render() {
    return (
      <>
        <div
          className={
            "beevenue-add-implication-field" +
            (this.state.isSubmitting ? " is-loading" : "")
          }
        >
          <form onSubmit={e => this.onSubmit(e)}>
            <input
              className="input"
              type="text"
              placeholder="New implication"
              value={this.state.currentName || ""}
              onChange={e => this.onChange(e.currentTarget.value)}
              disabled={this.state.isSubmitting}
            />
          </form>
        </div>
      </>
    );
  }
}

export { AddImplicationField };
