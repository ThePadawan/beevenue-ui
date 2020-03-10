import React from "react";
import { MediumProps } from "./mediumProps";
import { mediaSource } from "./media";

const ImageMedium = (props: MediumProps) => {
  return (
    <div>
      <img src={mediaSource(props)} />
    </div>
  );
};

export { ImageMedium };
