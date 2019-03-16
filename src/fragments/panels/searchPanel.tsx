import React, { Component, FormEvent } from "react";
import { connect } from "react-redux";

import { getSearchQuery } from "../../redux/reducers/search";
import { addSearchResults, redirect } from "../../redux/actions";
import { Location } from "history";
import qs from "qs";

interface SearchPanelState {
  searchTerms: string;
}

interface SearchPanelProps {
  location: Location;
  searchTerms: string | null;
  redirect: typeof redirect;
}

class SearchPanel extends Component<SearchPanelProps, SearchPanelState, any> {
  public constructor(props: any) {
    super(props);
    this.state = { searchTerms: this.props.searchTerms || "" };
  }

  componentDidUpdate = (prevProps: any) => {
    if (
      this.props.searchTerms !== prevProps.searchTerms &&
      this.props.searchTerms
    ) {
      this.setState({ ...this.state, searchTerms: this.props.searchTerms });
    }
  };

  onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Redirect to new search results. Keep query parameter "pageSize"
    // if it is set.
    let newQ = "";
    if (this.props.location) {
      const query = qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true
      });
      const { pageSize } = query;
      newQ = qs.stringify({ pageSize });
    }
    let newPath = `/search/${this.state.searchTerms.replace(/ /g, "/")}`;
    if (newQ) {
      newPath = `${newPath}?${newQ}`;
    }

    this.props.redirect(newPath);
  }

  onChange(newSearchTerms: string) {
    this.setState({ ...this.state, searchTerms: newSearchTerms });
  }

  render() {
    return (
      <div className="card beevenue-sidebar-card">
        <div className="card-header">
          <p className="card-header-title">Search</p>
        </div>
        <div className="card-content">
          <div className="content">
            <form onSubmit={e => this.onSubmit(e)}>
              <input
                className="input"
                type="text"
                placeholder="Search"
                value={this.state.searchTerms}
                onChange={e => this.onChange(e.currentTarget.value)}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { searchTerms: getSearchQuery(state.search) };
};

const x = connect(
  mapStateToProps,
  { addSearchResults, redirect }
)(SearchPanel);
export { x as SearchPanel };
