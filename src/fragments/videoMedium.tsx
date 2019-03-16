import React, { Component } from "react";

import { MediumProps } from "./mediumProps";
import { mediaSource } from "../media";

class VideoMedium extends Component<MediumProps> {
  render() {
    return (
      <div>
        <video autoPlay={true} controls loop src={mediaSource(this.props)} />
      </div>
    );
  }
}

export { VideoMedium };
