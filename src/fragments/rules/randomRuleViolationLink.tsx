import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getRandomRuleViolation } from "./randomRuleViolation";
import { addNotification, redirect } from "../../redux/actions";
import { connect } from "react-redux";

interface RandomRuleViolationButtonProps {
  addNotification: typeof addNotification;
  redirect: typeof redirect;
}
class RandomRuleViolationButton extends Component<
  RandomRuleViolationButtonProps,
  any,
  any
> {
  public constructor(props: RandomRuleViolationButtonProps) {
    super(props);
  }

  public onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    getRandomRuleViolation(this.props);
  };

  render() {
    return (
      <>
        <Link to="/rules/violations/any" onClick={e => this.onClick(e)}>
          Random rule violation
        </Link>
      </>
    );
  }
}

const x = connect(
  null,
  { addNotification, redirect }
)(RandomRuleViolationButton);
export { x as RandomRuleViolationButton };
