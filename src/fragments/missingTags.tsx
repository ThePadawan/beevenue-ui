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
    inner = <FontAwesomeIcon icon={faCheck} color="green" />;
  } else {
    inner = (
      <>
        <span>
          <FontAwesomeIcon icon={faTimes} color="red" />
        </span>
        <span>{missing}</span>
      </>
    );
  }

  return (
    <div className="beevenue-missing-tags card">
      <header className="card-header">
        <p className="card-header-title">Consistency</p>
      </header>
      <div className="card-content">
        <div className="content">{inner}</div>
      </div>
    </div>
  );
};

export { MissingTags };
