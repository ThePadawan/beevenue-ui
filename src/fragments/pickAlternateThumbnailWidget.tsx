import React, { useState } from "react";
import { Api } from "../api/api";
import { BeevenueSpinner } from "./beevenueSpinner";
import { ShowViewModel } from "../api/show";

const PickAlternateThumbnailWidget = (props: ShowViewModel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pickCount, setPickCount] = useState(5);
  const [picks, setPicks] = useState<string[] | null>(null);

  const onChange = (e: any) => {
    setPickCount(Number(e));
  };

  const onClick = () => {
    startLoading();
    Api.Medium.generateThumbnailPicks(props.id, pickCount).then(success => {
      setIsLoading(false);
      setPicks(success.data.thumbs);
    });
  };

  const startLoading = () => {
    setIsLoading(true);
  };

  const choosePick = (i: number) => {
    if (!picks) {
      return;
    }

    startLoading();
    Api.Medium.selectThumbnailPick(props.id, i, picks.length).then(success => {
      setIsLoading(false);
      setPicks(null);
    });
  };

  const renderPicks = () => {
    if (!picks) {
      return null;
    }

    return (
      <div className="beevenue-picks">
        {picks.map((p: any, i: number) => {
          return (
            <img
              key={`pick${i}`}
              onClick={_ => choosePick(i)}
              src={`data:image/png;base64, ${p}`}
            />
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <BeevenueSpinner />;
    }

    return (
      <>
        <div>
          Generate&nbsp;
          <div className="select">
            <select
              defaultValue="5"
              value={pickCount}
              onChange={e => onChange(e.currentTarget.value)}
            >
              <option>3</option>
              <option>5</option>
              <option>10</option>
            </select>
          </div>
          &nbsp;new thumbnails:&nbsp;
          <button className="button is-primary" onClick={e => onClick()}>
            Go
          </button>
        </div>
        <div>{renderPicks()}</div>
      </>
    );
  };

  if (!/^video/.test(props.mime_type)) {
    return null;
  }

  return (
    <div className="card beevenue-sidebar-card">
      <header className="card-header">
        <p className="card-header-title">Pick alternate thumbnail</p>
      </header>
      <div className="card-content">
        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
};

export { PickAlternateThumbnailWidget };
