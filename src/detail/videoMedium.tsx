import React from "react";

import { MediumProps } from "./mediumProps";
import { mediaSource } from "./media";

const VideoMedium = (props: MediumProps) => {
  return (
    <div>
      <video autoPlay={true} controls loop src={mediaSource(props)} />
    </div>
  );
};

export { VideoMedium };
