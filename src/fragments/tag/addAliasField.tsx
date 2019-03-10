import React, { Component } from "react";
import { Api } from "../../api/api";

interface AddAliasFieldProps {
  tag: string;
  onAliasAdded: (alias: string) => void;
}

interface AddAliasFieldState {
  currentAlias: string | null;

  isSubmitting: boolean;
}

class AddAliasField extends Component<
  AddAliasFieldProps,
  AddAliasFieldState,
  any
> {
  public constructor(props: any) {
    super(props);
    this.state = { currentAlias: null, isSubmitting: false };
  }

  public onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!this.state.currentAlias) return;

    this.setState({ ...this.state, isSubmitting: true });

    Api.Tags.addAlias(this.props.tag, this.state.currentAlias).then(
      _ => {
        this.props.onAliasAdded(this.state.currentAlias!);
        this.setState({ currentAlias: null, isSubmitting: false });
      },
      _ => {
        this.setState({ ...this.state, isSubmitting: false });
      }
    );
  };

  onChange(text: string) {
    this.setState({ ...this.state, currentAlias: text });
  }

  render() {
    return (
      <>
        <div
          className={
            "beevenue-add-alias-field control" +
            (this.state.isSubmitting ? " is-loading" : "")
          }
        >
          <form onSubmit={e => this.onSubmit(e)}>
            <input
              className="input"
              type="text"
              placeholder="New alias"
              value={this.state.currentAlias || ""}
              onChange={e => this.onChange(e.currentTarget.value)}
              disabled={this.state.isSubmitting}
            />
          </form>
        </div>
      </>
    );
  }
}

export { AddAliasField };
