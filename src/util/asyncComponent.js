import React, { Component } from "react";
// import Nprogress from "nprogress";
import ReactPlaceholder from "react-placeholder";
import "nprogress/nprogress.css";
import "react-placeholder/lib/reactPlaceholder.css";
import CircularProgress from "components/CircularProgress";

export default function asyncComponent(importComponent) {
  class AsyncFunc extends Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null,
      };
      this.mounted = false; // Initialize this.mounted in constructor
    }

    // Remove componentWillMount

    componentWillUnmount() {
      this.mounted = false;
    }

    async componentDidMount() {
      this.mounted = true;
      // Nprogress.start(); // Move Nprogress.start() here
      const { default: Component } = await importComponent();
      // Nprogress.done();
      if (this.mounted) {
        this.setState({
          component: <Component {...this.props} />,
        });
      }
    }

    render() {
      const Component = this.state.component || <CircularProgress />;
      return (
        <ReactPlaceholder type="text" rows={7} ready={Component !== null}>
          {Component}
        </ReactPlaceholder>
      );
    }
  }

  return AsyncFunc;
}
