import React, { Component } from "react";
import { MediumProps } from "./mediumProps";
import { mediaSource } from "../media";

class ImageMedium extends Component<MediumProps> {
  render() {
    return (
      <div>
        <img src={mediaSource(this.props)} />
      </div>
    );
  }
}

export { ImageMedium };
