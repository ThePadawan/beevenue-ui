import React, { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";

import { setFileUploaded } from "../../redux/actions";
import { Api } from "../../api/api";
import { useDispatch } from "react-redux";

const UploadPanel = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [doneCount, setDoneCount] = useState(0);

  const dispatch = useDispatch();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (files === null) {
      return;
    }

    for (let i = 0; i < files.length; ++i) {
      const f = files[i];
      await uploadFile(f);
    }
  }

  async function uploadFile(f: File) {
    await Api.uploadMedium(f).finally(() => {
      incrementDoneCount();
    });
  }

  const incrementDoneCount = () => {
    const newDoneCount = doneCount + 1;
    if (files && newDoneCount === files.length) {
      setDoneCount(newDoneCount);
      dispatch(setFileUploaded());

      setTimeout(() => {
        setFiles(null);
        setDoneCount(0);
      }, 5000);
    }
  };

  const onChange = (files: FileList | null) => {
    setFiles(files);
    setDoneCount(0);
  };

  const getProgressBarClasses = () => {
    let result = "beevenue-batch-upload progress";
    if (!files) {
      return result;
    }

    if (doneCount === files.length) {
      return result + " is-success";
    }

    return result + " is-warning";
  };

  const getBox = () => {
    return (
      <div className="file is-boxed">
        <label className="file-label">
          <input
            className="file-input"
            multiple={true}
            type="file"
            name="medium"
            onChange={e => onChange(e.target.files)}
          />
          <span className="file-cta">
            <FontAwesomeIcon icon={faUpload} />
            <span className="file-label">Select files</span>
          </span>
          {files === null ? null : (
            <progress
              className={getProgressBarClasses()}
              value={doneCount}
              max={files.length}
            />
          )}
        </label>
      </div>
    );
  };

  return (
    <div className="card beevenue-sidebar-card">
      <div className="card-header">
        <p className="card-header-title">Upload</p>
      </div>
      <div className="card-content">
        <form method="POST" onSubmit={e => onSubmit(e)}>
          <div className="field">{getBox()}</div>
          <div className="field">
            <input
              type="submit"
              className="button"
              disabled={files === null}
              value="Go"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export { UploadPanel };
