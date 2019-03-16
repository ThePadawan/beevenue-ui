import React, { Component, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

import { Api } from "../api/api";
import { NeedsLoginPage } from "./needsLoginPage";

interface BatchUploadPageState {
  files: FileList | null;
  doneCount: number;
}

class BatchUploadPage extends Component<any, BatchUploadPageState, any> {
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
    await Api.uploadMedium(f).then(
      (res: any) => {
        this.setState({ ...this.state, doneCount: this.state.doneCount + 1 });
      },
      (err: any) => {
        this.setState({ ...this.state, doneCount: this.state.doneCount + 1 });
      }
    );
  }

  public onChange(files: FileList | null) {
    this.setState({ ...this.state, files: files });
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

  private get form() {
    return (
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
    );
  }

  render() {
    return (
      <NeedsLoginPage>
        <div>{this.form}</div>
      </NeedsLoginPage>
    );
  }
}

export { BatchUploadPage };
