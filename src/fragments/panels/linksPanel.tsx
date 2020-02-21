import React, { Component } from "react";
import { Link } from "react-router-dom";
import { RandomRuleViolationButton } from "../rules/randomRuleViolationLink";

interface LinksPanelProps {
  isAdmin: boolean;
}

class LinksPanel extends Component<LinksPanelProps, any, any> {
  private get cardContent() {
    if (this.props.isAdmin) {
      return (
        <div className="card-content">
          <ul>
            <li>
              <Link to="/tags">Tags</Link>
            </li>
            <li>
              <Link to="/tagStats">Tag statistics</Link>
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
    } else {
      return (
        <div className="card-content">
          <ul>
            <li>
              <Link to="/tags">Tags</Link>
            </li>
          </ul>
        </div>
      );
    }
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
