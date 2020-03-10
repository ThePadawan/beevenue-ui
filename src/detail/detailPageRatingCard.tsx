import React from "react";
import { ShowViewModel, Rating } from "../api/show";

const fullRating = (r: Rating): string => {
  const dict = {
    u: "Unknown",
    s: "Safe",
    q: "Questionable",
    e: "Explicit"
  };

  return dict[r];
};

interface DetailPageRatingCardProps {
  viewModel: ShowViewModel;
  userIsAdmin: boolean;
  onRatingChange: (x: any) => void;
}

const ratingElementFor = (
  props: DetailPageRatingCardProps,
  r: Rating
): JSX.Element => {
  const rating = fullRating(r);
  const id = `currentRating${rating}`;
  return (
    <div className="beevenue-rating" key={id}>
      <input
        className="is-checkradio"
        type="radio"
        disabled={props.userIsAdmin ? undefined : true}
        checked={props.viewModel.rating === r}
        name="currentRating"
        onChange={e => props.onRatingChange(e.target.value)}
        value={r}
        id={id}
      />
      <label htmlFor={id}>{rating}</label>
    </div>
  );
};

const DetailPageRatingCard = (props: DetailPageRatingCardProps) => {
  const { viewModel } = props;

  if (!viewModel.rating) {
    return null;
  }

  const ratings: Rating[] = ["s", "q", "e"];

  return (
    <div className="card">
      <div className="card-content">
        <div className="content">
          <div className="field beevenue-ratings">
            {ratings.map(r => ratingElementFor(props, r))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { DetailPageRatingCard };
