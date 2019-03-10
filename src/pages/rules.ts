import { Rating } from "../api/show";

export type RulePartKind =
  | "all"
  | "hasRating"
  | "hasAnyTagsIn"
  | "hasAnyTagsLike";

interface RulePart {
  type: RulePartKind;
}

interface AllRulePart extends RulePart {
  type: "all";
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

interface Rule {
  if: RulePart;
  then: RulePart[];
}

const _arrayToFragment = (terms: string[], options: {} = {}): string => {
  if (!terms || terms.length == 0) return "";

  const localOptions = {
    separator: ", ",
    finalSeparator: " or ",
    ...options
  };

  const n = terms.length;

  const results: string[] = [];
  terms.forEach((t, idx) => {
    results.push(t);
    if (idx === n - 1) return;
    if (idx === n - 2) {
      results.push(localOptions.finalSeparator);
      return;
    }

    results.push(localOptions.separator);
  });

  return results.join("");
};

const _ifTextAll = (): string => {
  return "All media";
};

const _ifTextHasRating = (p: HasRatingRulePart): string => {
  return `All media with rating ${p.data}`;
};

const _ifTextHasAnyTagsIn = (p: HasAnyTagsInRulePart): string => {
  return `All media with the tag ${_arrayToFragment(p.data)}`;
};

const _ifTextHasAnyTagsLike = (p: HasAnyTagsLikeRulePart): string => {
  return `All media with a tag like ${_arrayToFragment(p.data)}`;
};

const _ifText = (rulePart: RulePart): string => {
  switch (rulePart.type) {
    case "all":
      return _ifTextAll();
    case "hasRating":
      return _ifTextHasRating(rulePart as HasRatingRulePart);
    case "hasAnyTagsIn":
      return _ifTextHasAnyTagsIn(rulePart as HasAnyTagsInRulePart);
    case "hasAnyTagsLike":
      return _ifTextHasAnyTagsLike(rulePart as HasAnyTagsLikeRulePart);
  }
};

const _thenTextHasRating = (p: HasRatingRulePart): string => {
  return `should have a rating of ${p.data}`;
};

const _thenTextHasAnyTagsIn = (p: HasAnyTagsInRulePart): string => {
  return `should have one of the tags ${_arrayToFragment(p.data)}`;
};

const _thenTextHasAnyTagsLike = (p: HasAnyTagsLikeRulePart): string => {
  return `should have a tag like ${_arrayToFragment(p.data)}`;
};

const _thenText = (rulePart: RulePart): string => {
  switch (rulePart.type) {
    case "all":
      return "should never happen";
    case "hasRating":
      return _thenTextHasRating(rulePart as HasRatingRulePart);
    case "hasAnyTagsIn":
      return _thenTextHasAnyTagsIn(rulePart as HasAnyTagsInRulePart);
    case "hasAnyTagsLike":
      return _thenTextHasAnyTagsLike(rulePart as HasAnyTagsLikeRulePart);
  }
};

export const displayText = (rule: Rule): string => {
  // TODO Thens, comma-separated
  const thensTexts = rule.then.map(_thenText);
  const thensText = _arrayToFragment(thensTexts, { finalSeparator: ' and ' })
  return `${_ifText(rule.if)} ${thensText}.`;
};