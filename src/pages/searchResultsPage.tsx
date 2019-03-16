import React, { Component } from "react";
import { match } from "react-router";
import qs from "qs";

import { BeevenuePage } from "./beevenuePage";
import { connect } from "react-redux";

import { setSearchQuery, addSearchResults, redirect } from "../redux/actions";
import { getSearchResults } from "../redux/reducers/search";

import { Api, SearchParameters } from "../api/api";
import { isSessionSfw } from "../redux/reducers/login";
import { Thumbs, MediumWall } from "../fragments/mediumWall";
import { Location } from "history";
import { paginationParamsFromQuery } from "./pagination";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";

interface SearchResultItem {
  id: any;
  aspectRatio: string | null;
  hash: string;
  thumbs: Thumbs;
}

interface SearchResults {
  items: SearchResultItem[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}

interface SearchResultsPageParams {
  extra: string;
}

interface SearchResultsPageProps {
  match: match<SearchResultsPageParams>;
  location: Location;
  addSearchResults: typeof addSearchResults;
  setSearchQuery: typeof setSearchQuery;
  redirect: typeof redirect;
  results: SearchResults;
  isSessionSfw: boolean;
}

interface SearchResultsPageState {
  results: SearchResults | null;
  doShowSpinner: boolean;
}

class SearchResultsPage extends Component<
  SearchResultsPageProps,
  SearchResultsPageState,
  any
> {
  public constructor(props: SearchResultsPageProps) {
    super(props);
    this.state = { results: null, doShowSpinner: false };
  }

  componentDidMount = () => {
    this.doDefaultSearch();
  };

  private doSearch(params: SearchParameters) {
    this.setState({ ...this.state, results: null, doShowSpinner: true });
    Api.search(params).then(
      res => {
        this.props.addSearchResults(res.data);
        this.setState({
          ...this.state,
          results: res.data,
          doShowSpinner: false
        });
      },
      _ => {}
    );
  }

  private get searchTerms(): string {
    const joinedTags = this.props.match.params.extra;
    if (!joinedTags) return "";
    const tags = joinedTags.split("/").join(" ");
    return tags;
  }

  private get currentQueryString(): any {
    return qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
  }

  private doDefaultSearch() {
    const tags = this.searchTerms;
    if (tags == "") {
      console.warn("Searching with empty tags!");
      return;
    }

    this.props.setSearchQuery(tags);

    let q = this.currentQueryString;
    const paginationParams = paginationParamsFromQuery(q);
    const queryParams = { ...paginationParams, q: tags };
    this.doSearch(queryParams);
  }

  componentDidUpdate = (prevProps: SearchResultsPageProps, _: any) => {
    if (this.props.match.params.extra !== prevProps.match.params.extra) {
      this.doDefaultSearch();
      return;
    }

    if (this.props.location.search !== prevProps.location.search) {
      this.doDefaultSearch();
      return;
    }

    if (this.props.isSessionSfw !== prevProps.isSessionSfw) {
      this.doDefaultSearch();
      return;
    }
  };

  render() {
    let inner = null;
    if (this.state.doShowSpinner) {
      inner = <BeevenueSpinner />;
    } else if (!this.state.results || !this.state.results.items) {
      inner = <h2 className="title is-2">No results found.</h2>;
    } else {
      inner = <MediumWall media={this.state.results} {...this.props} />;
    }

    return <BeevenuePage {...this.props}>{inner}</BeevenuePage>;
  }
}

const mapStateToProps = (state: any): any => {
  return {
    isSessionSfw: isSessionSfw(state.login),
    results: getSearchResults(state.search)
  };
};

const x = connect(
  mapStateToProps,
  { addSearchResults, setSearchQuery, redirect }
)(SearchResultsPage);
export { x as SearchResultsPage };
