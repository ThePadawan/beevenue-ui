import React, { Component } from "react";
import { Link } from "react-router-dom";
import { SpeedTaggingItem } from "./speedTaggingItem";

interface Medium {
  id: number;
}

interface ProgressiveThumbnailProps {
  src?: string;
  medium: Medium;

  isSpeedTagging: boolean;
}

interface ProgressiveThumbnailState {
  src: string;
  doBlur: boolean;
}

class ProgressiveThumbnail extends Component<
  ProgressiveThumbnailProps,
  ProgressiveThumbnailState,
  any
> {
  public constructor(props: ProgressiveThumbnailProps) {
    super(props);
    this.state = { src: this.props.src!, doBlur: true };
  }

  public replaceWith = (src: any) => {
    this.setState({ ...this.state, src, doBlur: false });
  };

  render() {
    const className = this.state.doBlur ? "tiny-thumb" : undefined;

    if (this.props.isSpeedTagging) {
      const innerProps = {
        ...this.props.medium,
        outerClassName: "TODO-might-not-be-necessary"
      };

      return (
        <SpeedTaggingItem {...innerProps}>
          <img width="50vw" className={className} src={this.state.src} />
        </SpeedTaggingItem>
      );
    }

    return (
      <Link to={`/show/${this.props.medium.id}`}>
        <img width="50vw" className={className} src={this.state.src} />
      </Link>
    );
  }
}

export { ProgressiveThumbnail };
