import React from "react";
import { Link } from "react-router-dom";
import { useRandomRuleViolation } from "./randomRuleViolation";

const RandomRuleViolationLink = () => {
  const doCheck = useRandomRuleViolation();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    doCheck();
  };

  return (
    <Link to="#" onClick={e => onClick(e)}>
      Random rule violation
    </Link>
  );
};

export { RandomRuleViolationLink };
