import React, { Component } from "react";
import {Link, NavLink} from "react-router-dom";
import { UncontrolledDropdown, DropdownItem, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import moment from "moment";

// Components
import HorizontalMenu from "../HorizontalMenu";

// Services11


// Styles
import "./assets/styles/Navbar.css";
import Tooltip from "../Tooltip";
import StringHelper from "../../../helpers/StringHelper";


// Images
const logo = `${process.env.REACT_APP_API_GATEWAY_ENDPOINT}/logo-symbol-color.png`;

export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      user: {},
      notifications: [],
      messages: [],
      readNotifications: false,
    };
  }

  toggle() {
    this.setState(
      {
        dropdownOpen: !this.state.dropdownOpen,
      },
      () => {
        if (
          !this.state.readNotifications &&
          this.state.notifications.filter(notification => !notification.isRead).length
        ) {
          
          this.setState({
            readNotifications: true,
          });
        } else if (this.state.readNotifications) {
          this.setState({
            readNotifications: false,
            notifications: this.state.notifications.map(notification => ({ ...notification, isRead: 1 })),
          });
        }
      }
    );
  }



  connect() {
    this.socket = new WebSocket(
      `${process.env.REACT_APP_API_GATEWAY_SOCKET_ENDPOINT}?token=${sessionStorage.getItem("token")}`
    );
    this.socket.addEventListener("message", message => {
      const notification = {
        id: `new-${this.state.notifications.length}`,
        isRead: null,
        body: message.data,
      };
      this.setState({
        notifications: (message.data && [notification, ...this.state.notifications]) || [],
      });
    });
  }

  toggleSidebar = () => {
    let { classList = "" } = document.getElementsByTagName("body")[0];
    const parsedClassList = classList.toString();

    if(parsedClassList.indexOf("sidebar-gone active") !== -1){
      classList.remove("sidebar-gone", "active");
    } else {
      classList.add("sidebar-gone", "active");
    }
  }

  componentDidMount() {
    
    this.connect();
  }

  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg main-navbar" id="headerMenuCollapse">
          <div className="container">
            <a id="horizontal-navtoggle" onClick={this.toggleSidebar} className="animated-arrow mr-1"><span></span></a>
            <a className="header-brand mr-auto" href="/">
              <img src={logo} className="navbar-brand header-brand-img" alt="Logo" />
            </a>

            <ul className="navbar-nav navbar-right">
              <li className="d-block d-md-none">
                <NavLink to="/app/messages" exact className="nav-link nav-link-lg pointer">
                  <i className="fa fa-envelope-o" />
                  {!this.state.dropdownOpen && !!this.state.messages.filter(message => message.isRead === 0 && message.users.map(u =>u.id).includes(this.state.user.id)).length && (
                    <span className="pulse bg-danger" />
                  )}
                </NavLink>
              </li>
              <li className="d-block d-md-none">
                <NavLink to="/app/notifications/all" exact className="nav-link nav-link-lg pointer">
                  <i className="fa fa-bell-o" />
                  {!this.state.dropdownOpen &&
                    !!this.state.notifications.filter(notification => !notification.isRead).length && (
                      <span className="pulse bg-danger" />
                    )}
                </NavLink>
              </li>

              <UncontrolledDropdown
                className="d-none d-md-block"
                setActiveFromChild
              >

                <DropdownToggle tag="li" className="nav-link nav-link-lg pointer">
                  <i className="fa fa-envelope-o" />
                  {!this.state.dropdownOpen && !!this.state.messages.filter(message => message.isRead === 0 && message.users.map(u =>u.id).includes(this.state.user.id)).length && (
                    <span className="pulse bg-danger" />
                  )}
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu dropdown-list" right>
                  <DropdownItem header>
                    Messages
                    <div className="float-right">
                      <Link to="/app/messages">View All</Link>
                    </div>
                  </DropdownItem>

                  {this.state.messages.map(message => (
                    <DropdownItem key={message.id} className={!message.isRead ? "new-notification" : ""}>
                      <Link to={`/app/messages/${message.replyOf}`}>
                        <React.Fragment>
                            <div className="dropdownmsg d-flex mt-0">
                              <div className="media">
                                <div className="media-left">

                                  <Tooltip  placement="top" text={`${message.groupName}`}>
                                    <div className="img h-post-details-initials">
                                      {message.isGroup ? <i className="fa fa-group message-icon"/> : `${message.firstName[0]} ${message.lastName[0]}`}
                                    </div>
                                  </Tooltip>
                                </div>
                                <div className="media-body">
                                  <div className="media-heading text-truncate">
                                    {!message.isRead ? (
                                      <b>
                                        {StringHelper.textTruncate(message.groupName, 30)}
                                      </b>
                                      ) : (
                                      <span>
                                        {StringHelper.textTruncate(message.groupName, 30)}
                                      </span>
                                    )}
                                  </div>
                                  <p className="msg">{message.you} {message.body}</p>
                                  <small className="text-muted">
                                    <time className="hidden-sm-down" dateTime="2017">
                                      {moment(message.createdAt).fromNow()}
                                    </time>
                                  </small>
                                </div>
                              </div>
                            </div>
                        </React.Fragment>
                      </Link>
                    </DropdownItem>
                  ))}

                  {!this.state.messages.length && (
                    <DropdownItem>
                      <div className="dropdown-item-desc ml-0">
                        <b>No new messages</b>
                      </div>
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>

              <Dropdown
                isOpen={this.state.dropdownOpen}
                toggle={this.toggle}
                className="d-none d-md-block"
              >
                <DropdownToggle tag="li" className="nav-link nav-link-lg pointer">
                  <i className="fa fa-bell-o" />
                  {!this.state.dropdownOpen &&
                    !!this.state.notifications.filter(notification => !notification.isRead).length && (
                      <span className="pulse bg-danger" />
                    )}
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu dropdown-list" right>
                  <DropdownItem tag="div" header>
                    Notifications
                    {this.state.user.role === "manager" && (
                      <div className="float-right">
                        <Link to="/app/notifications/all">View All</Link>
                      </div>
                    )}
                  </DropdownItem>

                  {this.state.notifications.map(notification => (
                    <DropdownItem key={notification.id} className={!notification.isRead ? "new-notification" : ""}>
                      {!notification.isRead ? (
                        <Link to={`/app/notification/${notification.id}`}>
                          <i className="fa fa-clock-o text-primary" />
                          <div className="dropdown-item-desc">
                            <b>{notification.body}</b>
                          </div>
                          <div className="time">{moment(notification.createdAt).fromNow()}</div>
                        </Link>
                      ) : (
                        <Link to={`/app/notification/${notification.id}`}>
                          <i className="fa fa-clock-o text-dark" />
                          <div className="dropdown-item-desc">
                            <span>{notification.body}</span>
                          </div>
                          <div className="time">{moment(notification.createdAt).fromNow()}</div>
                        </Link>
                      )}
                    </DropdownItem>
                  ))}

                  {!this.state.notifications.length && (
                    <DropdownItem>
                      <div className="dropdown-item-desc ml-0">
                        <b>No new notifications</b>
                      </div>
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>

              <UncontrolledDropdown
                setActiveFromChild
              >
                <DropdownToggle tag="a" className="nav-link pt-2" caret>
                  {/* <img src="https://via.placeholder.com/150" alt="profile-user" className="rounded-circle w-32" /> */}
                  <div className="d-sm-none d-lg-inline-block ml-2 mt-1">
                    {this.state.user.firstName} {this.state.user.lastName}
                  </div>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem className="p-0">
                    <Link to="/app/settings" role="menuitem" className="dropdown-item has-icon">
                      <i className="fa fa-cog" /> Settings
                    </Link>
                  </DropdownItem>
                  <DropdownItem className="p-0">
                    <Link to="/app/profile" role="menuitem" className="dropdown-item has-icon">
                      <i className="fa fa-user" /> My Profile
                    </Link>
                  </DropdownItem>
                  <DropdownItem tag="a" onClick={  this.props.logoutUser  } className="dropdown-item has-icon">
                    <i className="ion-ios-redo" /> Sign out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </ul>
          </div>
        </nav>
        <HorizontalMenu isManager={this.state.user.role} isSuperUser={this.state.user.isSuperUser} accessLevelId={this.state.user.accessLevelId} />
      </React.Fragment>
    );
  }
}
