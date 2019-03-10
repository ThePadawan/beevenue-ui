import React, { Component } from "react";
import { Link } from "react-router-dom";

class LinksPanel extends Component {
  render() {
    return (
      <div className="card beevenue-sidebar-card">
        <div className="card-header">
          <p className="card-header-title">Links</p>
        </div>
        <div className="card-content">
          <ul>
            <li><Link to="/upload">Batch upload</Link></li>
            <li><Link to="/tags">Tag statistics</Link></li>
            <li><Link to="/problems">Investigate problems</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

export { LinksPanel };
