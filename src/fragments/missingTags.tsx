import React, { Component } from "react";
import { Api } from "../api/api";
import { Rating } from "../api/show";
import { BeevenueSpinner } from "./beevenueSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { isEqual } from "lodash-es";

interface MissingTagsProps {
  id: number;
  tags: string[];
  rating: Rating;
}

interface MissingTagsState {
  missing: string[] | null;
}

class MissingTags extends Component<MissingTagsProps, MissingTagsState, any> {
  public constructor(props: MissingTagsProps) {
    super(props);
    this.state = { missing: null };
  }

  componentDidUpdate = (oldProps: MissingTagsProps) => {
    if (!isEqual(this.props.tags, oldProps.tags)) {
      this.load();
    }

    if (!isEqual(this.props.rating, oldProps.rating)) {
      this.load();
    }
  };

  componentDidMount = () => {
    this.load();
  };

  private load = () => {
    this.setState({ ...this.state, missing: null });
    Api.Tags.getMissing(this.props.id).then(
      res => {
        this.setState({
          ...this.state,
          missing: res.data[`${this.props.id}`]
        });
      },
      err => {
        console.error(err);
      }
    );
  };

  render() {
    let inner = null;
    if (this.state.missing === null) {
      inner = <BeevenueSpinner />;
    } else if (this.state.missing.length === 0) {
      inner = <FontAwesomeIcon icon={faCheck} color="green" />;
    } else {
      inner = (
        <>
          <span>
            <FontAwesomeIcon icon={faTimes} color="red" />
          </span>
          <span>{this.state.missing}</span>
        </>
      );
    }

    return (
      <div className="beevenue-missing-tags card">
        <header className="card-header">
          <p className="card-header-title">Consistency</p>
        </header>
        <div className="card-content">
          <div className="content">{inner}</div>
        </div>
      </div>
    );
  }
}

export { MissingTags };
