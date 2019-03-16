import React, { Component } from "react";
import { RingLoader, ReactSpinners } from "react-spinners";

interface BeevenueSpinnerProps extends ReactSpinners.RingLoaderProps {}

class BeevenueSpinner extends Component<BeevenueSpinnerProps, {}, {}> {
  public constructor(props: BeevenueSpinnerProps) {
    super(props);
  }

  render() {
    return <RingLoader {...this.props} />;
  }
}

export { BeevenueSpinner };
