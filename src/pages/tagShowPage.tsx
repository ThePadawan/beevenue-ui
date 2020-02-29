import React, { Fragment, useState, useEffect } from "react";

import { Api } from "../api/api";
import { useLoginRequired } from "./loginRequired";
import { Link, useRouteMatch } from "react-router-dom";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { AddAliasField } from "../fragments/tag/addAliasField";
import { ImplicationsCard } from "../fragments/tag/implicationsCard";
import { EditableTitleField } from "../fragments/tag/editableTitleField";
import { redirect } from "../redux/actions";
import { BeevenuePage } from "./beevenuePage";
import { useDispatch } from "react-redux";

interface ShowTagViewModel {
  aliases: string[];
  count: number;

  implied_by_this: string[];
  implying_this: string[];
}

interface TagShowPageParams {
  name: string;
}

const TagShowPage = () => {
  const dispatch = useDispatch();
  const match = useRouteMatch<TagShowPageParams>();

  const [tag, setTag] = useState<ShowTagViewModel | null>(null);
  const [tagNotFound, setTagNotFound] = useState(false);

  const tagName = match.params.name;

  useLoginRequired();

  useEffect(() => {
    Api.Tags.show(tagName).then(
      res => {
        setTag(res.data);
      },
      err => {
        setTagNotFound(true);
      }
    );
  }, [tagName]);

  const onAliasAdded = (a: string): void => {
    if (!tag) return;

    // Signal React to behave
    const newAliases = tag.aliases.slice();
    newAliases.push(a);
    tag.aliases = newAliases;

    setTag(tag);
  };

  const onAliasRemoved = (a: string): void => {
    if (!tag) return;

    // Signal React to behave
    const newAliases = tag.aliases.slice();

    const maybeIdx = newAliases.indexOf(a);
    if (maybeIdx > -1) {
      newAliases.splice(maybeIdx, 1);
    }

    tag.aliases = newAliases;
    setTag(tag);
  };

  const removeAlias = (a: string): void => {
    Api.Tags.removeAlias(tagName, a).then(_ => {
      onAliasRemoved(a);
    });
  };

  const getInnerContent = () => {
    if (tagNotFound) {
      return <div>No such tag</div>;
    }

    if (!tag) return <BeevenueSpinner />;

    type CardGetter = (vm: ShowTagViewModel) => JSX.Element | null;

    const cardGetters: CardGetter[] = [getAliasesCard, getImplicationsCard];

    const wrapper = (x: CardGetter, idx: number) => {
      if (!tag) {
        return null;
      }

      return (
        <nav className="level" key={idx}>
          <div className="level-item">{x(tag)}</div>
        </nav>
      );
    };

    return <>{cardGetters.map(wrapper)}</>;
  };
  const getAliasesCard = (tag: ShowTagViewModel): JSX.Element | null => {
    const getCurrentAliases = () => {
      if (tag.aliases.length === 0) return null;
      return (
        <ul>
          {tag.aliases.sort().map(a => (
            <Fragment key={a}>
              <li>
                {a}
                <a
                  className="beevenue-alias-delete delete is-small"
                  onClick={e => removeAlias(a)}
                />
              </li>
            </Fragment>
          ))}
        </ul>
      );
    };

    return (
      <div className="card beevenue-sidebar-card">
        <header className="card-header">
          <p className="card-header-title">Aliases</p>
        </header>
        <div className="card-content">
          <div className="content">
            {getCurrentAliases()}
            <AddAliasField tag={tagName} onAliasAdded={a => onAliasAdded(a)} />
          </div>
        </div>
      </div>
    );
  };

  const getImplicationsCard = (tag: ShowTagViewModel): JSX.Element | null => {
    if (!tag) return null;
    return <ImplicationsCard tag={tag} tagName={tagName} />;
  };

  const onTitleChanged = (newTitle: string): void => {
    dispatch(redirect(`/tag/${newTitle}`, true));
  };

  const subtitle = () => {
    if (tagNotFound || !tag) {
      return null;
    }

    return <h3 className="subtitle is-5">Used {tag.count} times</h3>;
  };

  return (
    <BeevenuePage>
      <h3 className="title is-2">
        <EditableTitleField
          initialTitle={tagName}
          onTitleChanged={t => onTitleChanged(t)}
        />
        <Link to={`/search/${tagName}`} className="beevenue-h2-link">
          <FontAwesomeIcon icon={faSearch} />
        </Link>
      </h3>
      {subtitle()}
      {getInnerContent()}
    </BeevenuePage>
  );
};

export { TagShowPage };
export default TagShowPage;
