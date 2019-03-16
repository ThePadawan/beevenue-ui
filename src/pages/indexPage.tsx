import React, { Component } from "react";
import qs from "qs";
import { Location } from "history";

import { BeevenuePage } from "./beevenuePage";
import { MediumWall, MediumWallPagination } from "../fragments/mediumWall";
import { Api, LoadMediaParameters } from "../api/api";
import { connect } from "react-redux";
import {
  isSessionSfw,
  getLoggedInUser,
  BeevenueUser,
  Unknown,
  Anonymous
} from "../redux/reducers/login";
import { redirect } from "../redux/actions";
import { getLastFileUploaded } from "../redux/reducers/fileUpload";
import { paginationParamsFromQuery } from "./pagination";

interface IndexPageProps {
  loggedInUser: BeevenueUser;
  isSessionSfw: boolean;
  media: MediumWallPagination;
  location: Location;
  redirect: typeof redirect;

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
    return (
      <BeevenuePage {...this.props}>
        <MediumWall media={this.state.media} {...this.props} />
      </BeevenuePage>
    );
  };
}

const mapStateToProps = (state: any) => {
  return {
    lastFileUploaded: getLastFileUploaded(state.fileUpload),
    loggedInUser: getLoggedInUser(state.login),
    isSessionSfw: isSessionSfw(state.login)
  };
};

const x = connect(
  mapStateToProps,
  { redirect }
)(IndexPage);
export { x as IndexPage };
