import React, { Component } from "react";
import { TagSimilarityWidget } from "../fragments/tag/tagSimilarityWidget";
import { TagImplicationWidget } from "../fragments/tag/tagImplicationWidget";
import { isSessionSfw } from "../redux/reducers/login";
import { connect } from "react-redux";
import { BeevenuePage, BeevenuePageProps } from "./beevenuePage";

interface TagStatisticsProps extends BeevenuePageProps {
  isSessionSfw: boolean;
}

class TagStatisticsPage extends Component<TagStatisticsProps, any, any> {
  public constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <BeevenuePage {...this.props}>
        <div>
          <nav className="level" key="similarity">
            <TagSimilarityWidget {...this.props} />
          </nav>
          <nav className="level" key="implication">
            <TagImplicationWidget {...this.props} />
          </nav>
        </div>
      </BeevenuePage>
    );
  }
}

const mapStateToProps = (state: any): TagStatisticsProps => {
  return {
    ...state,
    isSessionSfw: isSessionSfw(state.login)
  };
};

const x = connect(mapStateToProps, null)(TagStatisticsPage);
export { x as TagStatisticsPage };
export default x;
