import React, { Component } from "react";
import qs from "qs";
import {Location} from "history";

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

    if ((prevProps.lastFileUploaded || -Infinity) < (this.props.lastFileUploaded || -Infinity)) {
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
    // TODO Buncha duplicated code with searchResultsPage.
    let q = this.currentQueryString;

    let pageNumber: number = parseInt(q.pageNr, 10) || 1;
    if (pageNumber < 1) pageNumber = 1;

    let pageSize: number = parseInt(q.pageSize, 10) || 10;
    if (pageSize < 10) pageSize = 10;
    if (pageSize > 100) pageSize = 100;

    this.loadMedia({
      pageNumber: pageNumber,
      pageSize: pageSize
    });
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

  onPageSelect = (n: number): void => {
    this.addToQs({ pageNr: n });
  };

  private addToQs(q: object) {
    const currentLocation = this.props.location;
    const currentQs = this.currentQueryString;
    const newQs = { ...currentQs, ...q };
    const newLocation = {
      ...currentLocation,
      search: qs.stringify(newQs, { addQueryPrefix: true })
    };

    this.props.redirect(newLocation.pathname + newLocation.search);
  }

  onPageSizeSelect = (n: number): void => {
    this.addToQs({ pageSize: n });
  };

  render = () => {
    return (
      <BeevenuePage {...this.props}>
        <MediumWall
          location={this.props.location}
          media={this.state.media}
          onPageSelect={n => this.onPageSelect(n)}
          onPageSizeSelect={n => this.onPageSizeSelect(n)}
        />
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
