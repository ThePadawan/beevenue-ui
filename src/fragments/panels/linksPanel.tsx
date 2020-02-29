import React from "react";
import { Link } from "react-router-dom";
import { RandomRuleViolationLink } from "../rules/randomRuleViolationLink";

interface LinksPanelProps {
  isAdmin: boolean;
}

const LinksPanel = (props: LinksPanelProps) => {
  const cardContent = () => {
    let items = [
      <Link to="/tags">Tags</Link>,
      <Link to="/tagStats">Tag statistics</Link>
    ];

    if (props.isAdmin) {
      items.push(<Link to="/rules">Configure rules</Link>);
      items.push(<RandomRuleViolationLink />);
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
  };

  return (
    <div className="card beevenue-sidebar-card">
      <div className="card-header">
        <p className="card-header-title">Links</p>
      </div>
      {cardContent()}
    </div>
  );
};

export { LinksPanel };
