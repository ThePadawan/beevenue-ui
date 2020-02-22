import React, { Component } from "react";
import { connect } from "react-redux";
import Masonry from "react-masonry-component";
import { Location } from "history";

import { backendUrl } from "../config.json";
import { BeevenuePagination } from "./beevenuePagination";
import { Link } from "react-router-dom";
import { BeevenueSpinner } from "./beevenueSpinner";
import { addToQs } from "../pages/queryString";
import { redirect } from "../redux/actions";
import { isSpeedTagging } from "../redux/reducers/speedTagging";
import { SpeedTaggingItem } from "./speedTaggingItem";

export interface Thumbs {
  [index: number]: string;
}

interface MediumWallPaginationItem {
  id: number;
  aspectRatio: string | null;
  hash: string;
  thumbs: Thumbs;
}

export interface MediumWallPagination {
  items: MediumWallPaginationItem[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}

interface MediumWallProps {
  location: Location;
  media: MediumWallPagination;
  redirect: typeof redirect;
  isSpeedTagging: boolean;
}

interface MediumWallState {
  loadedImageCount: number;
}

class MediumWall extends Component<MediumWallProps, MediumWallState, any> {
  public constructor(props: MediumWallProps) {
    super(props);
    this.state = { loadedImageCount: 0 };
  }

  private onImageLoaded = () => {
    // Don't be an idiot and remove this, it will lead to an infinite loop.
    if (
      this.props.media.items &&
      this.state.loadedImageCount === this.props.media.items.length
    ) {
      return;
    }

    // Note: This describes the degree of parallelism with which <img> elements are added
    // to the DOM, so directly influences reactivity of the UI vs thumbnail loading performance!
    this.setState({ loadedImageCount: this.state.loadedImageCount + 10 });
  };

  public onPageSelect = (n: number) => {
    this.setState({ loadedImageCount: 0 });
    addToQs(this.props, { pageNr: n });
  };

  public onPageSizeSelect = (n: number) => {
    this.setState({ loadedImageCount: 0 });
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

  private masonryClasses = (
    isDoneLoading: boolean,
    m: MediumWallPaginationItem
  ): string => {
    const result = ["beevenue-masonry-item"];

    if (!isDoneLoading) {
      result.push("beevenue-masonry-hidden");
    }

    return result.join(" ");
  };

  public results = () => {
    if (!this.props.media || !this.props.media.items) {
      return null;
    }

    // TODO Make work for all breakpoints
    const thumbs = (r: MediumWallPaginationItem) => {
      return <img sizes="50vw" src={`${backendUrl}/thumbs/${r.id}`} />;
    };

    const isDoneLoading =
      this.state.loadedImageCount >= this.props.media.items.length;

    const imageLink = (r: MediumWallPaginationItem) => {
      if (this.props.isSpeedTagging) {
        const inner = {
          ...r,
          outerClassName: this.masonryClasses(isDoneLoading, r)
        };

        return <SpeedTaggingItem {...inner}>{thumbs(r)}</SpeedTaggingItem>;
      }

      return (
        <div className={this.masonryClasses(isDoneLoading, r)} key={r.id}>
          <Link to={`/show/${r.id}`}>{thumbs(r)}</Link>
        </div>
      );
    };

    return (
      <Masonry
        options={{
          columnWidth: ".beevenue-masonry-sizer",
          gutter: 20,
          transitionDuration: 0
        }}
        elementType={"div"}
        disableImagesLoaded={false}
        updateOnEachImageLoad={true}
        onImagesLoaded={i => this.onImageLoaded()}
      >
        <div className="beevenue-masonry-sizer" />
        {isDoneLoading ? undefined : <BeevenueSpinner />}
        {this.props.media.items.map(imageLink)}
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
