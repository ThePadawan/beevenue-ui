import React, { Component } from "react";
import { PartialShowViewModel } from "../api/show";
import { Link } from "react-router-dom";

import { backendUrl } from "../config.json";

interface SimilarMediaProps
{
  media: PartialShowViewModel[];
}

class SimilarMedia extends Component<SimilarMediaProps, any, any> {
  public constructor(props: SimilarMediaProps) {
    super(props);
  }
  render() {

    const thumbs = (r: PartialShowViewModel) => {
      const sources = []

      for (let size in r.thumbs) {
        const sizePx = parseInt(size)
        let sizeSelector = '1x'
        if (sizePx < 600) {
          sizeSelector = '4x'
        }
        sources.push(
          `${backendUrl}${r.thumbs[size]} ${sizeSelector}`
        )
      }

      const srcset = sources.join(', ')
      return (
        <img
         sizes="(max-width: 768px) 85vw, (min-width: 1600px) 20vw, 35vw"
         srcSet={srcset}
         src={`${backendUrl}${r.thumbs[240]}`} />
      )
    }

    return (
      <div className="beevenue-similar-media">
        {this.props.media.map(s => <div className="beevenue-similar-medium" key={s.id}>
            <Link to={`/show/${s.id}`}>
              {thumbs(s)}
            </Link>
        </div>
        )}
      </div>
    );
  }
}

export { SimilarMedia };
