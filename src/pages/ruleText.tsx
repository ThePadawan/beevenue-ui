import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Rating } from "../api/show";
import { SSL_OP_NO_TLSv1_1 } from "constants";
import { random } from "lodash-es";

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
  if (!terms || terms.length == 0) return [];

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

class RuleText extends Component<Rule, any, any> {
  public constructor(props: any) {
    super(props);
  }

  private linkSelector = (x: string, idx: number) => {
    return (
      <Link key={idx} to={`/tag/${x}`}>
        {x}
      </Link>
    );
  };

  private renderIffTagsIn = (rulePart: HasAnyTagsInRulePart) => {
    return (
      <>
        All media with the tag&nbsp;
        {_arrayToFragment(rulePart.data, {}, this.linkSelector)}
      </>
    );
  };

  private renderThenTagsIn = (rulePart: HasAnyTagsInRulePart) => {
    return (
      <>
        should have one of the tags&nbsp;
        {_arrayToFragment(rulePart.data, {}, this.linkSelector)}
      </>
    );
  };

  private renderIf = (iff: IfRulePart) => {
    switch (iff.type) {
      case "all":
        return "All media";
      case "hasRating":
        return `All media with rating ${(iff as HasRatingRulePart).data}`;
      case "hasAnyTagsIn":
        return this.renderIffTagsIn(iff as HasAnyTagsInRulePart);
      case "hasAnyTagsLike":
        return `All media with a tag like ${_arrayToFragment(
          (iff as HasAnyTagsLikeRulePart).data
        )}`;
    }
  };

  private renderThen = (then: ThenRulePart) => {
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
        return this.renderThenTagsIn(then as HasAnyTagsInRulePart);
      case "hasAnyTagsLike":
        return `should have a tag like ${_arrayToFragment(
          (then as HasAnyTagsLikeRulePart).data
        ).join("")}`;
    }
  };

  private renderThens = (thens: ThenRulePart[]) => {
    const thensTexts = thens.map(this.renderThen);
    return _arrayToFragment(thensTexts, { finalSeparator: " and " });
  };

  render() {
    return (
      <>
        {this.renderIf(this.props.if)}
        &nbsp;
        {this.renderThens(this.props.then)}.
      </>
    );
  }
}

export { RuleText };
