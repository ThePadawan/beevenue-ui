import React, { Component } from "react";
import { connect } from "react-redux";

import { Api } from "../api/api";
import sortBy from "lodash-es/sortBy";
import { Link } from "react-router-dom";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { TagRatingControl } from "../fragments/tag/tagRatingControl";
import { BeevenuePage, BeevenuePageProps } from "./beevenuePage";
import { getLoggedInRole, isSessionSfw } from "../redux/reducers/login";
import { Rating } from "../api/show";

interface Tag {
  rating: Rating;
  tag: string;
  impliedByThisCount: number;
  implyingThisCount: number;
  mediaCount: number;
}

interface TagsPageProps extends BeevenuePageProps {
  isSessionSfw: boolean;
  loggedInRole: string | null;
}

interface TagsPageState {
  tags: Tag[];
  filter: string;
}

class TagsPage extends Component<TagsPageProps, TagsPageState, any> {
  public constructor(props: any) {
    super(props);
    this.state = { tags: [], filter: "" };
  }

  public componentDidMount = () => {
    this.loadTags();
  };

  public componentDidUpdate = (prevProps: TagsPageProps, _: any) => {
    if (
      this.props.loggedInRole !== "admin" &&
      prevProps.isSessionSfw !== this.props.isSessionSfw
    ) {
      this.loadTags();
    }
  };

  private loadTags = () => {
    Api.Tags.getStatistics().then(
      res => {
        let tags = res.data;
        tags = sortBy(tags, t => t.mediaCount).reverse();
        this.setState({ ...this.state, tags: tags });
      },
      err => {
        console.error(err);
      }
    );
  };

  private filteredTags = () => {
    try {
      const regex = new RegExp(this.state.filter);
      return this.state.tags.filter(t => regex.test(t.tag));
    } catch {
      return this.state.tags;
    }
  };

  private onChange(filter: string) {
    this.setState({ ...this.state, filter });
  }

  private renderContent = () => {
    return (
      <>
        <div className="content beevenue-tags-filter">
          <input
            className="input"
            type="text"
            placeholder="Filter"
            value={this.state.filter}
            onChange={e => this.onChange(e.currentTarget.value)}
          />
        </div>
        <div>
          <table className="table is-hidden-mobile is-striped is-narrow is-hoverable">
            <thead>
              <tr>
                <th>Tag</th>
                <th />
                <th>Rating</th>
                <th>Media</th>
              </tr>
            </thead>
            <tbody>{this.filteredTags().map(this.renderTag)}</tbody>
          </table>
          <div className="is-hidden-tablet">
            {this.filteredTags().map(this.renderTagMobile)}
          </div>
        </div>
      </>
    );
  };

  private isAdmin = () => {
    return this.props.loggedInRole === "admin";
  };

  private tagLink = (t: Tag) => {
    let url = `/search/${t.tag}`;
    if (this.isAdmin()) {
      url = `/tag/${t.tag}`;
    }

    return <Link to={url}>{t.tag}</Link>;
  };

  private renderTag = (t: Tag): JSX.Element => {
    const ratingCell = this.isAdmin() ? (
      <TagRatingControl tag={t} prefix="large" />
    ) : (
      <p>{t.rating}</p>
    );

    return (
      <tr key={t.tag}>
        <td>{this.tagLink(t)}</td>
        <td>{this.maybeRenderTooltip(t)}</td>
        <td>{ratingCell}</td>
        <td className="has-text-centered">{t.mediaCount}</td>
      </tr>
    );
  };

  private renderTagMobile = (t: Tag): JSX.Element => {
    return (
      <nav className="level" key={t.tag}>
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">
              {this.tagLink(t)}
              {this.maybeRenderTooltip(t)}
            </p>
          </header>
          <div className="card-content">
            <p className="subtitle">Used {t.mediaCount} times</p>
            {this.isAdmin() ? (
              <TagRatingControl tag={t} prefix="small" />
            ) : (
              <p>{t.rating}</p>
            )}
          </div>
        </div>
      </nav>
    );
  };

  private maybeRenderTooltip = (t: Tag): React.ReactNode => {
    if (t.mediaCount === 0 && t.implyingThisCount > 0) {
      const title =
        "This tag is not used on any media, but implied by other tags." +
        " It will stay in this list.";

      return <FontAwesomeIcon icon={faQuestionCircle} title={title} />;
    }

    return null;
  };

  render() {
    const content =
      this.state.tags.length > 0 ? this.renderContent() : <BeevenueSpinner />;

    return <BeevenuePage {...this.props}>{content}</BeevenuePage>;
  }
}

const mapStateToProps = (state: any): TagsPageProps => {
  return {
    ...state,
    loggedInRole: getLoggedInRole(state.login),
    isSessionSfw: isSessionSfw(state.login)
  };
};

const x = connect(mapStateToProps, null)(TagsPage);
export { x as TagsPage };
