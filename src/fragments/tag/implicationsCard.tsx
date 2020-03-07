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

const listHelper = (list: string[], callback: (s: string) => void) => {
  if (list.length === 0) return null;
  return (
    <ul>
      {list.map(a => (
        <Fragment key={a}>
          <li>
            {a}
            <a
              className="beevenue-alias-delete delete is-small"
              onClick={e => callback(a)}
            />
          </li>
        </Fragment>
      ))}
    </ul>
  );
};

const removeHelper = (
  apiCall: Promise<any>,
  current: string[],
  setter: (a: string[]) => void,
  a: string
) => {
  return apiCall.then(
    res => {
      updateArrays("Remove", current, setter, a);
    },
    err => {
      console.log(err);
    }
  );
};

const useImplied = (props: ImplicationsCardProps) => {
  const { tagName } = props;
  const [impliedByThis, setImpliedByThis] = useState(props.tag.implied_by_this);

  const getImpliedByThis = useMemo((): any => {
    const removeImpliedByThis = (a: string) =>
      removeHelper(
        Api.Tags.removeImplication(tagName, a),
        impliedByThis,
        setImpliedByThis,
        a
      );

    return (
      <div>
        Implied by this:
        {listHelper(impliedByThis, removeImpliedByThis)}
        <AddImplicationField
          tag={tagName}
          mode={"ImpliedByThis"}
          onImplicationAdded={a =>
            updateArrays("Add", impliedByThis, setImpliedByThis, a)
          }
        />
      </div>
    );
  }, [impliedByThis, tagName]);

  return getImpliedByThis;
};

const useImplying = (props: ImplicationsCardProps) => {
  const { tagName } = props;
  const [implyingThis, setImplyingThis] = useState(props.tag.implying_this);

  const getImplyingThis = useMemo((): any => {
    const removeImplyingThis = (a: string) =>
      removeHelper(
        Api.Tags.removeImplication(a, tagName),
        implyingThis,
        setImplyingThis,
        a
      );

    return (
      <div>
        Implying this:
        {listHelper(implyingThis, removeImplyingThis)}
        <AddImplicationField
          tag={tagName}
          mode={"ImplyingThis"}
          onImplicationAdded={a =>
            updateArrays("Add", implyingThis, setImplyingThis, a)
          }
        />
      </div>
    );
  }, [implyingThis, tagName]);

  return getImplyingThis;
};

const ImplicationsCard = (props: ImplicationsCardProps) => {
  const getImpliedByThis = useImplied(props);
  const getImplyingThis = useImplying(props);

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
