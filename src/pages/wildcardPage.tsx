import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { BeevenuePage } from "./beevenuePage";

import { redirect } from "../redux/actions";
import { useRouteMatch } from "react-router";

interface WildcardPageParams {
  whatever: string;
}

const WildcardPage = () => {
  const match = useRouteMatch<WildcardPageParams>();
  const { whatever } = match.params;

  const dispatch = useDispatch();

  useEffect(() => {
    if (whatever) {
      dispatch(redirect("/"));
    }
  }, [dispatch, whatever]);

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
