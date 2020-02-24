import React, { Component } from "react";
import { connect } from "react-redux";
import Masonry from "react-masonry-css";
import { Location } from "history";

import { BeevenuePagination } from "./beevenuePagination";
import { addToQs } from "../pages/queryString";
import { redirect } from "../redux/actions";
import { isSpeedTagging } from "../redux/reducers/speedTagging";
import { ProgressiveThumbnail } from "./progressiveThumbnail";
import {
  MediumWallPagination,
  MediumWallPaginationItem
} from "./mediumWallTypes";

interface MediumWallProps {
  location: Location;
  media: MediumWallPagination;
  redirect: typeof redirect;
  isSpeedTagging: boolean;
}

interface MediumWallState {}

class MediumWall extends Component<MediumWallProps, MediumWallState, any> {
  public constructor(props: MediumWallProps) {
    super(props);
    this.state = {};
  }

  public onPageSelect = (n: number) => {
    addToQs(this.props, { pageNr: n });
  };

  public onPageSizeSelect = (n: number) => {
    // Example calculation:
    // * We are currently on pageNumber == 2, pageSize == 20.
    //   so we are showing images with 1-indices 21-40.
    // * When switching to pageSize == 10, we *still* want to show images
    //   starting at 1-index 21. That would put us on page *3*.
    // * Thus, we figure out on which pageNr our first visible image index
    //   would land (using the new pageSize), and switch pageNumber to that
    //   value as well.

    const previousFirstVisibleImageIndex =
      (this.props.media.pageNumber - 1) * this.props.media.pageSize + 1;

    const newPageNumber = Math.ceil(previousFirstVisibleImageIndex / n);

    addToQs(this.props, { pageNr: newPageNumber, pageSize: n });
  };

  public results = () => {
    if (!this.props.media || !this.props.media.items) {
      return null;
    }

    const imageLinks = this.props.media.items.map(
      (r: MediumWallPaginationItem) => {
        const maybeSrc = r.tinyThumbnail
          ? `data:image/png;base64, ${r.tinyThumbnail}`
          : undefined;

        return (
          <div className="beevenue-masonry-item" key={r.id}>
            <ProgressiveThumbnail
              src={maybeSrc}
              medium={r}
              isSpeedTagging={this.props.isSpeedTagging}
            />
          </div>
        );
      }
    );

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

  render() {
    return (
      <>
        <BeevenuePagination
          location={this.props.location}
          page={this.props.media}
          onPageSelect={n => this.onPageSelect(n)}
          onPageSizeSelect={n => this.onPageSizeSelect(n)}
        >
          {this.results()}
        </BeevenuePagination>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    isSpeedTagging: isSpeedTagging(state.speedTagging)
  };
};

const x = connect(mapStateToProps, null)(MediumWall);
export { x as MediumWall };
export default x;
