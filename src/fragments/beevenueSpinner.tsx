import React, { Component } from "react";
// This partial import is ugly, but reduces bundle size.
//@ts-ignore
import RingLoader from "react-spinners/RingLoader";

class BeevenueSpinner extends Component<any, {}, {}> {
  public constructor(props: any) {
    super(props);
  }

  render() {
    return <RingLoader {...this.props} />;
  }
}

export { BeevenueSpinner };
