import React from "react";
import { faSync } from "@fortawesome/free-solid-svg-icons/faSync";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Api } from "api";
import { addNotification } from "../redux/actions";
import { useDispatch } from "react-redux";

interface RegenerateThumbnailButtonProps {
  mediumId: number;
}

const RegenerateThumbnailButton = (props: RegenerateThumbnailButtonProps) => {
  const dispatch = useDispatch();

  const onClick = () => {
    Api.Medium.regenerateThumbnail(props.mediumId).then((res: any) => {
      dispatch(
        addNotification({
          level: "info",
          contents: ["Successfully created new thumbnails."]
        })
      );
    });
  };

  return (
    <button
      className="button is-primary beevenue-medium-action-button"
      title="Regenerate thumbnail"
      onClick={e => onClick()}
    >
      <FontAwesomeIcon icon={faSync} />
    </button>
  );
};

export { RegenerateThumbnailButton };
