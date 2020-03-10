import React from "react";
import Masonry from "react-masonry-css";

import { BeevenuePagination } from "./beevenuePagination";
import { useQueryStringRedirect } from "./queryString";
import { ProgressiveThumbnail } from "./progressiveThumbnail";
import {
  MediumWallPagination,
  MediumWallPaginationItem
} from "./mediumWallTypes";

interface MediumWallProps {
  media: MediumWallPagination;
}

const MediumWall = (props: MediumWallProps) => {
  const queryStringRedirect = useQueryStringRedirect();

  const { media } = props;

  const onPageSelect = (n: number) => {
    queryStringRedirect({ pageNr: n });
  };

  const onPageSizeSelect = (n: number) => {
    // Example calculation:
    // * We are currently on pageNumber == 2, pageSize == 20.
    //   so we are showing images with 1-indices 21-40.
    // * When switching to pageSize == 10, we *still* want to show images
    //   starting at 1-index 21. That would put us on page *3*.
    // * Thus, we figure out on which pageNr our first visible image index
    //   would land (using the new pageSize), and switch pageNumber to that
    //   value as well.

    const previousFirstVisibleImageIndex =
      (media.pageNumber - 1) * media.pageSize + 1;

    const newPageNumber = Math.ceil(previousFirstVisibleImageIndex / n);

    queryStringRedirect({ pageNr: newPageNumber, pageSize: n });
  };

  const results = () => {
    if (!media || !media.items) {
      return null;
    }

    const imageLinks = media.items.map((r: MediumWallPaginationItem) => {
      const maybeSrc = r.tinyThumbnail
        ? `data:image/png;base64, ${r.tinyThumbnail}`
        : undefined;

      return (
        <div className="beevenue-masonry-item" key={r.id}>
          <ProgressiveThumbnail src={maybeSrc} medium={r} />
        </div>
      );
    });

    return (
      <Masonry
        breakpointCols={{
          default: 4,
          1600: 2,
          500: 1
        }}
        className="beevenue-masonry"
        columnClassName="beevenue-masonry-column"
      >
        {imageLinks}
      </Masonry>
    );
  };

  return (
    <>
      <BeevenuePagination
        page={media}
        onPageSelect={n => onPageSelect(n)}
        onPageSizeSelect={n => onPageSizeSelect(n)}
      >
        {results()}
      </BeevenuePagination>
    </>
  );
};

export { MediumWall };
export default MediumWall;
