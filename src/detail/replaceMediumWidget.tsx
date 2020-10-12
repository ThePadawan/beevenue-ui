import React, { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";
import { Api } from "api";
import { ShowViewModel } from "../api/show";

interface ReplaceMediumWidgetProps {
  viewModel: ShowViewModel;
  setViewModel: (m: ShowViewModel) => void;
}

const onSubmit = (
  props: ReplaceMediumWidgetProps,
  e: FormEvent,
  file: File | null,
  setIsUploading: (b: boolean) => void
) => {
  e.preventDefault();

  if (file === null) return;

  setIsUploading(true);

  Api.Medium.replace(props.viewModel.id, file)
    .then((success) => {
      props.setViewModel(success.data);
    })
    .finally(() => {
      setIsUploading(false);
    });
};

const onChange = (
  setFile: (f: File | null) => void,
  incomingFiles: FileList | null
) => {
  if (incomingFiles === null || incomingFiles.length < 1) {
    setFile(null);
  } else {
    setFile(incomingFiles[0]);
  }
};

const useContent = (props: ReplaceMediumWidgetProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  return (
    <>
      <form
        method="POST"
        onSubmit={(e) => onSubmit(props, e, file, setIsUploading)}
      >
        <div className="field">
          <div className="file is-boxed">
            <label className="file-label">
              <input
                className="file-input"
                multiple={false}
                disabled={isUploading}
                type="file"
                name="medium"
                onChange={(e) => onChange(setFile, e.target.files)}
              />
              <span className="file-cta">
                <FontAwesomeIcon icon={faUpload} />
                <span className="file-label">Select new file</span>
              </span>
            </label>
          </div>
        </div>
        <div className="field">
          <input
            type="submit"
            className="button"
            disabled={isUploading || file === null}
            value="Go"
          />
        </div>
      </form>
    </>
  );
};

const ReplaceMediumWidget = (props: ReplaceMediumWidgetProps) => {
  return (
    <div className="card beevenue-sidebar-card">
      <header className="card-header">
        <p className="card-header-title">Replace medium</p>
      </header>
      <div className="card-content">
        <div className="content">{useContent(props)}</div>
      </div>
    </div>
  );
};

export { ReplaceMediumWidget };
