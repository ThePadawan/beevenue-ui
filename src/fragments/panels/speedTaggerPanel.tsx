import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
  toggleSpeedTagging,
  setShouldRefresh,
  clearSpeedTaggingItems
} from "../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { Api } from "../../api/api";
import { useBeevenueSelector } from "../../redux/selectors";

const SpeedTaggerPanel = () => {
  const dispatch = useDispatch();

  const speedTaggingItems = useBeevenueSelector(
    store => store.speedTagging.speedTaggingItems
  );
  const isSpeedTagging = useBeevenueSelector(
    store => store.speedTagging.isSpeedTagging
  );

  const [tags, setTags] = useState("");
  const toggle = () => {
    dispatch(toggleSpeedTagging());
  };

  const go = () => {
    const items = speedTaggingItems;
    if (items.length < 1) {
      return;
    }

    const tagNames = tags.split(" ");
    if (tagNames.length < 1) {
      return;
    }

    Api.Tags.batchAdd(tagNames, items).finally(() => {
      dispatch(clearSpeedTaggingItems());
      dispatch(setShouldRefresh(true));
    });
  };

  const getCardTitle = () => {
    if (speedTaggingItems && speedTaggingItems.length > 0) {
      return `Speed tagger (${speedTaggingItems.length} selected)`;
    }

    return "Speed tagger";
  };

  return (
    <div className="card beevenue-sidebar-card">
      <div className="card-header">
        <p className="card-header-title">{getCardTitle()}</p>
      </div>
      <div className="card-content">
        <div className="content">
          <form>
            <div className="field">
              <input
                className="input"
                type="text"
                placeholder="Tags"
                value={tags}
                onChange={e => setTags(e.currentTarget.value)}
              />
            </div>
            <div className="field">
              <input
                type="checkbox"
                id="speed-tagger-switch"
                name="speed-tagger-switch"
                className="switch"
                defaultChecked={isSpeedTagging}
                onChange={_ => toggle()}
              />
              <label htmlFor="speed-tagger-switch">Mark</label>
            </div>
            <div className="field">
              <a className="button" onClick={_ => go()}>
                <FontAwesomeIcon icon={faCheck} />
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { SpeedTaggerPanel };
