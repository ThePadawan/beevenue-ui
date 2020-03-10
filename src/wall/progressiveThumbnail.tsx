import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SpeedTaggingItem } from "./speedTaggingItem";
import { backendUrl } from "../config.json";
import { useBeevenueSelector } from "../redux/selectors";

interface Medium {
  id: number;
}

interface ProgressiveThumbnailProps {
  src?: string;
  medium: Medium;
}

const ProgressiveThumbnail = (props: ProgressiveThumbnailProps) => {
  const isSpeedTagging = useBeevenueSelector(
    store => store.speedTagging.isSpeedTagging
  );

  const [doBlur, setDoBlur] = useState(true);
  const [src, setSrc] = useState(props.src!);

  const isMounted = useRef(true);

  useEffect(() => {
    new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve(img.src);
      };

      img.src = `${backendUrl}/thumbs/${props.medium.id}`;
    }).then((resSrc: any) => {
      if (!isMounted.current) return;
      setSrc(resSrc);
      setDoBlur(false);
      isMounted.current = false;
    });

    return () => {
      isMounted.current = false;
    };
  }, [props.medium.id]);

  const className = doBlur ? "tiny-thumb" : undefined;

  if (isSpeedTagging) {
    const innerProps = {
      ...props.medium
    };

    return (
      <SpeedTaggingItem {...innerProps}>
        <img width="50vw" className={className} src={src} />
      </SpeedTaggingItem>
    );
  }

  return (
    <Link to={`/show/${props.medium.id}`}>
      <img width="50vw" className={className} src={src} />
    </Link>
  );
};

export { ProgressiveThumbnail };
