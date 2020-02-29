import React, { useState } from "react";
import { Api } from "../../api/api";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Validity = "invalid" | "valid" | "validating" | "unknown";

interface RuleFileUploadCardProps {
  onUploaded: () => void;
}

const RuleFileUploadCard = (props: RuleFileUploadCardProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Select a file to upload");
  const [validity, setValidity] = useState<Validity>("unknown");

  const readFile = (f: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const tempResult = reader.result;

        if (!tempResult) {
          return;
        }

        if (typeof tempResult !== "string") {
          return;
        }

        try {
          const parsed = JSON.parse(tempResult);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsText(f);
    });
  };

  const suspiciousFile = (reason: string) => {
    setStatus(`That doesn't look like a rules file: ${reason}`);
  };

  const onChange = (f: FileList | null) => {
    if (!f) return;
    if (f.length > 1) return;

    const file = f[0];

    if (file.size > 500 * 1024) {
      return suspiciousFile("it is bigger than 500 KB");
    } else if (file.type !== "application/json") {
      return suspiciousFile(
        `it has the Mime-Type '${file.type}' and not 'application/json'.`
      );
    }

    setValidity("validating");

    readFile(file)
      .then(Api.Rules.validateJson)
      .then(
        success => {
          if (success.data.ok === false) {
            setStatus(`This is not valid: ${success.data.data}`);
            setValidity("invalid");
          } else {
            setFile(file);
            setStatus(`This is valid and contains ${success.data.data} rules`);
            setValidity("valid");
          }
        },
        err => {
          setStatus(`This is not valid: ${err}`);
          setValidity("invalid");
        }
      );
  };

  const onAccept = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!file) return;
    readFile(file)
      .then(Api.Rules.uploadJson)
      .then(success => {
        setFile(null);
        setStatus("This uploaded successfully");
        setValidity("unknown");
        props.onUploaded();
      });
  };

  const buttonClassName = (extra?: string): string => {
    let result = "button";
    if (extra) {
      result += ` ${extra}`;
    }
    if (validity === "validating") {
      result += " is-loading";
    }

    return result;
  };

  const getAcceptButtonClassName = () => {
    if (validity === "valid") {
      return buttonClassName("is-success");
    }

    if (validity === "invalid") {
      return buttonClassName("is-danger");
    }

    return buttonClassName();
  };

  const getIsAcceptButtonDisabled = (): boolean | undefined => {
    if (validity === "invalid" || validity === "unknown") {
      return true;
    }

    return undefined;
  };

  const getUploadBox = () => {
    return (
      <>
        <div className="file is-boxed">
          <label className="file-label">
            <input
              className="file-input"
              multiple={false}
              type="file"
              name="medium"
              onChange={e => onChange(e.target.files)}
            />
            <span className="file-cta">
              <FontAwesomeIcon icon={faUpload} />
              <span className="file-label">Upload rules file</span>
            </span>
          </label>
        </div>

        <div>{status}</div>

        <form>
          <button
            className={getAcceptButtonClassName()}
            onClick={e => onAccept(e)}
            disabled={getIsAcceptButtonDisabled()}
          >
            <span className="icon">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          </button>
        </form>
      </>
    );
  };

  return (
    <>
      <nav className="level">
        <div className="level-item">
          <div className="card beevenue-sidebar-card">
            <header className="card-header">
              <p className="card-header-title">Upload rules file</p>
            </header>
            <div className="card-content">
              <div className="content">{getUploadBox()}</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export { RuleFileUploadCard };
