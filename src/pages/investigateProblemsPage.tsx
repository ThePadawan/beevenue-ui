import React, { Component } from "react";

import { Api } from "../api/api";
import { NeedsLoginPage } from "./needsLoginPage";
import { Link } from "react-router-dom";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";

interface InvestigateProblemsPageState {
  problems: any | null;
}

class InvestigateProblemsPage extends Component<any, InvestigateProblemsPageState, any> {
  public constructor(props: any) {
    super(props);
    this.state = { problems: null };
  }

  public componentDidMount = () => {
    Api.getProblems().then(
      res => {
        this.setState({ problems: res.data });
      }
    );
  };

  private get rows() {

    return this.state.problems.map((problem: any) => {
      return problem.reasons.map((reason: any, idx: number) => (
        <tr key={`${problem.mediumId}-${idx}`}>
          <td>
            <Link to={`/show/${problem.mediumId}`}>Medium {problem.mediumId}</Link>
          </td>
          <td>
            {reason}
          </td>
        </tr>
      ));
    });
  };

  private getTable = () => {
    return (
      <table className="table">
      <thead>
        <tr>
          <th>Medium</th>
          <th>Problem</th>
        </tr>
      </thead>
      <tbody>
        {this.rows}
      </tbody>
    </table>
    );
  };

  render() {
    let content: JSX.Element;
    if (this.state.problems === null) {
      content = <BeevenueSpinner />
    } else {
      content = this.getTable();
    }

    return (
      <NeedsLoginPage>
        {content}
      </NeedsLoginPage>
    );
  }
}

export { InvestigateProblemsPage };
