import React, { useState, useEffect } from "react";

import { Api } from "../api/api";
import sortBy from "lodash-es/sortBy";
import { Link } from "react-router-dom";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { TagRatingControl } from "../fragments/tag/tagRatingControl";
import { BeevenuePage } from "./beevenuePage";
import { Tag } from "../tag";
import { useBeevenueSelector, useIsSessionSfw } from "../redux/selectors";

const TagsPage = () => {
  const loggedInRole = useBeevenueSelector(store => store.login.loggedInRole);
  const isSessionSfw = useIsSessionSfw();

  const [tags, setTags] = useState<Tag[]>([]);
  const [filter, setFilter] = useState<string>("");

  const loadTags = () => {
    Api.Tags.getStatistics().then(
      res => {
        let tags = res.data;
        tags = sortBy(tags, t => t.mediaCount).reverse();
        setTags(tags);
      },
      err => {
        console.error(err);
      }
    );
  };

  useEffect(() => {
    loadTags();
  }, [loggedInRole, isSessionSfw]);

  const getFilteredTags = () => {
    try {
      const regex = new RegExp(filter);
      return tags.filter(t => regex.test(t.tag));
    } catch {
      return tags;
    }
  };

  const renderContent = () => {
    return (
      <>
        <div className="content beevenue-tags-filter">
          <input
            className="input"
            type="text"
            placeholder="Filter"
            value={filter}
            onChange={e => setFilter(e.currentTarget.value)}
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
            <tbody>{getFilteredTags().map(renderTag)}</tbody>
          </table>
          <div className="is-hidden-tablet">
            {getFilteredTags().map(renderTagMobile)}
          </div>
        </div>
      </>
    );
  };

  const isAdmin = () => {
    return loggedInRole === "admin";
  };

  const tagLink = (t: Tag) => {
    let url = `/search/${t.tag}`;
    if (isAdmin()) {
      url = `/tag/${t.tag}`;
    }

    return <Link to={url}>{t.tag}</Link>;
  };

  const renderTag = (t: Tag): JSX.Element => {
    const ratingCell = isAdmin() ? (
      <TagRatingControl tag={t} prefix="large" />
    ) : (
      <p>{t.rating}</p>
    );

    return (
      <tr key={t.tag}>
        <td>{tagLink(t)}</td>
        <td>{maybeRenderTooltip(t)}</td>
        <td>{ratingCell}</td>
        <td className="has-text-centered">{t.mediaCount}</td>
      </tr>
    );
  };

  const renderTagMobile = (t: Tag): JSX.Element => {
    return (
      <nav className="level" key={t.tag}>
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">
              {tagLink(t)}
              {maybeRenderTooltip(t)}
            </p>
          </header>
          <div className="card-content">
            <p className="subtitle">Used {t.mediaCount} times</p>
            {isAdmin() ? (
              <TagRatingControl tag={t} prefix="small" />
            ) : (
              <p>{t.rating}</p>
            )}
          </div>
        </div>
      </nav>
    );
  };

  const maybeRenderTooltip = (t: Tag): React.ReactNode => {
    if (t.mediaCount === 0 && t.implyingThisCount > 0) {
      const title =
        "This tag is not used on any media, but implied by other tags." +
        " It will stay in this list.";

      return <FontAwesomeIcon icon={faQuestionCircle} title={title} />;
    }

    return null;
  };

  const content = tags.length > 0 ? renderContent() : <BeevenueSpinner />;

  return <BeevenuePage>{content}</BeevenuePage>;
};

export { TagsPage };
export default TagsPage;
