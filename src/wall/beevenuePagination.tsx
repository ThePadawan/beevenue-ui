import React, { useState, useEffect } from "react";
import qs from "qs";
import { useLocation } from "react-router-dom";

interface Page {
  pageNumber: number;
  pageCount: number;
  pageSize: number;
}

interface PaginationProps {
  children: any[] | any;
  page: Page;
  onPageSelect: (n: number) => void;
  onPageSizeSelect: (n: number) => void;
}

const BeevenuePagination = (props: PaginationProps) => {
  const location = useLocation();

  const q = qs.parse(location.search, { ignoreQueryPrefix: true });
  let initialPageSize = 10;

  const { page } = props;

  if (page && page.pageSize) {
    initialPageSize = page.pageSize;
  } else if (q.pageSize) {
    initialPageSize = q.pageSize;
  }

  const [pageSize, setPageSize] = useState(initialPageSize);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    props.onPageSizeSelect(newPageSize);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    if (!page) return;
    setPageSize(page.pageSize);
  }, [page]);

  if (!page || !page.pageNumber) {
    return null;
  }

  const pageNr = page.pageNumber;

  const linkTo = (n: number): JSX.Element => {
    return (
      <li>
        <a
          className="pagination-link"
          onClick={e => props.onPageSelect(n)}
          aria-label={`Goto page ${n}`}
        >
          {n}
        </a>
      </li>
    );
  };

  const { maybePrefix, maybePrevious } = getPreElements(pageNr, linkTo);
  const { maybeSuffix, maybeNext } = getPostElements(page, linkTo);

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
          <select value={pageSize} onChange={e => onChange(e)}>
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
      {props.children}
      {pagination}
    </>
  );
};

const getPreElements = (pageNr: number, linkTo: (n: number) => JSX.Element) => {
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
  return { maybePrefix, maybePrevious };
};

const getPostElements = (page: Page, linkTo: (n: number) => JSX.Element) => {
  const pageNr = page.pageNumber;
  const maxPageNr = page.pageCount;

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

  return { maybeSuffix, maybeNext };
};

export { BeevenuePagination };
