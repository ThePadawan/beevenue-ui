import React from "react";
import { Link } from "react-router-dom";
import { Api } from "api";
import { addNotification } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { forceRedirect } from "../../redirect";

const useRandomRuleViolation = (): (() => void) => {
  const [isChecking, setIsChecking] = useState(false);
  const dispatch = useDispatch();

  const doCheck = () => setIsChecking(true);

  useEffect(() => {
    if (!isChecking) return;
    Api.Tags.getAnyMissing()
      .then(res => {
        const mediumIds = Object.keys(res.data);
        if (mediumIds.length === 0) {
          dispatch(
            addNotification({
              level: "info",
              contents: ["No rule violations found!"]
            })
          );
        } else {
          forceRedirect(`/show/${mediumIds[0]}`);
        }
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [isChecking, dispatch]);

  return doCheck;
};

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
