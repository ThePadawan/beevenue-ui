import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router";

import TagsInput from "react-tagsinput";

import { Api } from "../api/api";
import { ShowViewModel, Rating } from "../api/show";
import { BeevenuePage } from "./beevenuePage";
import { Medium } from "../fragments/medium";
import { useDispatch } from "react-redux";
import {
  addNotification,
  addNotLoggedInNotification,
  redirect
} from "../redux/actions";
import pick from "lodash-es/pick";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";
import { MediumDeleteButton } from "../fragments/MediumDeleteButton";
import { MissingTags } from "../fragments/missingTags";

import { RegenerateThumbnailButton } from "../fragments/RegenerateThumbnailButton";
import { Link } from "react-router-dom";
import { PickAlternateThumbnailWidget } from "../fragments/pickAlternateThumbnailWidget";
import { useBeevenueSelector, useIsSessionSfw } from "../redux/selectors";

interface ShowPageParams {
  id: string;
}

const FullRating = (r: Rating): string => {
  const dict = {
    u: "Unknown",
    s: "Safe",
    q: "Questionable",
    e: "Explicit"
  };

  return dict[r];
};

const ShowPage = () => {
  const [viewModel, setViewModel] = useState<ShowViewModel | null>(null);

  const isSessionSfw = useIsSessionSfw();
  const loggedInRole = useBeevenueSelector(store => store.login.loggedInRole);

  const match = useRouteMatch<ShowPageParams>();
  const id = parseInt(match.params.id, 10);

  const dispatch = useDispatch();

  useEffect(() => {
    // TODO Inelegant - REST response to updateMedium could already
    // contain this information so we save one round trip.
    Api.show(id).then(
      res => {
        setViewModel(res.data as ShowViewModel);
      },
      err => {
        if (err.response.status === 401) {
          dispatch(addNotLoggedInNotification());
        }

        dispatch(redirect("/"));
      }
    );
  }, [dispatch, id, isSessionSfw]);

  const getUserIsAdmin = () => {
    return loggedInRole === "admin";
  };

  useEffect(() => {
    if (isSessionSfw && viewModel !== null) {
      if (viewModel.rating !== "s") {
        dispatch(redirect("/"));
      }
    }
  }, [isSessionSfw, viewModel, dispatch]);

  const deleteMedium = () => {
    Api.deleteMedium(id).then(
      res => {
        dispatch(
          addNotification({
            level: "info",
            contents: ["Successfully deleted medium."]
          })
        );
        dispatch(redirect("/"));
      },
      err => {
        dispatch(
          addNotification({
            level: "error",
            contents: ["Could not delete medium!"]
          })
        );
        dispatch(redirect("/"));
      }
    );
  };

  const renderTags = (viewModel: ShowViewModel) => {
    if (!viewModel.tags) {
      return null;
    }

    const renderLayout = (tagComponents: any, inputComponent: any) => {
      return (
        <>
          {tagComponents}
          {getUserIsAdmin() ? inputComponent : null}
        </>
      );
    };

    const renderTag = (props: any) => {
      const {
        tag,
        key,
        disabled,
        onRemove,
        classNameRemove,
        getTagDisplayValue,
        ...other
      } = props;

      const displayValue = getTagDisplayValue(tag);

      const linkTarget = disabled
        ? `/search/${displayValue}`
        : `/tag/${displayValue}`;

      return (
        <div className="control" key={key}>
          <div {...other}>
            <Link to={linkTarget}>
              <span className="tag">{displayValue}</span>
            </Link>
            {!disabled && (
              <a className="tag is-delete" onClick={e => onRemove(key)} />
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Tags</p>
        </header>
        <div className="card-content">
          <div className="content">
            <TagsInput
              value={viewModel.tags}
              disabled={getUserIsAdmin() ? undefined : true}
              className="tagsinput field is-grouped is-grouped-multiline input"
              tagProps={{ className: "tags has-addons" }}
              renderTag={renderTag}
              renderLayout={renderLayout}
              onlyUnique={true}
              addKeys={[9, 13, 32, 188]} // Tab, Enter, Space, Comma
              onChange={(e: any) => onTagsChange(e)}
            />
          </div>
        </div>
      </div>
    );
  };

  const updateMedium = (newViewModel: ShowViewModel) => {
    const params = pick(newViewModel, ["id", "tags", "rating"]);
    return Api.updateMedium(params).then(res => {
      setViewModel(newViewModel);
      return res;
    });
  };

  const onTagsChange = (newTags: string[]) => {
    // Technically, the user can't manually enter these characters.
    // However, by pasting them, they can still occur in here.
    const cleanTags = newTags.map(unclean => {
      return unclean.replace(/[\t\r\n ]/g, "");
    });

    const newViewModel = { ...viewModel } as ShowViewModel;
    newViewModel.tags = cleanTags;
    updateMedium(newViewModel);
  };

  const onRatingChange = (value: string) => {
    const newRating = value as Rating;
    if (!newRating) return;

    const newViewModel = { ...viewModel } as ShowViewModel;
    newViewModel.rating = newRating;
    updateMedium(newViewModel);
  };

  const renderRating = (viewModel: ShowViewModel): JSX.Element | null => {
    if (!viewModel.rating) {
      return null;
    }

    const ratingElementFor = (r: Rating): JSX.Element => {
      const fullRating = FullRating(r);
      const id = `currentRating${fullRating}`;
      return (
        <div className="beevenue-rating" key={id}>
          <input
            className="is-checkradio"
            type="radio"
            disabled={getUserIsAdmin() ? undefined : true}
            checked={viewModel.rating === r}
            name="currentRating"
            onChange={e => onRatingChange(e.target.value)}
            value={r}
            id={id}
          />
          <label htmlFor={id}>{fullRating}</label>
        </div>
      );
    };

    const ratings: Rating[] = ["s", "q", "e"];

    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Rating</p>
        </header>
        <div className="card-content">
          <div className="content">
            <div className="field beevenue-ratings">
              {ratings.map(ratingElementFor)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  let view;

  if (viewModel !== null) {
    view = (
      <>
        <Medium {...viewModel} />
        {renderTags(viewModel)}
        {renderRating(viewModel)}
        {getUserIsAdmin() ? (
          <>
            <MissingTags {...viewModel} />
            <MediumDeleteButton onConfirm={() => deleteMedium()} />
            <RegenerateThumbnailButton mediumId={id} />
            <PickAlternateThumbnailWidget {...viewModel} />
          </>
        ) : null}
      </>
    );
  } else {
    view = <BeevenueSpinner />;
  }

  return (
    <BeevenuePage>
      <div className="beevenue-show-page">{view}</div>
    </BeevenuePage>
  );
};

export { ShowPage };
export default ShowPage;
