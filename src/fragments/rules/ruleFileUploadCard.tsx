import React, { Component } from "react";
import { Api } from "../../api/api";
import { faUpload, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Validity = "invalid" | "valid" | "validating" | "unknown";

interface RuleFileUploadCardProps {
  onUploaded: () => void;
}

interface RuleFileUploadCardState {
  file: File | null;
  status: string;

  validity: Validity;
}

class RuleFileUploadCard extends Component<
  RuleFileUploadCardProps,
  RuleFileUploadCardState,
  any
> {
  static defaultProps: RuleFileUploadCardProps = { onUploaded: () => {} };

  public constructor(props: any) {
    super(props);
    this.state = {
      file: null,
      status: "Select a file to upload",
      validity: "unknown"
    };
  }

  private readFile = (f: File): Promise<any> => {
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

  private suspiciousFile = (reason: string) => {
    this.setState({
      ...this.state,
      status: `That doesn't look like a rules file: ${reason}`
    });
  };

  private onChange = (f: FileList | null) => {
    if (!f) return;
    if (f.length > 1) return;

    const file = f[0];

    if (file.size > 500 * 1024) {
      return this.suspiciousFile("it is bigger than 500 KB");
    } else if (file.type != "application/json") {
      return this.suspiciousFile(
        `it has the Mime-Type '${file.type}' and not 'application/json'.`
      );
    }

    this.setState({ ...this.state, validity: "validating" });

    this.readFile(file)
      .then(Api.Rules.validateJson)
      .then(
        success => {
          if (success.data.ok === false) {
            this.setState({
              ...this.state,
              status: `This is not valid: ${success.data.data}`,
              validity: "invalid"
            });
          } else {
            this.setState({
              ...this.state,
              file,
              status: `This is valid and contains ${success.data.data} rules`,
              validity: "valid"
            });
          }
        },
        err => {
          this.setState({
            ...this.state,
            status: `This is not valid: ${err}`,
            validity: "invalid"
          });
        }
      );
  };

  private onAccept = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!this.state.file) return;
    this.readFile(this.state.file)
      .then(Api.Rules.uploadJson)
      .then(success => {
        this.setState({
          ...this.state,
          file: null,
          validity: "unknown",
          status: "This uploaded successfully"
        });
        // TODO: How to reset selected file of input element?
        this.props.onUploaded();
      });
  };

  private buttonClassName(extra?: string): string {
    let result = "button";
    if (extra) {
      result += ` ${extra}`;
    }
    if (this.state.validity === "validating") {
      result += " is-loading";
    }

    return result;
  }

  private get acceptButtonClassName() {
    if (this.state.validity === "valid") {
      return this.buttonClassName("is-success");
    }

    if (this.state.validity === "invalid") {
      return this.buttonClassName("is-danger");
    }

    return this.buttonClassName();
  }

  private get isAcceptButtonDisabled(): boolean | undefined {
    if (
      this.state.validity === "invalid" ||
      this.state.validity === "unknown"
    ) {
      return true;
    }

    return undefined;
  }

  private get uploadBox() {
    return (
      <>
        <div className="file is-boxed">
          <label className="file-label">
            <input
              className="file-input"
              multiple={false}
              type="file"
              name="medium"
              onChange={e => this.onChange(e.target.files)}
            />
            <span className="file-cta">
              <FontAwesomeIcon icon={faUpload} />
              <span className="file-label">Upload rules file</span>
            </span>
          </label>
        </div>

        <div>{this.state.status}</div>

        <form>
          <button
            className={this.acceptButtonClassName}
            onClick={e => this.onAccept(e)}
            disabled={this.isAcceptButtonDisabled}
          >
            <span className="icon">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          </button>
        </form>
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
                <p className="card-header-title">Upload rules file</p>
              </header>
              <div className="card-content">
                <div className="content">{this.uploadBox}</div>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export { RuleFileUploadCard };
