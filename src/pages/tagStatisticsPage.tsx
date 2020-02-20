import React, { Component } from "react";
import { NeedsLoginPage } from "./needsLoginPage";
import { TagSimilarityWidget } from "../fragments/tag/tagSimilarityWidget";
import { TagImplicationWidget } from "../fragments/tag/tagImplicationWidget";

class TagStatisticsPage extends Component<any, any, any> {
  public constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <NeedsLoginPage>
        <div>
          <TagSimilarityWidget />
          <TagImplicationWidget />
        </div>
      </NeedsLoginPage>
    );
  }
}

export { TagStatisticsPage };
