import React, { Component } from "react";
import { connect } from "react-redux";

import {
  toggleSpeedTagging,
  setShouldRefresh,
  clearSpeedTaggingItems
} from "../../redux/actions";
import {
  isSpeedTagging,
  getSpeedTaggingItems
} from "../../redux/reducers/speedTagging";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { Api } from "../../api/api";

interface SpeedTaggerPanelProps {
  clearSpeedTaggingItems: typeof clearSpeedTaggingItems;
  toggleSpeedTagging: typeof toggleSpeedTagging;
  setShouldRefresh: typeof setShouldRefresh;
  speedTaggingItems: number[];
  isSpeedTagging: boolean;
}

interface SpeedTaggerPanelState {
  tags: string;
}

class SpeedTaggerPanel extends Component<
  SpeedTaggerPanelProps,
  SpeedTaggerPanelState,
  any
> {
  public constructor(props: any) {
    super(props);
    this.state = { tags: "" };
  }

  onChangeTags(tags: string) {
    this.setState({ ...this.state, tags });
  }

  private toggle = () => {
    this.props.toggleSpeedTagging();
  };

  private go = () => {
    const items = this.props.speedTaggingItems;
    if (items.length < 1) {
      return;
    }

    const tagNames = this.state.tags.split(" ");
    if (tagNames.length < 1) {
      return;
    }

    Api.Tags.batchAdd(tagNames, items).finally(() => {
      this.props.clearSpeedTaggingItems();
      this.props.setShouldRefresh(true);
    });
  };

  private get cardTitle() {
    if (
      this.props.speedTaggingItems &&
      this.props.speedTaggingItems.length > 0
    ) {
      return `Speed tagger (${this.props.speedTaggingItems.length} selected)`;
    }

    return "Speed tagger";
  }

  render() {
    return (
      <div className="card beevenue-sidebar-card">
        <div className="card-header">
          <p className="card-header-title">{this.cardTitle}</p>
        </div>
        <div className="card-content">
          <div className="content">
            <form>
              <div className="field">
                <input
                  className="input"
                  type="text"
                  placeholder="Tags"
                  value={this.state.tags}
                  onChange={e => this.onChangeTags(e.currentTarget.value)}
                />
              </div>
              <div className="field">
                <input
                  type="checkbox"
                  id="speed-tagger-switch"
                  name="speed-tagger-switch"
                  className="switch"
                  defaultChecked={this.props.isSpeedTagging}
                  onChange={_ => this.toggle()}
                />
                <label htmlFor="speed-tagger-switch">Mark</label>
              </div>
              <div className="field">
                <a className="button" onClick={_ => this.go()}>
                  <FontAwesomeIcon icon={faCheck} />
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    speedTaggingItems: getSpeedTaggingItems(state.speedTagging).slice(),
    isSpeedTagging: isSpeedTagging(state.speedTagging)
  };
};

const x = connect(mapStateToProps, {
  setShouldRefresh,
  toggleSpeedTagging,
  clearSpeedTaggingItems
})(SpeedTaggerPanel);
export { x as SpeedTaggerPanel };
