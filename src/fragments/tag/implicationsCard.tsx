import React, { Component, Fragment } from "react";
import { Api } from "../../api/api";
import { AddImplicationField, Mode } from "./addImplicationField";

type AddOrRemove = "Add" | "Remove";

export interface TagImplicationsViewModel {
  implied_by_this: string[];
  implying_this: string[];
}

interface ImplicationsCardProps {
  tag: TagImplicationsViewModel;
  tagName: string;
}

interface ImplicationsCardState {
  tag: TagImplicationsViewModel;
}

class ImplicationsCard extends Component<
  ImplicationsCardProps,
  ImplicationsCardState,
  any
> {
  public constructor(props: any) {
    super(props);
    this.state = { tag: props.tag };
  }

  private getImpliedByThis(): any {
    const tag = this.props.tag;

    const getInner = () => {
      if (tag.implied_by_this.length == 0) return null;
      return (
        <ul>
          {tag.implied_by_this.map(a => (
            <Fragment key={a}>
              <li>
                {a}
                <a
                  className="beevenue-alias-delete delete is-small"
                  onClick={e => this.removeImpliedByThis(a)}
                />
              </li>
            </Fragment>
          ))}
        </ul>
      );
    };

    return (
      <div>
        Implied by this:
        {getInner()}
        <AddImplicationField
          tag={this.props.tagName}
          mode={"ImpliedByThis"}
          onImplicationAdded={a => this.onImpliedByThisAdded(a)}
        />
      </div>
    );
  }

  private removeImpliedByThis = (a: string): void => {
    Api.Tags.removeImplication(this.props.tagName, a).then(
      res => {
        this.updateArrays("Remove", "ImpliedByThis", a);
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  };

  private removeImplyingThis = (a: string): void => {
    Api.Tags.removeImplication(a, this.props.tagName).then(
      res => {
        this.updateArrays("Remove", "ImplyingThis", a);
      },
      err => {
        console.log(err);
      }
    );
  };

  private onImpliedByThisAdded = (a: string): void => {
    this.updateArrays("Add", "ImpliedByThis", a);
  };

  private onImplyingThisAdded = (a: string): void => {
    this.updateArrays("Add", "ImplyingThis", a);
  };

  private updateArrays = (
    addOrRemove: AddOrRemove,
    mode: Mode,
    tagName: string
  ) => {
    const tag = this.state.tag;
    if (!tag) return;

    // Signal React to behave
    const target =
      mode == "ImpliedByThis"
        ? this.props.tag.implied_by_this
        : this.props.tag.implying_this;

    const newArray = target.slice();
    if (addOrRemove == "Add") {
      newArray.push(tagName);
    } else {
      const maybeIdx = newArray.indexOf(tagName);
      if (maybeIdx > -1) {
        newArray.splice(maybeIdx, 1);
      }
    }

    if (mode == "ImpliedByThis") {
      tag.implied_by_this = newArray;
    } else {
      tag.implying_this = newArray;
    }

    this.setState({ ...this.state, tag });
  };

  private getImplyingThis(): any {
    const tag = this.props.tag;

    const getInner = () => {
      if (tag.implying_this.length == 0) return null;
      return (
        <ul>
          {tag.implying_this.map(a => (
            <Fragment key={a}>
              <li>
                {a}
                <a
                  className="beevenue-alias-delete delete is-small"
                  onClick={e => this.removeImplyingThis(a)}
                />
              </li>
            </Fragment>
          ))}
        </ul>
      );
    };

    return (
      <div>
        Implying this:
        {getInner()}
        <AddImplicationField
          tag={this.props.tagName}
          mode={"ImplyingThis"}
          onImplicationAdded={a => this.onImplyingThisAdded(a)}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="card beevenue-sidebar-card">
        <header className="card-header">
          <p className="card-header-title">Implications</p>
        </header>
        <div className="card-content">
          <div className="content">
            {this.getImpliedByThis()}
            {this.getImplyingThis()}
          </div>
        </div>
      </div>
    );
  }
}

export { ImplicationsCard };
