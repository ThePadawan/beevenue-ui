import React, { useState, useEffect, useMemo } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";

import { Api } from "api";
import { useLoginRequired } from "../routing/loginRequired";
import { BeevenueSpinner } from "../beevenueSpinner";

import { ImplicationsCard } from "./implicationsCard";
import { EditableTitleField } from "./editableTitleField";
import TagDetailPageAliasCard from "./tagShowPageAliasCard";

export interface ShowTagViewModel {
  aliases: string[];
  count: number;

  implied_by_this: string[];
  implying_this: string[];
}

interface TagDetailPageParams {
  name: string;
}

const useInitialTagLoad = (
  tagName: string,
  setTag: (m: ShowTagViewModel) => void,
  setTagNotFound: (b: boolean) => void
) => {
  useEffect(() => {
    Api.Tags.show(tagName).then(
      (res) => {
        setTag(res.data);
      },
      (err) => {
        setTagNotFound(true);
      }
    );
  }, [tagName, setTag, setTagNotFound]);
};

const useTag = () => {
  const match = useRouteMatch<TagDetailPageParams>();
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

const TagDetailPage = () => {
  const { tag, tagName, onAliasRemoved, onAliasAdded, tagNotFound } = useTag();

  useLoginRequired();

  const subtitle = () => {
    if (tagNotFound || !tag) {
      return null;
    }
    return <h3 className="subtitle is-5">Used {tag.count} times</h3>;
  };

  let inner = useMemo(() => {
    if (!tag) {
      return <BeevenueSpinner />;
    } else if (tagNotFound) {
      return <div>No such tag</div>;
    } else {
      return (
        <>
          <TagDetailPageAliasCard
            tag={tag}
            tagName={tagName}
            onAliasAdded={onAliasAdded}
            onAliasRemoved={onAliasRemoved}
          />
          <ImplicationsCard tag={tag} tagName={tagName} />
        </>
      );
    }
  }, [tag, tagName, onAliasAdded, onAliasRemoved, tagNotFound]);

  return (
    <>
      <h3 className="title is-2">
        <EditableTitleField initialTitle={tagName} />
        <Link to={`/search/${tagName}`} className="beevenue-h2-link">
          <FontAwesomeIcon icon={faSearch} />
        </Link>
      </h3>
      {subtitle()}
      {inner}
    </>
  );
};

export { TagDetailPage };
export default TagDetailPage;
