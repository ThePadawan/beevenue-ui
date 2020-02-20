import React, { Component } from "react";
import { Api } from "../../api/api";

class TagRatingControl extends Component<any, any, any> {
  public constructor(props: any) {
    super(props);
    this.state = { ...this.props };
  }

  private onRatingChange = (newRating: string) => {
    console.log(this.state.tag.tag, newRating);
    // RS2RS Partial patch on tag
    Api.Tags.patch(this.state.tag.tag, { rating: newRating }).then(success => {
      this.setState({ ...this.state, tag: success.data });
    });
  };

  ratingElement = (rating: string) => {
    const id = `tag-${this.state.tag.id}-rating-${rating}`;
    return (
      <div className="beevenue-tag-rating" key={id}>
        <input
          className="is-checkradio"
          type="radio"
          checked={this.state.tag.rating === rating}
          name="currentRating"
          onChange={e => this.onRatingChange(e.target.value)}
          value={rating}
          id={id}
        />
        <label htmlFor={id}>{rating}</label>
      </div>
    );
  };

  render() {
    return <>{["s", "q", "e"].map(this.ratingElement)}</>;
  }
}

export { TagRatingControl };
