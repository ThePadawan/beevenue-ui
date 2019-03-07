import React, { Component } from "react";

import { Api } from "../api/api";
import { NeedsLoginPage } from "./needsLoginPage";
import { Link } from "react-router-dom";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface ShowTagViewModel {
  count: number;
}

interface TagShowPageState {
  tag: ShowTagViewModel | null;

  tagNotFound: boolean;
}

class TagShowPage extends Component<any, TagShowPageState, any> {
  public constructor(props: any) {
    super(props);
    this.state = { tag: null, tagNotFound: false };
  }

  private get tagName(): string {
    return this.props.match.params.name;
  }

  public componentDidMount = () => {
    this.loadTag();
  };

  private loadTag = () => {
    Api.showTag(this.tagName).then(
      res => {
        let tag = res.data;
        this.setState({ ...this.state, tag });
      },
      err => {
        this.setState({ ...this.state, tagNotFound: true })
      }
    );
  };

  private get innerContent() {
    if (this.state.tagNotFound) {
      return <div>No such tag</div>;
    }
    
    if (!this.state.tag) return <BeevenueSpinner />;

    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Usage</p>
        </header>
        <div className="card-content">
          <div className="content">
            Used {this.state.tag.count} times
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <NeedsLoginPage>
        <div>
          <h2 className="title">
          "{this.tagName}" tag
            <Link to={`/search/${this.tagName}`} className="beevenue-h2-link">
              <FontAwesomeIcon icon={faSearch} />
            </Link>
          </h2>
          {this.innerContent}
        </div>
      </NeedsLoginPage>
    );
  }
}

export { TagShowPage };
