import React, { useEffect } from "react";

import { BeevenuePage } from "./beevenuePage";

import { useRouteMatch } from "react-router";
import { forceRedirect } from "../redirect";

interface WildcardPageParams {
  whatever: string;
}

const WildcardPage = () => {
  const match = useRouteMatch<WildcardPageParams>();
  const { whatever } = match.params;

  useEffect(() => {
    if (whatever) {
      forceRedirect("/");
    }
  }, [whatever]);

  return (
    <BeevenuePage>
      <div className="column">
        <h1 className="title">Title</h1>
      </div>
    </BeevenuePage>
  );
};

export { WildcardPage };
export default WildcardPage;
