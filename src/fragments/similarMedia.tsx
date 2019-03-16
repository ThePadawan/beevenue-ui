import React, { Component } from "react";
import { PartialShowViewModel } from "../api/show";
import { Link } from "react-router-dom";

import { backendUrl } from "../config.json";

interface SimilarMediaProps {
  media: PartialShowViewModel[];
}

class SimilarMedia extends Component<SimilarMediaProps, any, any> {
  public constructor(props: SimilarMediaProps) {
    super(props);
  }
  render() {
    const thumbs = (r: PartialShowViewModel) => {
      return (
        <picture>
          <source
            srcSet={`${backendUrl}${r.thumbs[600]}`}
            media="(min-width: 769px)"
          />
          <img src={`${backendUrl}${r.thumbs[240]}`} />
        </picture>
      );
    };

    return (
      <div className="beevenue-similar-media">
        {this.props.media.map(s => (
          <div className="beevenue-similar-medium" key={s.id}>
            <Link to={`/show/${s.id}`}>{thumbs(s)}</Link>
          </div>
        ))}
      </div>
    );
  }
}

export { SimilarMedia };
