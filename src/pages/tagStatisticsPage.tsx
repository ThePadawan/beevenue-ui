import React, { Component, FormEvent } from "react";

import { Api } from "../api/api";
import { sortBy } from "lodash-es";
import { NeedsLoginPage } from "./needsLoginPage";
import { Link } from "react-router-dom";
import { Rating } from "../api/show";

interface Tag {
  tag: string;
  count: number;
  rating: Rating;
  id: number;
}

// TODO Implement rating picker, update API call

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
    this.setState({...this.state, tags: []});
    Api.deleteOrphanTags().then(_ => this.loadTags());
  };

  private loadTags = () => {
    Api.getTagStatistics().then(
        res => {
          let tags = res.data;
          tags = sortBy(tags, t => t.count).reverse();
          this.setState({ ...this.state, tags: tags });
        },
        err => {
          console.error(err);
        }
      );
  }

  render() {
    return (
      <NeedsLoginPage>
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
              </tr>
            </thead>
            <tbody>
              {this.state.tags.map(t => (
                <tr>
                  <td>
                    <Link to={`/search/${t.tag}`}>{t.tag}</Link>
                  </td>
                  <td>{t.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </NeedsLoginPage>
    );
  }
}

export { TagStatisticsPage };
