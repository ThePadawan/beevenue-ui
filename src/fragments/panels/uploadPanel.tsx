import React, { Component, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";

import { Api } from "../../api/api";

interface UploadPanelState {
  files: FileList | null;
  doneCount: number;
}

class UploadPanel extends Component<any, UploadPanelState, any> {
  public constructor(props: any) {
    super(props);
    this.state = { files: null, doneCount: 0 };
  }

  public async onSubmit(e: FormEvent) {
    e.preventDefault();

    if (this.state.files === null) {
      return;
    }

    for (let i = 0; i < this.state.files.length; ++i) {
      const f = this.state.files[i];
      await this.uploadFile(f);
    }
  }

  private async uploadFile(f: File) {
    await Api.uploadMedium(f).finally(() => {
      this.incrementDoneCount();
    });
  }

  private incrementDoneCount = () => {
    const newState = { ...this.state, doneCount: this.state.doneCount + 1 };
    if (this.state.files && newState.doneCount == this.state.files.length) {
      this.setState(newState);

      setTimeout(() => {
        this.setState({ ...this.state, files: null, doneCount: 0 });
      }, 5000);
    }
  };

  public onChange(files: FileList | null) {
    this.setState({ ...this.state, files: files, doneCount: 0 });
  }

  private get progressBarClasses() {
    let result = "beevenue-batch-upload progress";
    if (!this.state.files) {
      return result;
    }

    if (this.state.doneCount == this.state.files.length) {
      return result + " is-success";
    }

    return result + " is-warning";
  }

  private get box() {
    return (
      <div className="file is-boxed">
        <label className="file-label">
          <input
            className="file-input"
            multiple={true}
            type="file"
            name="medium"
            onChange={e => this.onChange(e.target.files)}
          />
          <span className="file-cta">
            <FontAwesomeIcon icon={faUpload} />
            <span className="file-label">Select files</span>
          </span>
          {this.state.files === null ? null : (
            <progress
              className={this.progressBarClasses}
              value={this.state.doneCount}
              max={this.state.files.length}
            />
          )}
        </label>
      </div>
    );
  }

  render() {
    return (
      <div className="card beevenue-sidebar-card">
        <div className="card-header">
          <p className="card-header-title">Upload</p>
        </div>
        <div className="card-content">
          <form method="POST" onSubmit={e => this.onSubmit(e)}>
            <div className="field">{this.box}</div>
            <div className="field">
              <input
                type="submit"
                className="button"
                disabled={this.state.files === null}
                value="Go"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export { UploadPanel };
