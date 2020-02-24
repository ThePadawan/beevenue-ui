import React, { Component } from "react";
import qs from "qs";
import { Location } from "history";

import { BeevenuePage } from "./beevenuePage";
import { MediumWallPagination } from "../fragments/mediumWallTypes";
import { Api, LoadMediaParameters } from "../api/api";
import { connect } from "react-redux";
import {
  isSessionSfw,
  getLoggedInUser,
  BeevenueUser,
  Unknown,
  Anonymous
} from "../redux/reducers/login";
import { redirect, setShouldRefresh } from "../redux/actions";
import { getLastFileUploaded } from "../redux/reducers/fileUpload";
import { paginationParamsFromQuery } from "./pagination";
import { shouldRefresh } from "../redux/reducers/refresh";
import { isSpeedTagging } from "../redux/reducers/speedTagging";

const MediumWall = React.lazy(() => import("../fragments/mediumWall"));

interface IndexPageProps {
  loggedInUser: BeevenueUser;
  isSessionSfw: boolean;
  isSpeedTagging: boolean;
  media: MediumWallPagination;
  location: Location;
  redirect: typeof redirect;
  shouldRefresh: boolean;
  setShouldRefresh: typeof setShouldRefresh;

  lastFileUploaded: number | null;
}

class IndexPage extends Component<IndexPageProps, any, any> {
  public constructor(props: IndexPageProps) {
    super(props);
    this.state = { media: null };
  }

  componentDidMount = () => {
    this.loadDefaultMedia();
  };

  componentDidUpdate = (prevProps: IndexPageProps, _: any) => {
    if (prevProps.isSessionSfw !== this.props.isSessionSfw) {
      this.loadDefaultMedia();
      return;
    }

    if (prevProps.location.search !== this.props.location.search) {
      this.loadDefaultMedia();
      return;
    }

    if (
      (prevProps.lastFileUploaded || -Infinity) <
      (this.props.lastFileUploaded || -Infinity)
    ) {
      this.loadDefaultMedia();
      return;
    }

    if (prevProps.loggedInUser !== this.props.loggedInUser) {
      if (
        this.props.loggedInUser !== Anonymous &&
        this.props.loggedInUser !== Unknown
      ) {
        this.loadDefaultMedia();
      } else {
        this.clearMedia();
      }
      return;
    }

    if (
      prevProps.shouldRefresh !== this.props.shouldRefresh &&
      this.props.shouldRefresh
    ) {
      this.props.setShouldRefresh(false);
      this.loadDefaultMedia();
      return;
    }
  };

  private clearMedia = () => {
    this.setState({ media: null });
  };

  private get currentQueryString(): any {
    return qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
  }

  private loadDefaultMedia = () => {
    let q = this.currentQueryString;
    const paginationParams = paginationParamsFromQuery(q);
    this.loadMedia(paginationParams);
  };

  private loadMedia = (params: LoadMediaParameters) => {
    this.clearMedia();
    Api.loadMedia(params).then(
      res => {
        this.setState({ media: res.data });
      },
      _ => {}
    );
  };

  render = () => {
    const inner =
      this.props.loggedInUser === Anonymous ? null : (
        <MediumWall media={this.state.media} {...this.props} />
      );

    return <BeevenuePage {...this.props}>{inner}</BeevenuePage>;
  };
}

const mapStateToProps = (state: any) => {
  return {
    shouldRefresh: shouldRefresh(state.refresh),
    lastFileUploaded: getLastFileUploaded(state.fileUpload),
    loggedInUser: getLoggedInUser(state.login),
    isSpeedTagging: isSpeedTagging(state.speedTagging),
    isSessionSfw: isSessionSfw(state.login)
  };
};

const x = connect(mapStateToProps, { redirect, setShouldRefresh })(IndexPage);
export { x as IndexPage };
