import React, { useState, useEffect } from "react";
import { Api } from "../api/api";
import { Rating } from "../api/show";
import { BeevenueSpinner } from "./beevenueSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

interface MissingTagsProps {
  id: number;
  tags: string[];
  rating: Rating;
}

const MissingTags = (props: MissingTagsProps) => {
  const [missing, setMissing] = useState<string[] | null>(null);

  useEffect(() => {
    setMissing(null);
    Api.Tags.getMissing(props.id).then(
      res => {
        setMissing(res.data[`${props.id}`]);
      },
      err => {
        console.error(err);
      }
    );
  }, [props.id, props.tags, props.rating]);

  let inner = null;
  if (missing === null) {
    inner = <BeevenueSpinner />;
  } else if (missing.length === 0) {
    inner = (
      <FontAwesomeIcon
        title="Tags are consistent!"
        size="2x"
        icon={faCheck}
        color="green"
      />
    );
  } else {
    inner = missing.map((m, idx) => (
      <div className="beevenue-missing-tag" key={`missing-${idx}`}>
        <span>
          <FontAwesomeIcon
            title="Tags are inconsistent"
            size="2x"
            icon={faTimes}
            color="red"
          />
        </span>
        &nbsp;
        <span>{m}</span>
      </div>
    ));
  }

  return (
    <div className="card">
      <div className="card-content">
        <div className="content beevenue-missing-tags">{inner}</div>
      </div>
    </div>
  );
};

export { MissingTags };
