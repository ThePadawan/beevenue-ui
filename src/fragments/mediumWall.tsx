import React, { Component } from "react";
import { connect } from "react-redux";
import Masonry from "react-masonry-component";
import {Location} from "history";

import { backendUrl } from "../config.json";
import { BeevenuePagination } from "./beevenuePagination";
import { Link } from "react-router-dom";

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

class MediumWall extends Component<MediumWallProps, any, any> {
  public constructor(props: MediumWallProps) {
    super(props);
    this.state = { allImagesLoaded: true};
  }

  public onLayoutComplete = () => {
    // Don't be an idiot and remove this, it will lead to an infinite loop.
    // if (this.state.allImagesLoaded) return;
    // this.setState({ allImagesLoaded: true });
  }

  public onPageSelect = (n: number) => {
    // this.setState({ allImagesLoaded: false });
    this.props.onPageSelect(n);
  }
  
  public onPageSizeSelect = (n: number) => {
    // this.setState({ allImagesLoaded: false });
    this.props.onPageSizeSelect(n);
  }

  private masonryClasses = (m: MediumWallPaginationItem) => {
    const thresholds = [1.4, 1.8, 2.2];

    // TODO: Create CSS class only showing on small display and show small thumb
    // Same with large thumb.

    const result = ["beevenue-masonry-item"];
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
      const sources = []

      for (let size in r.thumbs) {
        const sizePx = parseInt(size)
        let sizeSelector = '1x'
        if (sizePx < 600) {
          sizeSelector = '4x'
        }
        sources.push(
          `${backendUrl}${r.thumbs[size]} ${sizeSelector}`
        )
      }

      const srcset = sources.join(', ')
      return (
        <img
         sizes="(max-width: 768px) 85vw, (min-width: 1600px) 20vw, 35vw"
         srcSet={srcset}
         src={`${backendUrl}${r.thumbs[240]}`} />
      )
    }

    return (
      <Masonry
        className={this.state.allImagesLoaded ? undefined : 'beevenue-masonry-hidden'}
        options={{
          columnWidth: ".beevenue-masonry-sizer",
          gutter: 20,
          transitionDuration: 50
        }}
        elementType={"ul"}
        updateOnEachImageLoad={false}
        onLayoutComplete={() => this.onLayoutComplete()}
      >
        <li className="beevenue-masonry-sizer" />
        {this.props.media.items.map((r: MediumWallPaginationItem) => {
          return (
            <li className={this.masonryClasses(r)} key={r.id}>
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
