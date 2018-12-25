import React, { Component } from "react";

import { MediumProps } from "./mediumProps";
import { MimeTypeToExtension } from "../media";

import { backendUrl } from "../config.json";

class VideoMedium extends Component<MediumProps> {
  get src() {
    const extension = MimeTypeToExtension(this.props.mime_type);
    return `${backendUrl}/files/${this.props.hash}${extension}`;
  }

  render() {
    return (
      <div>
        <video autoPlay={true} controls loop src={this.src}>
        </video>
      </div>
    );
  }
}

export { VideoMedium };
