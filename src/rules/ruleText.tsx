import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Rating } from "../api/show";

type IffRulePartKind = "all" | "hasRating" | "hasAnyTagsIn" | "hasAnyTagsLike";

type ThenRulePartKind =
  | "all"
  | "fail"
  | "hasRating"
  | "hasAnyTagsIn"
  | "hasAnyTagsLike";

export type RulePartKind = IffRulePartKind | ThenRulePartKind;

interface RulePart {
  type: RulePartKind;
}

interface IfRulePart extends RulePart {
  type: IffRulePartKind;
}

interface ThenRulePart extends RulePart {
  type: ThenRulePartKind;
}

interface FailThenRulePart extends ThenRulePart {
  type: "fail";
}

interface HasRatingRulePart extends RulePart {
  type: "hasRating";
  data: Rating;
}

interface HasAnyTagsLikeRulePart extends RulePart {
  type: "hasAnyTagsLike";
  data: string[];
}

interface HasAnyTagsInRulePart extends RulePart {
  type: "hasAnyTagsIn";
  data: string[];
}

export interface Rule {
  if: IfRulePart;
  then: ThenRulePart[];
}

interface Selector<T1, T2> {
  (t: T1, idx: number): T2;
}

const defaultSelector = (x: any, idx: number): any => {
  if (typeof x === "string") {
    return x;
  }
  return <Fragment key={idx}>{x}</Fragment>;
};

function _arrayToFragment<T1, T2>(
  terms: any[],
  options: {} = {},
  selector: Selector<T1, T2> = defaultSelector
) {
  if (!terms || terms.length === 0) return [];

  const localOptions = {
    separator: ", ",
    finalSeparator: " or ",
    ...options
  };

  const n = terms.length;

  const results: (T2 | string)[] = [];
  terms.forEach((t, idx) => {
    results.push(selector(t, idx));
    if (idx === n - 1) return;
    if (idx === n - 2) {
      results.push(localOptions.finalSeparator);
      return;
    }

    results.push(localOptions.separator);
  });

  return results;
}

const RuleText = (props: Rule) => {
  const linkSelector = (x: string, idx: number) => {
    return (
      <Link key={idx} to={`/tag/${x}`}>
        {x}
      </Link>
    );
  };

  const renderIffTagsIn = (rulePart: HasAnyTagsInRulePart) => {
    return (
      <>
        All media with the tag&nbsp;
        {_arrayToFragment(rulePart.data, {}, linkSelector)}
      </>
    );
  };

  const renderThenTagsIn = (rulePart: HasAnyTagsInRulePart) => {
    return (
      <>
        should have one of the tags&nbsp;
        {_arrayToFragment(rulePart.data, {}, linkSelector)}
      </>
    );
  };

  const renderIf = (iff: IfRulePart) => {
    switch (iff.type) {
      case "all":
        return "All media";
      case "hasRating":
        return `All media with rating ${(iff as HasRatingRulePart).data}`;
      case "hasAnyTagsIn":
        return renderIffTagsIn(iff as HasAnyTagsInRulePart);
      case "hasAnyTagsLike":
        return `All media with a tag like ${_arrayToFragment(
          (iff as HasAnyTagsLikeRulePart).data
        )}`;
    }
  };

  const renderThen = (then: ThenRulePart) => {
    const _thenTextHasRating = (p: HasRatingRulePart): string => {
      if (p.data) {
        return `should have a rating of ${p.data}`;
      }
      return "should have a rating";
    };

    switch (then.type) {
      case "fail":
        return "should not exist";
      case "all":
        return "should never happen";
      case "hasRating":
        return _thenTextHasRating(then as HasRatingRulePart);
      case "hasAnyTagsIn":
        return renderThenTagsIn(then as HasAnyTagsInRulePart);
      case "hasAnyTagsLike":
        return `should have a tag like ${_arrayToFragment(
          (then as HasAnyTagsLikeRulePart).data
        ).join("")}`;
    }
  };

  const renderThens = (thens: ThenRulePart[]) => {
    const thensTexts = thens.map(renderThen);
    return _arrayToFragment(thensTexts, { finalSeparator: " and " });
  };

  return (
    <>
      {renderIf(props.if)}
      &nbsp;
      {renderThens(props.then)}.
    </>
  );
};

export { RuleText };
