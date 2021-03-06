import React from "react";
import { backendUrl } from "../config.json";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons/faFileDownload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RuleFileDownloadCard = () => {
  return (
    <>
      <nav className="level">
        <div className="level-item">
          <div className="card beevenue-sidebar-card">
            <header className="card-header">
              <p className="card-header-title">Download rules file</p>
            </header>
            <div className="card-content">
              <div className="content">
                <a
                  className="button"
                  download
                  href={`${backendUrl}/rules/rules.json`}
                >
                  <span className="icon">
                    <FontAwesomeIcon icon={faFileDownload} />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export { RuleFileDownloadCard };
