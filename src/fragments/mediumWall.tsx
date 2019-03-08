import React, { Component } from "react";
import { connect } from "react-redux";
import Masonry from "react-masonry-component";
import {Location} from "history";

import { backendUrl } from "../config.json";
import { BeevenuePagination } from "./beevenuePagination";
import { Link } from "react-router-dom";
import { BeevenueSpinner } from "./beevenueSpinner";

export interface Thumbs
{
  [index: number]: string;
}

interface MediumWallPaginationItem {
    id: number;
    aspectRatio: string | null;
    hash: string;
    thumbs: Thumbs;
  }

export interface MediumWallPagination
{
    items: MediumWallPaginationItem[];
    pageCount: number;
    pageNumber: number;
    pageSize: number;
}

interface MediumWallProps {
    location: Location;
    media: MediumWallPagination;
    onPageSelect: (n: number) => void;
    onPageSizeSelect: (n: number) => void;
}

interface MediumWallState {
  loadedImageCount: number;
}

class MediumWall extends Component<MediumWallProps, MediumWallState, any> {
  public constructor(props: MediumWallProps) {
    super(props);
    this.state = { loadedImageCount: 0 };
  }

  public onImageLoaded = (image: any) => {
    // Don't be an idiot and remove this, it will lead to an infinite loop.
    if (this.props.media.items && (this.state.loadedImageCount === this.props.media.items.length)) return;

    // Note: This describes the degree of parallelism with which <img> elements are added
    // to the DOM, so directly influences reactivity of the UI vs thumbnail loading performance!
    this.setState({ loadedImageCount: this.state.loadedImageCount + 10 });
  }

  public onPageSelect = (n: number) => {
    this.setState({ loadedImageCount: 0 });
    this.props.onPageSelect(n);
  }
  
  public onPageSizeSelect = (n: number) => {
    this.setState({ loadedImageCount: 0 });
    this.props.onPageSizeSelect(n);
  }

  private masonryClasses = (isDoneLoading: boolean, m: MediumWallPaginationItem) => {
    const thresholds = [1.4, 1.8, 2.2];

    const result = ["beevenue-masonry-item"];

    if (!isDoneLoading) {
      result.push("beevenue-masonry-hidden");
    }

    if (m.aspectRatio === null) {
      return result.join(' ');
    }

    const aspectRatio = parseFloat(m.aspectRatio);

    for (let idx = thresholds.length - 1; idx >= 0; --idx) {
      const threshold = thresholds[idx];

      if (aspectRatio > threshold) {
        result.push(`beevenue-masonry-item-${idx + 2}`);
        return result.join(" ")
      }
    }

    return result.join(' ')
  }


  public results = () => {
    if (!this.props.media || !this.props.media.items) {
      return null;
    }

    const thumbs = (r: MediumWallPaginationItem) => {
      return (
        <picture>
          <source srcSet={`${backendUrl}${r.thumbs[600]}`} media="(min-width: 769px)" />
          <img src={`${backendUrl}${r.thumbs[240]}`} />
        </picture>
      )
    }

    const isDoneLoading = this.state.loadedImageCount >= this.props.media.items.length;

    return (
      <Masonry
        options={{
          columnWidth: ".beevenue-masonry-sizer",
          gutter: 20,
          transitionDuration: 0
        }}
        elementType={"ul"}
        disableImagesLoaded={false}
        updateOnEachImageLoad={true}
        onImagesLoaded={i => this.onImageLoaded(i)}
      >
        <li className="beevenue-masonry-sizer" />
        {isDoneLoading ? undefined : <BeevenueSpinner />}
        {this.props.media.items.map((r: MediumWallPaginationItem) => {
          return (
            <li className={this.masonryClasses(isDoneLoading, r)} key={r.id}>
              <Link to={`/show/${r.id}`}>
                {thumbs(r)}
              </Link>
            </li>
          );
        })}
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

const x = connect(
  null,
  null
)(MediumWall);
export { x as MediumWall };
