import React, { Fragment, useState, useMemo } from "react";
import { Api } from "../../api/api";
import { AddImplicationField } from "./addImplicationField";

type AddOrRemove = "Add" | "Remove";

export interface TagImplicationsViewModel {
  implied_by_this: string[];
  implying_this: string[];
}

interface ImplicationsCardProps {
  tag: TagImplicationsViewModel;
  tagName: string;
}

const updateArrays = (
  addOrRemove: AddOrRemove,
  current: any[],
  setter: (a: any[]) => void,
  tagName: string
) => {
  const newArray = current.slice();
  if (addOrRemove === "Add") {
    newArray.push(tagName);
  } else {
    const maybeIdx = newArray.indexOf(tagName);
    if (maybeIdx > -1) {
      newArray.splice(maybeIdx, 1);
    }
  }

  setter(newArray);
};

const ImplicationsCard = (props: ImplicationsCardProps) => {
  const [implyingThis, setImplyingThis] = useState(props.tag.implying_this);
  const [impliedByThis, setImpliedByThis] = useState(props.tag.implied_by_this);

  const { tagName } = props;

  const getImpliedByThis = useMemo((): any => {
    const removeImpliedByThis = (a: string): void => {
      Api.Tags.removeImplication(tagName, a).then(
        res => {
          updateArrays("Remove", impliedByThis, setImpliedByThis, a);
        },
        err => {
          console.log(err);
        }
      );
    };

    const getListImpliedByThis = () => {
      if (impliedByThis.length === 0) return null;
      return (
        <ul>
          {impliedByThis.map(a => (
            <Fragment key={a}>
              <li>
                {a}
                <a
                  className="beevenue-alias-delete delete is-small"
                  onClick={e => removeImpliedByThis(a)}
                />
              </li>
            </Fragment>
          ))}
        </ul>
      );
    };

    const onImpliedByThisAdded = (a: string): void => {
      updateArrays("Add", impliedByThis, setImpliedByThis, a);
    };

    return (
      <div>
        Implied by this:
        {getListImpliedByThis()}
        <AddImplicationField
          tag={tagName}
          mode={"ImpliedByThis"}
          onImplicationAdded={a => onImpliedByThisAdded(a)}
        />
      </div>
    );
  }, [impliedByThis, tagName]);

  const getImplyingThis = useMemo((): any => {
    const removeImplyingThis = (a: string): void => {
      Api.Tags.removeImplication(a, tagName).then(
        res => {
          updateArrays("Remove", implyingThis, setImplyingThis, a);
        },
        err => {
          console.log(err);
        }
      );
    };

    const getListImplyingThis = () => {
      if (implyingThis.length === 0) return null;
      return (
        <ul>
          {implyingThis.map(a => (
            <Fragment key={a}>
              <li>
                {a}
                <a
                  className="beevenue-alias-delete delete is-small"
                  onClick={e => removeImplyingThis(a)}
                />
              </li>
            </Fragment>
          ))}
        </ul>
      );
    };

    const onImplyingThisAdded = (a: string): void => {
      updateArrays("Add", implyingThis, setImplyingThis, a);
    };

    return (
      <div>
        Implying this:
        {getListImplyingThis()}
        <AddImplicationField
          tag={tagName}
          mode={"ImplyingThis"}
          onImplicationAdded={a => onImplyingThisAdded(a)}
        />
      </div>
    );
  }, [implyingThis, tagName]);

  return (
    <div className="card beevenue-sidebar-card">
      <header className="card-header">
        <p className="card-header-title">Implications</p>
      </header>
      <div className="card-content">
        <div className="content">
          {getImpliedByThis}
          {getImplyingThis}
        </div>
      </div>
    </div>
  );
};

export { ImplicationsCard };
