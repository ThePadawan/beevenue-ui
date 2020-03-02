import React, { useState } from "react";
import { AddAliasField } from "./addAliasField";
import { Api } from "../../api/api";
import { ShowTagViewModel } from "../../pages/tagShowPage";

interface TagShowPageAliasCardProps {
  tag: ShowTagViewModel;
  tagName: string;

  onAliasRemoved: (a: string) => void;
  onAliasAdded: (a: string) => void;
}

const removeAlias = (
  tagName: string,
  a: string,
  setAliases: (f: (aliases: string[]) => string[]) => void,
  onAliasRemoved: (a: string) => void
): void => {
  setAliases(x => {
    const indexOfAliasToRemove = x.indexOf(a);
    x.splice(indexOfAliasToRemove);
    return x.slice();
  });

  Api.Tags.removeAlias(tagName, a).then(_ => {
    onAliasRemoved(a);
  });
};

const onAliasAdded = (
  parentOnAliasAdded: (a: string) => void,
  setAliases: (f: (aliases: string[]) => string[]) => void,
  a: string
) => {
  setAliases(x => [...x, a]);
  parentOnAliasAdded(a);
};

const useAliases = (props: TagShowPageAliasCardProps) => {
  const [aliases, setAliases] = useState<string[]>(props.tag.aliases);
  const currentAliases =
    aliases.length === 0 ? null : (
      <ul>
        {aliases.sort().map(a => (
          <li key={a}>
            {a}
            <a
              className="beevenue-alias-delete delete is-small"
              onClick={e =>
                removeAlias(props.tagName, a, setAliases, props.onAliasRemoved)
              }
            />
          </li>
        ))}
      </ul>
    );

  return { currentAliases, setAliases };
};

const TagShowPageAliasCard = (props: TagShowPageAliasCardProps) => {
  const { currentAliases, setAliases } = useAliases(props);

  const aliasesCard = (
    <div className="card beevenue-sidebar-card">
      <header className="card-header">
        <p className="card-header-title">Aliases</p>
      </header>
      <div className="card-content">
        <div className="content">
          {currentAliases}
          <AddAliasField
            tag={props.tagName}
            onAliasAdded={a => onAliasAdded(props.onAliasAdded, setAliases, a)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <nav className="level">
      <div className="level-item">{aliasesCard}</div>
    </nav>
  );
};

export { TagShowPageAliasCard };
export default TagShowPageAliasCard;
