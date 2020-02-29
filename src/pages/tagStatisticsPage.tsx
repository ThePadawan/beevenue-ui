import React from "react";
import { TagSimilarityWidget } from "../fragments/tag/tagSimilarityWidget";
import { TagImplicationWidget } from "../fragments/tag/tagImplicationWidget";
import { BeevenuePage } from "./beevenuePage";

const TagStatisticsPage = () => {
  return (
    <BeevenuePage>
      <div>
        <nav className="level" key="similarity">
          <TagSimilarityWidget />
        </nav>
        <nav className="level" key="implication">
          <TagImplicationWidget />
        </nav>
      </div>
    </BeevenuePage>
  );
};

export { TagStatisticsPage };
export default TagStatisticsPage;
