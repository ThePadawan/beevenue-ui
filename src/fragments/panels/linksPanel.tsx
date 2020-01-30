import React, { Component } from "react";
import { Link } from "react-router-dom";
import { RandomRuleViolationButton } from "../rules/randomRuleViolationLink";

class LinksPanel extends Component {
  private get cardContent() {
    return (
      <div className="card-content">
        <ul>
          <li>
            <Link to="/upload">Batch upload</Link>
          </li>
          <li>
            <Link to="/tags">Tag statistics</Link>
          </li>
          <li>
            <Link to="/rules">Configure rules</Link>
          </li>
          <li>
            <RandomRuleViolationButton />
          </li>
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div className="card beevenue-sidebar-card">
        <div className="card-header">
          <p className="card-header-title">Links</p>
        </div>
        {this.cardContent}
      </div>
    );
  }
}

export { LinksPanel };
