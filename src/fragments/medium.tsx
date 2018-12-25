import React, { Component } from "react";

import { VideoMedium } from "./videoMedium";
import { ImageMedium } from "./imageMedium";
import { MediumProps } from "./mediumProps";
import { SimilarMedia } from "./similarMedia";

class Medium extends Component<MediumProps, {}, any> {
  public constructor(props: MediumProps) {
    super(props);
  }

  render() {
    let innerComponent;
    switch (this.props.mime_type) {
      case "video/mp4":
      case "video/webm":
        innerComponent = <VideoMedium {...this.props} />;
        break;
      case "image/jpeg":
      case "image/jpg":
      case "image/gif":
      case "image/png":
        innerComponent = <ImageMedium {...this.props} />;
        break;
    }

    return <>{innerComponent}<SimilarMedia media={this.props.similar} /></>;
  }
}

export { Medium };
