import React, { Component } from "react";
import {Link, NavLink} from "react-router-dom";

// Styles
import "./assets/styles/HorizontalMenu.css";

export default class HorizontalMenu extends Component {
  render() {
    return (
      <div className="horizontal-main clearfix">
        <div className="horizontal-mainwrapper container clearfix">
          <div className="overlapblackbg"></div>
          <nav className="horizontalMenu clearfix">
            <ul className="horizontalMenu-list">
              <li aria-haspopup="false">
                <NavLink to="/app" exact activeClassName="active">
                  <i className="fa fa-comments" /> Dashboard
                </NavLink>
              </li>
              {this.props.isManager === 'manager' ? (
              <li aria-haspopup="false">
                <NavLink to="/app/gmdashboard" activeClassName="active">
                <i className="fa fa-dashboard" /> GM Dashboard
                </NavLink>
              </li>
              ) : null}
              {this.props.isManager === "manager" || this.props.accessLevelId ? (
                <li aria-haspopup="false">
                  <NavLink to="/app/people" activeClassName="active">
                    <i className="fa fa-users" /> People
                  </NavLink>
                </li>
              ) : null}
              <li aria-haspopup="false">
                <NavLink to="/app/schedule" activeClassName="active">
                  <i className="fa fa-calendar" /> Schedule
                </NavLink>
              </li>
              <li aria-haspopup="false">
                <NavLink to="/app/profile" activeClassName="active">
                  <i className="fa fa-user" /> Profile
                </NavLink>
              </li>
              {this.props.isManager === 'manager' ? (
              <li aria-haspopup="false">
                <NavLink to="/app/reports" activeClassName="active">
                  <i className="fa fa-line-chart" /> Reports
                </NavLink>
              </li>
              ) : null}
              <li aria-haspopup="false">
                <NavLink to="/app/settings" activeClassName="active">
                  <i className="fa fa-cog" /> Settings
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
