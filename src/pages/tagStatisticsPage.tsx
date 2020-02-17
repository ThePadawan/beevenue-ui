import React, { Component } from "react";

import { Api } from "../api/api";
import { sortBy } from "lodash-es";
import { NeedsLoginPage } from "./needsLoginPage";
import { Link } from "react-router-dom";
import { Rating } from "../api/show";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";
import { TagSimilarityWidget } from "../fragments/tag/tagSimilarityWidget";
import { TagImplicationWidget } from "../fragments/tag/tagImplicationWidget";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

interface Tag {
  tag: string;
  impliedByThisCount: number;
  implyingThisCount: number;
  mediaCount: number;
  rating: Rating;
  id: number;
}

interface TagStatisticsPageState {
  tags: Tag[];
}

class TagStatisticsPage extends Component<any, TagStatisticsPageState, any> {
  public constructor(props: any) {
    super(props);
    this.state = { tags: [] };
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

  private cleanUp = (tag: string): void => {
    Api.Tags.cleanUp(tag);
  };

  private renderTable = () => {
    return (
      <>
        <div>
          <button className="button" onClick={e => this.deleteOrphanTags()}>
            Delete orphan tags
          </button>
        </div>
        <TagSimilarityWidget />
        <TagImplicationWidget />
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Tag</th>
                <th>?</th>
                <th>Media</th>
                <th />
              </tr>
            </thead>
            <tbody>{this.state.tags.map(this.renderTag)}</tbody>
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
        <td>{t.mediaCount}</td>
        <td>
          <button className="button" onClick={e => this.cleanUp(t.tag)}>
            Clean up
          </button>{" "}
        </td>
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
      this.state.tags.length > 0 ? this.renderTable() : <BeevenueSpinner />;

    return <NeedsLoginPage>{content}</NeedsLoginPage>;
  }
}

export { TagStatisticsPage };
