import React, { Component } from "react";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Api } from "../../api/api";
import { setFileUploaded } from '../../redux/actions';

interface UploadPanelProps {
  setFileUploaded: typeof setFileUploaded;
}

interface UploadPanelState {
  file: File | null;
}

class UploadPanel extends Component<UploadPanelProps, UploadPanelState, any> {
  public constructor(props: UploadPanelProps) {
    super(props);
    this.state = { file: null };
  }

  public onSubmit = (event: any) => {
    event.preventDefault();

    if (!this.state.file) {
      return;
    }

    Api.uploadMedium(this.state.file).then(
      (res: any) => {
        this.props.setFileUploaded();
      }
    );
  };

  public onChange = (files: FileList | null) => {
    if (!files) {
      return;
    }

    this.setState({ file: files[0] });
  };

  render() {
    return (
      <>
        <div className="card beevenue-sidebar-card">
          <div className="card-header">
            <p className="card-header-title">Upload</p>
          </div>
          <div className="card-content">
            <div className="content">
              <form method="POST" onSubmit={e => this.onSubmit(e)}>
                <div className="field">
                  <div className="file is-boxed">
                    <label className="file-label">
                      <input
                        className="file-input"
                        type="file"
                        name="medium"
                        onChange={e => this.onChange(e.target.files)}
                      />
                      <span className="file-cta">
                        <FontAwesomeIcon icon={faUpload} />
                        <span className="file-label">Select file</span>
                      </span>
                      {this.state.file != null ? (
                        <span className="file-name">
                          {this.state.file.name}
                        </span>
                      ) : null}
                    </label>
                  </div>
                </div>
                <div className="field">
                  <input type="submit" className="button" disabled={this.state.file === null} value="Go" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const x = connect(null, { setFileUploaded })(UploadPanel);
export { x as UploadPanel };
