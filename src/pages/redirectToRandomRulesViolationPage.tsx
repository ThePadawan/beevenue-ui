import React, { Component } from "react";

import { redirect, addNotification } from "../redux/actions";
import { connect } from "react-redux";
import { getRandomRuleViolation } from "../fragments/rules/randomRuleViolation";

interface RedirectToRandomRulesViolationPageProps {
  addNotification: typeof addNotification;
  redirect: typeof redirect;
}

class RedirectToRandomRulesViolationPage extends Component<
  RedirectToRandomRulesViolationPageProps,
  any,
  any
> {
  public constructor(props: RedirectToRandomRulesViolationPageProps) {
    super(props);
    this.state = {};
  }

  public componentDidMount = () => {
    getRandomRuleViolation(this.props);
  };

  render() {
    return <></>;
  }
}

const x = connect(null, { addNotification, redirect })(
  RedirectToRandomRulesViolationPage
);
export { x as RedirectToRandomRulesViolationPage };
export default x;
