import React, { Component } from "react";
import { Link } from "react-router-dom";
import { RandomRuleViolationButton } from "../rules/randomRuleViolationLink";

interface LinksPanelProps {
  isAdmin: boolean;
}

class LinksPanel extends Component<LinksPanelProps, any, any> {
  private get cardContent() {
    let items = [
      <Link to="/tags">Tags</Link>,
      <Link to="/tagStats">Tag statistics</Link>
    ];

    if (this.props.isAdmin) {
      items.push(<Link to="/rules">Configure rules</Link>);
      items.push(<RandomRuleViolationButton />);
    }

    return (
      <div className="card-content">
        <ul>
          {items.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
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
