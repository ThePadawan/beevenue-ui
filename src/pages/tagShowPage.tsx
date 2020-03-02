import React, { useState, useEffect } from "react";

import { Api } from "../api/api";
import { useLoginRequired } from "./loginRequired";
import { Link, useRouteMatch } from "react-router-dom";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { ImplicationsCard } from "../fragments/tag/implicationsCard";
import { EditableTitleField } from "../fragments/tag/editableTitleField";
import { BeevenuePage } from "./beevenuePage";
import TagShowPageAliasCard from "../fragments/tag/tagShowPageAliasCard";

export interface ShowTagViewModel {
  aliases: string[];
  count: number;

  implied_by_this: string[];
  implying_this: string[];
}

interface TagShowPageParams {
  name: string;
}

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

  const onAliasAdded = (a: string): void => {
    const newAliases = tag!.aliases.slice();
    newAliases.push(a);
    tag!.aliases = newAliases;

    setTag(tag);
  };

  const onAliasRemoved = (a: string): void => {
    const newAliases = tag!.aliases.slice();
    const maybeIdx = newAliases.indexOf(a);
    if (maybeIdx > -1) {
      newAliases.splice(maybeIdx, 1);
    }

    tag!.aliases = newAliases;
    setTag(tag);
  };

  useInitialTagLoad(tagName, setTag, setTagNotFound);

  return { tag, tagName, onAliasRemoved, onAliasAdded, tagNotFound };
};

const TagShowPage = () => {
  const { tag, tagName, onAliasRemoved, onAliasAdded, tagNotFound } = useTag();

  useLoginRequired();

  const subtitle = () => {
    if (tagNotFound || !tag) {
      return null;
    }
    return <h3 className="subtitle is-5">Used {tag.count} times</h3>;
  };

  let inner = null;
  if (!tag) {
    inner = <BeevenueSpinner />;
  } else if (tagNotFound) {
    inner = <div>No such tag</div>;
  } else {
    inner = (
      <>
        <TagShowPageAliasCard
          tag={tag}
          tagName={tagName}
          onAliasAdded={onAliasAdded}
          onAliasRemoved={onAliasRemoved}
        />
        <ImplicationsCard tag={tag} tagName={tagName} />
      </>
    );
  }

  return (
    <BeevenuePage>
      <h3 className="title is-2">
        <EditableTitleField initialTitle={tagName} />
        <Link to={`/search/${tagName}`} className="beevenue-h2-link">
          <FontAwesomeIcon icon={faSearch} />
        </Link>
      </h3>
      {subtitle()}
      {inner}
    </BeevenuePage>
  );
};

export { TagShowPage };
export default TagShowPage;
