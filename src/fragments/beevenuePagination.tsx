import React, { Component } from "react";
import qs from "qs";
import { Location } from "history";

interface Page {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
}

interface PaginationProps {
  location: Location;
  page: Page;
  onPageSelect: (n: number) => void;
  onPageSizeSelect: (n: number) => void;
}

class BeevenuePagination extends Component<PaginationProps, any, any> {
  public constructor(props: PaginationProps) {
    super(props);

    const q = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });

    if (props.page && props.page.pageSize) {
      this.state = { pageSize: props.page.pageSize };
    } else if (q.pageSize) {
      this.state = { pageSize: q.pageSize };
    } else {
      this.state = { pageSize: 10 };
    }
  }

  public componentDidUpdate = (oldProps: PaginationProps) => {
    if (
      oldProps.page &&
      this.props.page &&
      oldProps.page.pageSize !== this.props.page.pageSize
    ) {
      this.setState({ ...this.state, pageSize: this.props.page.pageSize });
    }
  };

  public onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    this.props.onPageSizeSelect(newPageSize);
    this.setState({ ...this.state, pageSize: newPageSize });
  };

  render() {
    if (!this.props.page || !this.props.page.pageNumber) {
      return null;
    }

    const pageNr = this.props.page.pageNumber;
    const maxPageNr = this.props.page.pageCount;

    const linkTo = (n: number): JSX.Element => {
      return (
        <li>
          <a
            className="pagination-link"
            onClick={e => this.props.onPageSelect(n)}
            aria-label={`Goto page ${n}`}
          >
            {n}
          </a>
        </li>
      );
    };

    let maybePrefix: JSX.Element | null = null;
    if (pageNr > 1) {
      maybePrefix = (
        <>
          {linkTo(1)}
          {pageNr < 4 ? null : (
            <li>
              <span className="pagination-ellipsis">&hellip;</span>
            </li>
          )}
        </>
      );
    }

    let maybePrevious: JSX.Element | null = null;
    if (pageNr > 2) {
      maybePrevious = linkTo(pageNr - 1);
    }

    let maybeSuffix: JSX.Element | null = null;
    if (pageNr < maxPageNr) {
      maybeSuffix = (
        <>
          {pageNr > maxPageNr - 3 ? null : (
            <li>
              <span className="pagination-ellipsis">&hellip;</span>
            </li>
          )}
          {linkTo(maxPageNr)}
        </>
      );
    }

    let maybeNext: JSX.Element | null = null;
    if (pageNr < maxPageNr - 1) {
      maybeNext = linkTo(pageNr + 1);
    }

    const pagination = (
      <nav
        className="pagination beevenue-pagination"
        role="navigation"
        aria-label="pagination"
      >
        <span>
          <ul className="pagination-list">
            {maybePrefix}
            {maybePrevious}
            <li>
              <a
                className="pagination-link is-current"
                aria-label={`Go to page ${pageNr}`}
                aria-current="page"
              >
                {pageNr}
              </a>
            </li>
            {maybeNext}
            {maybeSuffix}
          </ul>
        </span>
        <span>
          <div className="select">
            <select
              value={this.state.pageSize}
              onChange={e => this.onChange(e)}
            >
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </span>
      </nav>
    );

    return (
      <>
        {pagination}
        {this.props.children}
        {pagination}
      </>
    );
  }
}

export { BeevenuePagination };
