import React, { Component } from "react";
import { connect } from "react-redux";

import { BeevenuePage, BeevenuePageProps } from "./beevenuePage";

import { redirect } from "../redux/actions";
import { match } from "react-router";

interface WildcardPageParams {
  whatever: string;
}

interface WildcardPageProps extends BeevenuePageProps
{
  match: match<WildcardPageParams>
  redirect: typeof redirect;
}

class WildcardPage extends Component<WildcardPageProps, any, any> {
  public constructor(props: WildcardPageProps) {
    super(props);
  }

  componentDidMount() {
    if (this.props.match.params.whatever) {
      this.props.redirect("/");
    }
  }

  render() {
    return (
      <BeevenuePage {...this.props}>
        <div className="column">
          <h1 className="title">Title</h1>
        </div>
      </BeevenuePage>
    );
  }
}

const x = connect(null, { redirect })(WildcardPage)
export { x as WildcardPage };
