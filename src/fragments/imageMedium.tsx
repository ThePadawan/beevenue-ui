import React, { Component } from "react";
import { MediumProps } from "./mediumProps";
import { MimeTypeToExtension } from "../media";
import { backendUrl } from "../config.json";

class ImageMedium extends Component<MediumProps> {
  get src() {
    const extension = MimeTypeToExtension(this.props.mime_type);
    return `${backendUrl}/files/${this.props.hash}${extension}`;
  }

  render() {
    return (
      <div>
        <img src={this.src} />
      </div>
    );
  }
}

export { ImageMedium };
