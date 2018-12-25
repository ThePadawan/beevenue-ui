import React, { Component } from "react";
import { RingLoader } from "react-spinners";

class BeevenueSpinner extends Component<any, any, any> {
  public constructor(props: any) {
    super(props);
  }

  render() {
    return <RingLoader />;
  }
}

export { BeevenueSpinner };
