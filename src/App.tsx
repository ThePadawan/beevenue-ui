import React, { Component } from "react";
import "bulma/css/bulma.min.css";
import "bulma-switch/dist/css/bulma-switch.min.css";
import "bulma-checkradio/dist/css/bulma-checkradio.min.css";
import "bulma-tagsinput/dist/css/bulma-tagsinput.min.css";
import "react-tagsinput/react-tagsinput.css";
import "./styles/index.scss";

import { Provider } from "react-redux";

import store from "./redux/store";
import { AppRouter } from "./appRouter";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );
  }
}

export default App;
