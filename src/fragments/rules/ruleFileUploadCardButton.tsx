import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";
import { Api } from "../../api/api";
import { AxiosResponse } from "axios";

interface Invalid {
  status: "invalid";
  description: string;
}

interface Validating {
  status: "validating";
  description: string;
}

const STATUS_VALIDATING: Validating = {
  status: "validating",
  description: "Validating..."
};

interface Suspicious {
  status: "suspicious";
  description: string;
}

interface Valid {
  status: "valid";
  description: string;
  data: any; // TBD
}

interface Initial {
  status: "initial";
  description: string;
}

export const STATUS_INITIAL: Initial = {
  status: "initial",
  description: ""
};

export type RuleFileStatus =
  | Initial
  | Invalid
  | Validating
  | Suspicious
  | Valid;

interface ValidationResult {
  apiResult: AxiosResponse<any>;
  parsed: any;
}

interface RuleFileUploadCardButtonProps {
  onStatusChanged: (f: RuleFileStatus) => void;
}

const useSelectedFile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onChange = (f: FileList | null) => {
    if (!f || f.length !== 1) return;
    // props.onStatusChanged(f[0]);
    setSelectedFile(f[0]);
  };

  return { onChange, selectedFile };
};

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

const onFileValidated = (
  validationResult: ValidationResult,
  setStatus: (s: RuleFileStatus) => void
) => {
  const { apiResult, parsed } = validationResult;

  if (apiResult.data.ok === false) {
    setStatus({
      status: "invalid",
      description: `This is not valid: ${apiResult.data.data}`
    });
  } else {
    setStatus({
      status: "valid",
      description: `This is valid and contains ${apiResult.data.data} rules`,
      data: parsed
    });
  }
};

const validateFile = (parsed: string) => {
  return new Promise<ValidationResult>((resolve, reject) => {
    Api.Rules.validateJson(parsed)
      .then(success =>
        resolve({
          apiResult: success,
          parsed
        })
      )
      .catch(err => reject(err));
  });
};

const loadFileAndSetStatus = (
  f: File,
  setStatus: (s: RuleFileStatus) => void
): void => {
  setStatus(STATUS_VALIDATING);

  readFile(f)
    .then(parsed => validateFile(parsed))
    .then(success => onFileValidated(success, setStatus))
    .catch(err =>
      setStatus({
        status: "invalid",
        description: `This is not valid: ${err}`
      })
    );
};

const updateStatus = (
  f: File,
  setStatus: (s: RuleFileStatus) => void
): void => {
  if (f.size > 500 * 1024) {
    setStatus({
      status: "suspicious",
      description: "it is bigger than 500 KB"
    });
  }
  if (f.type !== "application/json") {
    setStatus({
      status: "suspicious",
      description: `it has the Mime-Type '${f.type}' and not 'application/json'.`
    });
  }

  loadFileAndSetStatus(f, setStatus);
};

const useSelectedFileHandler = (
  selectedFile: File | null,
  callback: (status: RuleFileStatus) => void
) => {
  const [status, setStatus] = useState<RuleFileStatus>(STATUS_INITIAL);

  useEffect(() => {
    if (selectedFile === null) return;
    updateStatus(selectedFile, setStatus);
  }, [selectedFile]);

  useEffect(() => {
    callback(status);
  }, [callback, status]);
};

export const RuleFileUploadCardButton = (
  props: RuleFileUploadCardButtonProps
) => {
  const { onChange, selectedFile } = useSelectedFile();

  useSelectedFileHandler(selectedFile, props.onStatusChanged);

  return (
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
  );
};
