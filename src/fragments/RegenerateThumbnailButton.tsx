import React, { Component } from "react";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Api } from "../api/api";
import { addNotification } from '../redux/actions';
import { connect } from "react-redux";

interface RegenerateThumbnailButtonProps {
    mediumId: number;

    addNotification: typeof addNotification;
}

class RegenerateThumbnailButton extends Component<RegenerateThumbnailButtonProps, any, any> {
  public constructor(props: RegenerateThumbnailButtonProps) {
    super(props);
    this.state = { isShowingModel: false };
  }

  public onClick = () => {
    Api.regenerateThumbnail(this.props.mediumId).then(
        (res: any) => {
            this.props.addNotification({
                level: "info",
                contents: [
                    "Successfully created new thumbnails."
                ]
            });
        },
        (err: any) => {
            this.props.addNotification(err.response.data);
        }
      );
  };

  render() {
    return (
        <button
        className="button is-primary"
        onClick={e => this.onClick()}
        >
        <FontAwesomeIcon icon={faSync} />
        </button>
      );
  }
}

const x = connect(null, { addNotification })(RegenerateThumbnailButton);
export { x as RegenerateThumbnailButton };
