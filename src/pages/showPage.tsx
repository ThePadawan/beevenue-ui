import React, { Component } from "react";
import { match, Redirect } from "react-router";

import TagsInput from "react-tagsinput";

import { Api } from "../api/api";
import { ShowViewModel, Rating } from "../api/show";
import { BeevenuePage } from "./beevenuePage";
import { Medium } from "../fragments/medium";
import { connect } from "react-redux";
import {
  addNotification,
  addNotLoggedInNotification,
  redirect
} from "../redux/actions";
import { pick } from "lodash-es";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";
import { MediumDeleteButton } from "../fragments/MediumDeleteButton";
import { MissingTags } from "../fragments/missingTags";
import { QuickTagger } from "../fragments/quickTagger";

import { isSessionSfw, getLoggedInRole } from "../redux/reducers/login";
import { RegenerateThumbnailButton } from "../fragments/RegenerateThumbnailButton";
import { Link } from "react-router-dom";

interface UnitializedShowPageState {
  ViewModel: ShowViewModel | null;
}

interface InitializedShowPageState {
  ViewModel: ShowViewModel;
}

type ShowPageState = UnitializedShowPageState | InitializedShowPageState;

interface ShowPageProps {
  isSessionSfw: boolean;
  loggedInRole: string | null;

  match: match<ShowPageParams>;
  addNotification: typeof addNotification;
  addNotLoggedInNotification: typeof addNotLoggedInNotification;
  redirect: typeof redirect;
}

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

class ShowPage extends Component<ShowPageProps, ShowPageState, any> {
  public constructor(props: ShowPageProps) {
    super(props);
    this.state = { ViewModel: null };
  }

  private get mediumId(): number {
    return parseInt(this.props.match.params.id, 10);
  }

  componentDidMount() {
    this.loadMedium(this.mediumId);
  }

  private get userIsAdmin() {
    return this.props.loggedInRole === "admin";
  }

  private loadMedium(mediumId: number) {
    Api.show(mediumId).then(
      res => {
        this.setState({ ViewModel: res.data as ShowViewModel });
      },
      err => {
        if (err.response.status == 401) {
          this.props.addNotLoggedInNotification();
        } else {
          this.props.addNotification(err.response.data);
        }

        this.props.redirect("/");
      }
    );
  }

  componentDidUpdate(oldProps: ShowPageProps, oldState: ShowPageState) {
    if (this.props.isSessionSfw && this.state.ViewModel !== null) {
      if (this.state.ViewModel.rating !== "s") {
        this.props.redirect("/");
        return;
      }
    }

    if (oldProps.isSessionSfw !== this.props.isSessionSfw) {
      if (this.state.ViewModel !== null) {
        this.loadMedium(this.state.ViewModel.id);
      }
    }

    if (oldProps.match.params.id === this.props.match.params.id) return;

    this.loadMedium(parseInt(this.props.match.params.id, 10));
  }

  deleteMedium() {
    Api.deleteMedium(this.mediumId).then(
      res => {
        this.props.addNotification({
          level: "info",
          contents: ["Deletion successful."]
        });
        this.props.redirect("/");
      },
      err => {
        this.props.addNotification({
          level: "error",
          contents: ["Deletion unsuccessful."]
        });
        this.props.redirect("/");
      }
    );
  }

  renderTags(viewModel: ShowViewModel) {
    if (!viewModel.tags) {
      return null;
    }

    const renderLayout = (tagComponents: any, inputComponent: any) => {
      return (
        <>
          {tagComponents}
          {inputComponent}
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
      return (
        <div className="control" key={key}>
          <div {...other}>
            <Link to={`/tag/${getTagDisplayValue(tag)}`}>
              <span className="tag">{getTagDisplayValue(tag)}</span>
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
              disabled={this.userIsAdmin ? undefined : true}
              className="tagsinput field is-grouped is-grouped-multiline input"
              tagProps={{ className: "tags has-addons" }}
              renderTag={renderTag}
              renderLayout={renderLayout}
              onlyUnique={true}
              addKeys={[9, 13, 32, 188]} // Tab, Enter, Space, Comma
              onChange={(e: any) => this.onTagsChange(e)}
            />
          </div>
        </div>
      </div>
    );
  }

  updateMedium(newState: InitializedShowPageState) {
    const params = pick(newState.ViewModel, ["id", "tags", "rating"]);
    return Api.updateMedium(params).then(res => {
      this.setState(newState);
      return res;
    });
  }

  onTagsChange(newTags: string[]) {
    const newState = { ...(this.state as InitializedShowPageState) };
    newState.ViewModel.tags = newTags;
    this.updateMedium(newState).then(res => {
      this.loadMedium(this.mediumId);
    });
  }

  onRatingChange(value: string) {
    const newRating = value as Rating;
    if (!newRating) return;

    const newState = { ...(this.state as InitializedShowPageState) };
    newState.ViewModel.rating = newRating;
    this.updateMedium(newState);
  }

  renderRating(viewModel: ShowViewModel): JSX.Element | null {
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
            disabled={this.userIsAdmin ? undefined : true}
            checked={viewModel.rating === r}
            name="currentRating"
            onChange={e => this.onRatingChange(e.target.value)}
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
  }

  addTag(newTag: string) {
    if (this.state.ViewModel === null) {
      return;
    }
    const newTags = [...this.state.ViewModel.tags, newTag];
    this.onTagsChange(newTags);
  }

  render() {
    let view;
    const viewModel = this.state.ViewModel;

    if (viewModel !== null) {
      view = (
        <>
          <Medium {...viewModel} />
          {this.renderTags(viewModel)}
          {this.renderRating(viewModel)}
          {this.userIsAdmin ? (
            <>
              <MissingTags {...viewModel} />
              <QuickTagger
                tags={viewModel.tags}
                onAddTag={tag => this.addTag(tag)}
              />
              <MediumDeleteButton onConfirm={() => this.deleteMedium()} />
              <RegenerateThumbnailButton mediumId={this.mediumId} />
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
  }
}

const mapStateToProps = (state: any) => {
  return {
    loggedInRole: getLoggedInRole(state.login),
    isSessionSfw: isSessionSfw(state.login)
  };
};

const x = connect(
  mapStateToProps,
  { addNotification, addNotLoggedInNotification, redirect }
)(ShowPage);
export { x as ShowPage };
