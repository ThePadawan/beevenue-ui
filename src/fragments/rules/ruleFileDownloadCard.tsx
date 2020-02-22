import React, { Component } from "react";
import { backendUrl } from "../../config.json";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons/faFileDownload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface RuleFileDownloadCardProps {}

interface RuleFileDownloadCardState {
  file: File | null;
  status: string;
}

class RuleFileDownloadCard extends Component<
  RuleFileDownloadCardProps,
  RuleFileDownloadCardState,
  any
> {
  public constructor(props: any) {
    super(props);
    this.state = {
      file: null,
      status: "Select a file to upload"
    };
  }

  private get downloadButton() {
    return (
      <>
        <a className="button" download href={`${backendUrl}/rules/rules.json`}>
          <span className="icon">
            <FontAwesomeIcon icon={faFileDownload} />
          </span>
        </a>
      </>
    );
  }

  render() {
    return (
      <>
        <nav className="level">
          <div className="level-item">
            <div className="card beevenue-sidebar-card">
              <header className="card-header">
                <p className="card-header-title">Download rules file</p>
              </header>
              <div className="card-content">
                <div className="content">{this.downloadButton}</div>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export { RuleFileDownloadCard };
