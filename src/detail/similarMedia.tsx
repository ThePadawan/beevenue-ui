import React from "react";
import { PartialShowViewModel } from "../api/show";
import { Link } from "react-router-dom";

import { backendUrl } from "../config.json";

interface SimilarMediaProps {
  media: PartialShowViewModel[];
}

const SimilarMedia = (props: SimilarMediaProps) => {
  return (
    <div className="beevenue-similar-media">
      {props.media.map(s => (
        <div className="beevenue-similar-medium" key={s.id}>
          <Link to={`/show/${s.id}`}>
            <img src={`${backendUrl}/thumbs/${s.id}`} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export { SimilarMedia };
