import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleSpeedTaggingItem } from "../redux/actions";
import { getSpeedTaggingItems } from "../redux/reducers/speedTagging";

interface SpeedTaggingItemProps {
  id: number;

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
      if (this.props.speedTaggingItems.indexOf(this.props.id) > -1) {
        return "beevenue-speed-tagger-selected";
      }

      return undefined;
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
