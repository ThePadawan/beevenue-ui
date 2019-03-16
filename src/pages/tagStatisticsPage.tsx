import React, { Component } from "react";

import { Api } from "../api/api";
import { sortBy } from "lodash-es";
import { NeedsLoginPage } from "./needsLoginPage";
import { Link } from "react-router-dom";
import { Rating } from "../api/show";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";

interface Tag {
  tag: string;
  count: number;
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
        tags = sortBy(tags, t => t.count).reverse();
        this.setState({ ...this.state, tags: tags });
      },
      err => {
        console.error(err);
      }
    );
  };

  private cleanUp = (tag: string): void => {
    Api.Tags.cleanUp(tag).then(_ => {
      console.log("Success");
    });
    return;
  };

  private getTable = () => {
    return (
      <>
        <div>
          <button className="button" onClick={e => this.deleteOrphanTags()}>
            Delete orphan tags
          </button>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Media</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.tags.map(t => (
                <tr key={t.tag}>
                  <td>
                    <Link to={`/tag/${t.tag}`}>{t.tag}</Link>
                  </td>
                  <td>{t.count}</td>
                  <td>
                    <button
                      className="button"
                      onClick={e => this.cleanUp(t.tag)}
                    >
                      Clean up
                    </button>{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  render() {
    const content =
      this.state.tags.length > 0 ? this.getTable() : <BeevenueSpinner />;

    return <NeedsLoginPage>{content}</NeedsLoginPage>;
  }
}

export { TagStatisticsPage };
