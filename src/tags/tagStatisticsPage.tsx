import React from "react";
import { TagSimilarityWidget } from "./tagSimilarityWidget";
import { TagImplicationWidget } from "./tagImplicationWidget";

const TagStatisticsPage = () => {
  return (
    <div>
      <nav className="level" key="similarity">
        <TagSimilarityWidget />
      </nav>
      <nav className="level" key="implication">
        <TagImplicationWidget />
      </nav>
    </div>
  );
};

export { TagStatisticsPage };
export default TagStatisticsPage;
