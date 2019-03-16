interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

export const paginationParamsFromQuery = (q: any): PaginationParams => {
  let pageNumber: number = parseInt(q.pageNr, 10) || 1;
  if (pageNumber < 1) pageNumber = 1;

  let pageSize: number = parseInt(q.pageSize, 10) || 10;
  if (pageSize < 10) pageSize = 10;
  if (pageSize > 100) pageSize = 100;

  return {
    pageNumber,
    pageSize
  };
};
