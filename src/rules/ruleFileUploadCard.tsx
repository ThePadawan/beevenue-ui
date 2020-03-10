import React, { useState, useMemo } from "react";
import { Api } from "api";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  RuleFileUploadCardButton,
  RuleFileStatus,
  STATUS_INITIAL
} from "./ruleFileUploadCardButton";

interface RuleFileUploadCardProps {
  onUploaded: () => void;
}

const onAcceptWrapper = (
  s: RuleFileStatus,
  setStatus: (s: RuleFileStatus) => void,
  onUploaded: () => void,
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
  e.preventDefault();

  if (s.status !== "valid") {
    return;
  }

  Api.Rules.uploadJson(s.data).then(success => {
    setStatus(STATUS_INITIAL);
    onUploaded();
  });
};

const buttonClassName = (extra?: string): string => {
  let result = "button";
  if (extra) {
    result += ` ${extra}`;
  }

  return result;
};

const useAcceptButtonStyling = (s: RuleFileStatus) => {
  const acceptButtonClassName = useMemo(() => {
    if (s.status === "valid") return buttonClassName("is-success");
    if (s.status === "invalid") return buttonClassName("is-danger");
    if (s.status === "validating") return buttonClassName("is-loading");

    return buttonClassName();
  }, [s]);

  const isAcceptButtonDisabled = useMemo(() => {
    if (s.status === "invalid" || s.status === "validating") {
      return true;
    }
    return undefined;
  }, [s]);

  return {
    acceptButtonClassName,
    isAcceptButtonDisabled
  };
};

const useForm = (
  s: RuleFileStatus,
  setStatus: (s: RuleFileStatus) => void,
  onUploaded: () => void,
  onAccept: typeof onAcceptWrapper
) => {
  const {
    acceptButtonClassName,
    isAcceptButtonDisabled
  } = useAcceptButtonStyling(s);
  return (
    <form>
      <button
        className={acceptButtonClassName}
        onClick={e => onAccept(s, setStatus, onUploaded, e)}
        disabled={isAcceptButtonDisabled}
      >
        <span className="icon">
          <FontAwesomeIcon icon={faCheck} />
        </span>
      </button>
    </form>
  );
};

const wrap = (inner: JSX.Element): JSX.Element => {
  return (
    <nav className="level">
      <div className="level-item">
        <div className="card beevenue-sidebar-card">
          <header className="card-header">
            <p className="card-header-title">Upload rules file</p>
          </header>
          <div className="card-content">
            <div className="content">{inner}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const RuleFileUploadCard = (props: RuleFileUploadCardProps) => {
  const [status, setStatus] = useState<RuleFileStatus>(STATUS_INITIAL);
  const form = useForm(status, setStatus, props.onUploaded, onAcceptWrapper);

  const getUploadBox = () => {
    return (
      <>
        <RuleFileUploadCardButton onStatusChanged={setStatus} />
        <div>{status?.description}</div>
        {form}
      </>
    );
  };

  return wrap(getUploadBox());
};

export { RuleFileUploadCard };
