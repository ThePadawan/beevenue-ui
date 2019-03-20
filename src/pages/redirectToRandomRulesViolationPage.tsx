import React, { Component } from "react";

import { Api } from "../api/api";
import { redirect } from "../redux/actions";
import { connect } from "react-redux";

interface RedirectToRandomRulesViolationPageProps {
  redirect: typeof redirect;
}

class RedirectToRandomRulesViolationPage extends Component<
  RedirectToRandomRulesViolationPageProps,
  any,
  any
> {
  public constructor(props: any) {
    super(props);
    this.state = {};
  }

  public componentDidMount = () => {
    Api.getAnyMissing().then(res => {
      const mediumIds = Object.keys(res.data);
      if (mediumIds.length === 0) {
        this.props.redirect("/");
      } else {
        this.props.redirect(`/show/${mediumIds[0]}`);
      }
    });
  };

  render() {
    return <></>;
  }
}

const x = connect(
  null,
  { redirect }
)(RedirectToRandomRulesViolationPage);
export { x as RedirectToRandomRulesViolationPage };
