export interface MediumWallPaginationItem {
  tinyThumbnail: string | null;
  id: number;
  aspectRatio: string | null;
  hash: string;
}

export interface MediumWallPagination {
  items: MediumWallPaginationItem[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}
