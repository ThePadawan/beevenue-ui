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
import { BeevenuePage } from "./beevenuePage";

interface ShowTagViewModel {
  aliases: string[];
  count: number;

  implied_by_this: string[];
  implying_this: string[];
}

interface TagShowPageParams {
  name: string;
}

const getAliasHandlers = (
  tag: ShowTagViewModel,
  setTag: (m: ShowTagViewModel) => void
) => {
  const onAliasAdded = (a: string): void => {
    const newAliases = tag.aliases.slice();
    newAliases.push(a);
    tag.aliases = newAliases;

    setTag(tag);
  };

  const onAliasRemoved = (a: string): void => {
    const newAliases = tag.aliases.slice();
    const maybeIdx = newAliases.indexOf(a);
    if (maybeIdx > -1) {
      newAliases.splice(maybeIdx, 1);
    }

    tag.aliases = newAliases;
    setTag(tag);
  };

  return { onAliasAdded, onAliasRemoved };
};

const useInitialTagLoad = (
  tagName: string,
  setTag: (m: ShowTagViewModel) => void,
  setTagNotFound: (b: boolean) => void
) => {
  useEffect(() => {
    Api.Tags.show(tagName).then(
      res => {
        setTag(res.data);
      },
      err => {
        setTagNotFound(true);
      }
    );
  }, [tagName, setTag, setTagNotFound]);
};

const useTag = () => {
  const match = useRouteMatch<TagShowPageParams>();
  const tagName = match.params.name;
  const [tag, setTag] = useState<ShowTagViewModel | null>(null);
  const [tagNotFound, setTagNotFound] = useState(false);
  const { onAliasAdded, onAliasRemoved } = getAliasHandlers(tag!, setTag);

  useInitialTagLoad(tagName, setTag, setTagNotFound);

  const removeAlias = (a: string): void => {
    Api.Tags.removeAlias(tagName, a).then(_ => {
      onAliasRemoved(a);
    });
  };

  return { tag, tagName, removeAlias, onAliasAdded, tagNotFound };
};

const TagShowPage = () => {
  const { tag, tagName, removeAlias, onAliasAdded, tagNotFound } = useTag();

  useLoginRequired();

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

  const subtitle = () => {
    if (tagNotFound || !tag) {
      return null;
    }
    return <h3 className="subtitle is-5">Used {tag.count} times</h3>;
  };

  return (
    <BeevenuePage>
      <h3 className="title is-2">
        <EditableTitleField initialTitle={tagName} />
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
