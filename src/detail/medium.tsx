import React from "react";

import { VideoMedium } from "./videoMedium";
import { ImageMedium } from "./imageMedium";
import { MediumProps } from "./mediumProps";
import { SimilarMedia } from "./similarMedia";

const Medium = (props: MediumProps) => {
  let innerComponent;
  switch (props.mime_type) {
    case "video/mp4":
    case "video/webm":
    case "video/x-matroska":
      innerComponent = <VideoMedium {...props} />;
      break;
    case "image/jpeg":
    case "image/jpg":
    case "image/gif":
    case "image/png":
      innerComponent = <ImageMedium {...props} />;
      break;
  }

  return (
    <>
      {innerComponent}
      <SimilarMedia media={props.similar} />
    </>
  );
};

export { Medium };
