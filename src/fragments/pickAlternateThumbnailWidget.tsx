import React, { Component } from "react";
import { Api } from "../api/api";
import { BeevenueSpinner } from "./beevenueSpinner";
import { ShowViewModel } from "../api/show";

interface PickAlternateThumbnailWidgetState {
  isLoading: boolean;
  pickCount: number;
  picks: string[] | null;
}

class PickAlternateThumbnailWidget extends Component<
  ShowViewModel,
  PickAlternateThumbnailWidgetState,
  any
> {
  public constructor(props: ShowViewModel) {
    super(props);
    this.state = { isLoading: false, pickCount: 5, picks: null };
  }

  private onChange = (e: any) => {
    this.setState({ ...this.state, pickCount: e });
  };

  private onClick = () => {
    this.startLoading();
    Api.Medium.generateThumbnailPicks(this.props.id, this.state.pickCount).then(
      success => {
        this.setState({
          ...this.state,
          isLoading: false,
          picks: success.data.thumbs
        });
      }
    );
  };

  private startLoading = () => {
    this.setState({ ...this.state, isLoading: true });
  };

  private choosePick = (i: number) => {
    if (!this.state.picks) {
      return;
    }

    this.startLoading();
    Api.Medium.selectThumbnailPick(
      this.props.id,
      i,
      this.state.picks.length
    ).then(success => {
      this.setState({ ...this.state, isLoading: false, picks: null });
    });
  };

  private renderPicks = () => {
    if (!this.state.picks) {
      return null;
    }

    // TODO Styling
    return this.state.picks.map((p: any, i: number) => {
      return (
        <img
          key={`pick${i}`}
          onClick={_ => this.choosePick(i)}
          src={`data:image/png;base64, ${p}`}
        />
      );
    });
  };

  private renderContent = () => {
    if (this.state.isLoading) {
      return <BeevenueSpinner />;
    }

    return (
      <>
        <div>
          Generate&nbsp;
          <div className="select">
            <select
              defaultValue="5"
              onChange={e => this.onChange(e.currentTarget.value)}
            >
              <option>3</option>
              <option>5</option>
              <option>10</option>
            </select>
          </div>
          &nbsp;new thumbnails:&nbsp;
          <button className="button is-primary" onClick={e => this.onClick()}>
            Go
          </button>
        </div>
        <div>{this.renderPicks()}</div>
      </>
    );
  };

  render() {
    if (!/^video/.test(this.props.mime_type)) {
      return null;
    }

    return (
      <div className="card beevenue-sidebar-card">
        <header className="card-header">
          <p className="card-header-title">Pick alternate thumbnail</p>
        </header>
        <div className="card-content">
          <div className="content">{this.renderContent()}</div>
        </div>
      </div>
    );
  }
}

export { PickAlternateThumbnailWidget };
