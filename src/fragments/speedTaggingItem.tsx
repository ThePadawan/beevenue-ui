import React, { Component } from "react";
import { connect } from "react-redux";
import { Thumbs } from "./mediumWall";
import { toggleSpeedTaggingItem } from "../redux/actions";
import { getSpeedTaggingItems } from "../redux/reducers/speedTagging";

interface SpeedTaggingItemProps {
  id: number;
  thumbs: Thumbs;

  outerClassName: string;
  toggleSpeedTaggingItem: typeof toggleSpeedTaggingItem;

  speedTaggingItems: number[];
}

interface SpeedTaggingItemState {}

class SpeedTaggingItem extends Component<
  SpeedTaggingItemProps,
  SpeedTaggingItemState,
  any
> {
  public constructor(props: any) {
    super(props);
    this.state = { isSelected: false };
  }

  private toggle = () => {
    this.props.toggleSpeedTaggingItem(this.props.id);
  };

  render() {
    const className = () => {
      const base = this.props.outerClassName;
      if (this.props.speedTaggingItems.indexOf(this.props.id) > -1) {
        return `${base} beevenue-speed-tagger-selected`;
      }

      return base;
    };

    return (
      <div
        className={className()}
        key={this.props.id}
        onClick={e => this.toggle()}
      >
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    speedTaggingItems: getSpeedTaggingItems(state.speedTagging).slice()
  };
};

const x = connect(mapStateToProps, { toggleSpeedTaggingItem })(
  SpeedTaggingItem
);
export { x as SpeedTaggingItem };
