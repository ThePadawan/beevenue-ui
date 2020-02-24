import React, { Component } from "react";
import { Api } from "../api/api";
import { connect } from "react-redux";
import { isSessionSfw } from "../redux/reducers/login";
import { setSfwSession } from "../redux/actions";

interface SfwButtonState {
  sfw: boolean;
}

class SfwButton extends Component<any, SfwButtonState, any> {
  public constructor(props: any) {
    super(props);
    this.state = { sfw: props.sfw };
  }

  public onChange() {
    const newValue = !this.state.sfw;
    Api.setSfwSession(newValue).then(
      _ => {
        this.props.setSfwSession(newValue);
        this.setState({ sfw: newValue });
      },
      _ => {}
    );
  }

  render() {
    return (
      <div className="field">
        <input
          type="checkbox"
          id="sfw-switch"
          name="sfw-switch"
          className="switch"
          defaultChecked={this.props.sfw}
          onChange={_ => this.onChange()}
        />
        <label htmlFor="sfw-switch">SFW</label>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { sfw: isSessionSfw(state.login) };
};

const x = connect(mapStateToProps, { setSfwSession })(SfwButton);
export { x as SfwButton };
