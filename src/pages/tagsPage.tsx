import React, { Component } from "react";

import { Api } from "../api/api";
import { sortBy } from "lodash-es";
import { NeedsLoginPage } from "./needsLoginPage";
import { Link } from "react-router-dom";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

interface Tag {
  tag: string;
  impliedByThisCount: number;
  implyingThisCount: number;
  mediaCount: number;
}

interface TagsPageState {
  tags: Tag[];
  filter: string;
}

class TagsPage extends Component<any, TagsPageState, any> {
  public constructor(props: any) {
    super(props);
    this.state = { tags: [], filter: "" };
  }

  public componentDidMount = () => {
    this.loadTags();
  };

  public deleteOrphanTags = () => {
    this.setState({ ...this.state, tags: [] });
    Api.Tags.deleteOrphans().then(_ => this.loadTags());
  };

  private loadTags = () => {
    Api.Tags.getStatistics().then(
      res => {
        let tags = res.data;
        tags = sortBy(tags, t => t.mediaCount).reverse();
        this.setState({ ...this.state, tags: tags });
      },
      err => {
        console.error(err);
      }
    );
  };

  private filteredTags = () => {
    try {
      const regex = new RegExp(this.state.filter);
      return this.state.tags.filter(t => regex.test(t.tag));
    } catch {
      return this.state.tags;
    }
  };

  private onChange(filter: string) {
    this.setState({ ...this.state, filter });
  }

  private renderContent = () => {
    return (
      <>
        <div>
          <button className="button" onClick={e => this.deleteOrphanTags()}>
            Delete orphan tags
          </button>
        </div>
        <div className="content beevenue-tags-filter">
          <input
            className="input"
            type="text"
            placeholder="Filter"
            value={this.state.filter}
            onChange={e => this.onChange(e.currentTarget.value)}
          />
        </div>
        <div>
          <table className="table is-striped is-narrow is-hoverable">
            <thead>
              <tr>
                <th>Tag</th>
                <th />
                <th>Media</th>
              </tr>
            </thead>
            <tbody>{this.filteredTags().map(this.renderTag)}</tbody>
          </table>
        </div>
      </>
    );
  };

  private renderTag = (t: Tag): JSX.Element => {
    return (
      <tr key={t.tag}>
        <td>
          <Link to={`/tag/${t.tag}`}>{t.tag}</Link>
        </td>
        <td>{this.maybeRenderTooltip(t)}</td>
        <td className="has-text-centered">{t.mediaCount}</td>
      </tr>
    );
  };

  private maybeRenderTooltip = (t: Tag): React.ReactNode => {
    if (t.mediaCount === 0 && t.implyingThisCount > 0) {
      const title =
        "This tag is not used on any media, but implied by other tags." +
        " It will stay in this list.";

      return <FontAwesomeIcon icon={faQuestionCircle} title={title} />;
    }

    return null;
  };

  render() {
    const content =
      this.state.tags.length > 0 ? this.renderContent() : <BeevenueSpinner />;

    return <NeedsLoginPage>{content}</NeedsLoginPage>;
  }
}

export { TagsPage };
