import React, { useState, useEffect, useMemo } from "react";

import { Api } from "api";
import sortBy from "lodash-es/sortBy";
import { Link } from "react-router-dom";
import { BeevenueSpinner } from "../beevenueSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { useBeevenueSelector, useIsSessionSfw } from "../redux/selectors";

interface SimpleTag {
  impliedBySomething: boolean;
  mediaCount: number;
  rating: string;
  tag: string;
}

const useSetup = () => {
  const loggedInRole = useBeevenueSelector((store) => store.login.loggedInRole);
  const isSessionSfw = useIsSessionSfw();
  const [tags, setTags] = useState<SimpleTag[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    Api.Tags.getSummary().then(
      (res) => {
        let tags: SimpleTag[] = res.data.tags;
        tags = sortBy(tags, (t) => t.mediaCount).reverse();
        setTags(tags);
      },
      (err) => {
        console.error(err);
      }
    );
  }, [loggedInRole, isSessionSfw]);

  return {
    loggedInRole,
    filter,
    setFilter,
    tags,
  };
};

const maybeRenderTooltip = (t: SimpleTag): React.ReactNode => {
  if (t.mediaCount === 0 && t.impliedBySomething) {
    const title =
      "This tag is not used on any media, but implied by other tags." +
      " It will stay in this list.";

    return <FontAwesomeIcon icon={faQuestionCircle} title={title} />;
  }

  return null;
};

const tagLink = (t: SimpleTag, isAdmin: boolean) => {
  let url = `/search/${t.tag}`;
  if (isAdmin) {
    url = `/tag/${t.tag}`;
  }

  return <Link to={url}>{t.tag}</Link>;
};

const onRatingChange = (
  tag: string,
  el: HTMLInputElement,
  newRating: string
): void => {
  Api.Tags.patch(tag, { rating: newRating }); // Ignore result because we don't really care.
  el.closest("tr")?.removeAttribute("class");
};

const tagRatingControl = (prefix: string, t: SimpleTag): JSX.Element => {
  const name = `${prefix}-tag-${t.tag}`;

  const ratingElement = (rating: string) => {
    const id = `${name}-rating-${rating}`;
    return (
      <div className="beevenue-tag-rating" key={id}>
        <input
          className="is-checkradio"
          type="radio"
          defaultChecked={t.rating === rating}
          name={name}
          onChange={(e) => onRatingChange(t.tag, e.target, e.target.value)}
          value={rating}
          id={id}
        />
        <label htmlFor={id}>{rating}</label>
      </div>
    );
  };

  return <>{["s", "q", "e"].map(ratingElement)}</>;
};

const renderTag = (t: SimpleTag, isAdmin: boolean): JSX.Element => {
  const ratingCell = isAdmin ? tagRatingControl("large", t) : <p>{t.rating}</p>;

  return (
    <tr key={t.tag} className={t.rating === "u" ? "is-error" : undefined}>
      <td>{tagLink(t, isAdmin)}</td>
      <td>{maybeRenderTooltip(t)}</td>
      <td>{ratingCell}</td>
      <td className="has-text-centered">{t.mediaCount}</td>
    </tr>
  );
};

const renderTagMobile = (t: SimpleTag, isAdmin: boolean): JSX.Element => {
  const classNames = ["card"];
  if (t.rating === "u") classNames.push("beevenue-tag-missing-rating");

  return (
    <nav className="level" key={t.tag}>
      <div className={classNames.join(" ")}>
        <header className="card-header">
          <p className="card-header-title">
            {tagLink(t, isAdmin)}
            {maybeRenderTooltip(t)}
          </p>
        </header>
        <div className="card-content">
          <p className="subtitle">Used {t.mediaCount} times</p>
          {isAdmin ? tagRatingControl("small", t) : <p>{t.rating}</p>}
        </div>
      </div>
    </nav>
  );
};

const renderFilter = (filter: string, setFilter: (s: string) => void) => {
  return (
    <div className="content beevenue-tags-filter">
      <input
        className="input"
        type="text"
        placeholder="Filter"
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
      />
    </div>
  );
};

const renderTable = (filteredTags: SimpleTag[], isAdmin: boolean) => {
  return (
    <div>
      <table className="beevenue-table table is-hidden-mobile is-striped is-narrow is-hoverable">
        <thead>
          <tr>
            <th>Tag</th>
            <th />
            <th>Rating</th>
            <th>Media</th>
          </tr>
        </thead>
        <tbody>{filteredTags.map((t) => renderTag(t, isAdmin))}</tbody>
      </table>
      <div className="is-hidden-tablet">
        {filteredTags.map((t) => renderTagMobile(t, isAdmin))}
      </div>
    </div>
  );
};

const getFilteredTags = (tags: SimpleTag[], filter: string): SimpleTag[] => {
  try {
    const regex = new RegExp(filter);
    return tags.filter((t) => regex.test(t.tag));
  } catch {
    return tags;
  }
};

const TagsPage = () => {
  const { loggedInRole, filter, setFilter, tags } = useSetup();
  const isAdmin = loggedInRole === "admin";

  const filteredTags = useMemo(() => getFilteredTags(tags, filter), [
    tags,
    filter,
  ]);

  const renderContent = () => {
    return (
      <>
        {renderFilter(filter, setFilter)}
        {renderTable(filteredTags, isAdmin)}
      </>
    );
  };

  const content = tags.length > 0 ? renderContent() : <BeevenueSpinner />;
  return content;
};

export { TagsPage };
export default TagsPage;
