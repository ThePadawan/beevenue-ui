import React, { Component, FormEvent } from "react";
import { connect } from "react-redux";

import { getSearchQuery } from "../../redux/reducers/search";
import { addSearchResults, redirect } from "../../redux/actions";

interface SearchPanelState {
  searchTerms: string;
}

class SearchPanel extends Component<any, SearchPanelState, any> {
  public constructor(props: any) {
    super(props);
    this.state = { searchTerms: this.props.searchTerms || "" };
  }

  componentDidUpdate = (prevProps: any) => {
    if (this.props.searchTerms !== prevProps.searchTerms) {
      this.setState({ ...this.state, searchTerms: this.props.searchTerms });
    }
  }

  onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.redirect(`/search/${this.state.searchTerms.replace(/ /g, '/')}`);
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
}

const x = connect(
  mapStateToProps,
  { addSearchResults,  redirect }
)(SearchPanel);
export { x as SearchPanel };
