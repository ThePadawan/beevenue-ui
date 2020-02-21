import React, { Component } from "react";
import { Api } from "../../api/api";

class TagRatingControl extends Component<any, any, any> {
  public constructor(props: any) {
    super(props);
    this.state = { ...this.props };
  }

  private onRatingChange = (newRating: string) => {
    Api.Tags.patch(this.state.tag.tag, { rating: newRating }).then(success => {
      this.setState({ ...this.state, tag: success.data });
    });
  };

  ratingElement = (rating: string) => {
    const name = `${this.props.prefix}-tag-${this.state.tag.tag}`;
    const id = `${name}-rating-${rating}`;
    return (
      <div className="beevenue-tag-rating" key={id}>
        <input
          className="is-checkradio"
          type="radio"
          checked={this.state.tag.rating === rating}
          name={name}
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
