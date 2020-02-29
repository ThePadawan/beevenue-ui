import React, { useState } from "react";
import { Api } from "../../api/api";
import { Tag } from "../../tag";

interface TagRatingControlProps {
  tag: Tag;
  prefix: string;
}

const TagRatingControl = (props: TagRatingControlProps) => {
  const [tag, setTag] = useState<Tag>(props.tag);

  const onRatingChange = (newRating: string) => {
    Api.Tags.patch(tag.tag, { rating: newRating }).then(success => {
      setTag(success.data);
    });
  };

  const ratingElement = (rating: string) => {
    const name = `${props.prefix}-tag-${tag.tag}`;
    const id = `${name}-rating-${rating}`;
    return (
      <div className="beevenue-tag-rating" key={id}>
        <input
          className="is-checkradio"
          type="radio"
          checked={tag.rating === rating}
          name={name}
          onChange={e => onRatingChange(e.target.value)}
          value={rating}
          id={id}
        />
        <label htmlFor={id}>{rating}</label>
      </div>
    );
  };

  return <>{["s", "q", "e"].map(ratingElement)}</>;
};

export { TagRatingControl };
