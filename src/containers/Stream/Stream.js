import React from "react";
import moment from "moment";
import {Link, NavLink} from "react-router-dom";
import Collapsible from "react-collapsible";

import {connect} from 'react-redux';

//import weather from "openweather-apis";
import "../../components/FileUpload/index.css";
import CommentForm from "../../components/Forms/CommentForm";
import ReactPlayer from 'react-player'
//import userService from "../../services/UserService";

// Services
//import PostService from "../../services/PostService";
// import DashboardService from "../../services/DashboardService";

// Helpers
import StringHelper from "../../helpers/StringHelper";

// Styles
import "./assets/styles/Stream.css";

// Images
import quarterBg from "./../../general/assets/images/equinox-bldg-darker.jpg";
import Axios from "axios";
import Upload from "../../components/Upload";


// Actions
import {getPosts} from '../../store/actions/dashboardAction' ;


const STREAM_PAGE_MODE = {
  BROWSE: "browse",
  FETCHING: "fetching",
  SAVING: "saving",
  DELETING: "deleting",
  NO_RESULTS: "no_results",
  WITH_RESULTS: "with_results",
  WITH_ERROR: "with_error",
};

class Stream extends React.Component {
  state = {
    mode: STREAM_PAGE_MODE.BROWSE,
    user: {},
    post: {
      note: "",
      locations: [],
    },
    posts: [],
    error: "",
    locations: [],
    schedules: [],
    picture: null,
    pictureData: null,
    attachment: null,
    attachmentError: null,
    schedulesLoading: true,
    messagesLoading: true,
    weather: {
      inputElement: "",
    },
    hasImage: false,
    hasFile: false,
    reply: {
      note: "",
      postId: 0,
    },
    deletePostId: 0,
    imageRefs: [],
    myMessages: [],
    myNotifications: [],
    aws_cdn: "https://d39ape45in7xa1.cloudfront.net/",
    showVideoModal: false,
    videoUrl: '',
  };

  constructor(props) {
    super(props);
    this.onUploadFilesChanged = this.onUploadFilesChanged.bind(this);
    this.saveVideoModal = this.saveVideoModal.bind(this);
    this.createPost = this.createPost.bind(this);
  }

  createPost(event){
    event.preventDefault();
     this.props.createPost(event);
  }

  // createPost = event => {
  //   event.preventDefault();
  //   if (!this.state.post.note) return;

  //   this.setState({
  //     mode: STREAM_PAGE_MODE.SAVING,
  //   });
  //   const post = Object.assign({}, this.state.post);
  //   const { attachment } = this.state;
  //   if (attachment) {
  //     if (attachment.preview.type === 'url') {
  //       post.attachmentUrl = attachment.url;
  //     } else {
  //       post.attachment = attachment;
  //     }
  //   }
  //   PostService.createPost(post).then(() => {
  //     this.setState({
  //       post: {
  //         ...this.state.post,
  //         note: "",
  //       },
  //       picture: null,
  //       hasImage: false,
  //       hasFile: false,
  //       mode: STREAM_PAGE_MODE.BROWSE,
  //       attachment: null,
  //       attachmentError: null,
  //     });
  //     this.fetchPosts();
  //   });
  // };

  // fetchPosts = () => {
  //   PostService.fetchPosts().then(response => {
  //     this.setState({
  //       posts: response.data || [],
  //       mode: STREAM_PAGE_MODE.BROWSE,
  //       deletePostId: 0
  //     });
  //   });
  // };

  saveVideoModal = (attachment) => {
    this.setState({
      attachment
    });
  };

  onUploadFilesChanged = (files) => {
      if (files[0]) {
          this.setState({
              attachment: files[0],
          });
      } else {
          this.setState({
              attachment: null,
          })
      }
  };

  onChange = event => {
    this.setState({
      post: {
        ...this.state.post,
        note: event.target.value,
      },
    });
  };

  onChangeLocation = event => {
    this.setState({
      post: {
        ...this.state.post,
        locations: event.target.value === "all" ? this.state.locations.map(l => l.id) : [event.target.value],
      },
    });
  };

  // fetchDashboard = () => {
  //   const startDate = moment()
  //     .startOf("day")
  //     .utc()
  //     .toISOString();
  //   const endDate = moment()
  //     .endOf("day")
  //     .utc()
  //     .toISOString();
  //   DashboardService.fetchDashboard(startDate, endDate, moment().utcOffset())
  //     .then(response => {
  //       const post = {
  //         note: "",
  //         locations: response.data.locations.map(l => l.id),
  //       };
  //       this.setState({
  //         schedules: response.data.schedules,
  //         posts: response.data.posts || [],
  //         locations: response.data.locations || [],
  //         post,
  //         schedulesLoading: false,
  //       });
  //     })
  //     .catch(err => {
  //       this.setState({
  //         schedulesLoading: false,
  //       });
  //       console.log(err);
  //     });
  // };

  // getUser = () => {
  //   userService.getUser("self").then(response => {
  //     this.setState(
  //       {
  //         user: response.data.user || {},
  //         myMessages: response.data.messages || [],
  //         myNotifications: response.data.notifications || [],
  //         messagesLoading: false,
  //       },
  //       () => {
  //         this.setState({
  //           post: {
  //             ...this.state.post,
  //             locations: this.state.locations.map(l => l.id),
  //           },
  //         });
  //       }
  //     );
  //   });
  // };

  // fetchWeather = async () => {
  //   const { data = {} } = await Axios.get("https://ipapi.co/json");

  //   await weather.setLang("en");
  //   await weather.setCity(data.city);
  //   await weather.setUnits("imperial");
  //   await weather.setAPPID("6a6342c2b24512a57fbfa77512bb5de5");

  //   weather.getAllWeather((err, json) => {
  //       const retrievedWeather = json.weather && json.weather.length > 0 ? json.weather[0] : {
  //           description: "",
  //           icon: "",
  //           id: 0,
  //           main: ""
  //       };
  //       const main = json.main ? json.main : {
  //           humidity: '',
  //           pressure: '',
  //           temp: '',
  //           temp_max: '',
  //           temp_min: '',
  //       };
  //     this.setState({
  //       weather: {
  //         ...json.main,
  //         ...retrievedWeather,
  //       },
  //     });
  //   });
  // };

   componentDidMount(){
   // this.fetchDashboard();
    //this.getUser();
    //this.fetchWeather();
  }

  openComments = postId => {
    this.refs[`reply-post-${postId}`].classList.toggle("hidden");
  };
  // deletePost = postId => {
  //   this.setState({
  //     mode: STREAM_PAGE_MODE.DELETING,
  //     deletePostId: postId,
  //   });
  //   PostService.deletePost(postId).then(() => {
  //     this.fetchPosts();
  //   });
  // };
  postReply = fields => {
    const post = fields;
    const { attachment } = fields;
    this.setState({
      mode: STREAM_PAGE_MODE.SAVING,
    });
    if (attachment) {
      if (attachment.preview.type === 'url') {
        post.attachmentUrl = attachment.url;
        delete post.attachment;
      } else {
        post.attachment = attachment;
      }
    } else {
      delete post.attachment;
    }
    // PostService.replyToComment(post).then(() => {
    //   this.fetchPosts();
    // });
  };
  unLikeComment = postId => {
    // PostService.unLikeComment(postId).then(() => {
    //   this.fetchPosts();
    // });
  };
  likeComment = postId => {
    // PostService.likeComment(postId).then(() => {
    //   this.fetchPosts();
    // });
  };
  render() {
    console.log(this.state.posts);
    const { weather, myMessages, aws_cdn, attachment, myNotifications, user } = this.state;
    return (
      <div>
        <div className="container-fluid p-0">
          <div className="section">
            <div className="col-md-12 widgetb p-0">
              <div
                className="card widgetb p-0 py-5"
                style={{
                  backgroundImage: `url(${quarterBg})`,
                }}
              >
                <div className="container">
                  <div className="row justify-content-center align-items-center">
                    <div className="col-md-3 text-center">
                      <div className="d-none d-lg-block">
                        {weather.main === "Clear" && <i className="fe fe-sun weather-icon" />}
                        {weather.main === "Clouds" && <i className="fe fe-cloud weather-icon" />}
                        {weather.main === "Rain" && <i className="fe fe-cloud-rain weather-icon" />}
                        {weather.main === "Snow" && <i className="fe fe-cloud-snow weather-icon" />}
                        <div className="fs-45 text-white pt-2">
                          {Math.round(weather.temp)}
                          <sup>o</sup>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-9 text-center pr-md-5">
                      <h4 className="mb-0">
                        <span className="text-uppercase text-white">{moment(new Date()).format("dddd")}</span> <br />
                        <span className="text-white-transaprent h5">
                          {" "}
                          {moment(new Date()).format("DD")} {moment(new Date()).format("MMMM")}
                        </span>
                      </h4>
                      <div className="fs-45 stream-welcome text-white pt-2 ">
                        Welcome, {this.state.user.firstName} {this.state.user.lastName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container content-area">
          <section className="section">
            <div className="row pt-2">
              <div className="col-lg-12 col-xl-8 col-md-12 col-sm-12">
                <div className="card">
                  <div className="card-body p-4">
                    <div className="">
                      <form onSubmit={this.createPost}>
                        <textarea
                          value={this.state.post.note}
                          className="form-control pt-2"
                          placeholder="What's on your mind?"
                          rows={5}
                          onChange={this.onChange}
                        />
                        <Upload
                          attachment={attachment}
                          onUploadFilesChanged={this.onUploadFilesChanged}
                          saveVideoModal={this.saveVideoModal}
                          removeAttachment={this.removeAttachment}
                        />
                        <br />
                        <div className="row">
                          <div className="col-6 mr-auto stream-tools">
                            <select
                              className="form-control form-control-sm stream-dropdown"
                              onChange={this.onChangeLocation}
                              disabled={this.state.locations.length === 1}
                            >
                              {this.state.locations.length > 1 && <option value="all">All locations</option>}
                              {this.state.locations.map(location => (
                                <option key={location.id} value={location.id}>
                                  {location.description}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-6">
                            <button
                              type="submit"
                              className="btn btn-sm btn-success pull-right"
                              disabled={this.state.mode === STREAM_PAGE_MODE.SAVING}
                            >
                              {this.state.mode === STREAM_PAGE_MODE.SAVING ? (
                                <span>
                                  <i className="fa fa-spinner fa-spin"/> Sharing...
                                </span>

                              ): (
                                <span>
                                  <i className="fa fa-share ml-1" /> Share
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <ul className="timelineleft mb-5">
                      {/* <li className="timeleft-label">
                        <span className="bg-danger">10 May. 2018</span>
                      </li> */}
                      {this.state.posts.map(post => (
                        <li key={post.id}>
                          {post.attachment && post.attachment.length ? (
                            <>
                              {(() => {
                                switch (post.attachment[0].type) {
                                  case "video":
                                  case "video/link":
                                    return <i className="fa bg-primary fa-video-camera"/>;
                                  case "image":
                                    return <i className="fa bg-primary fa-image"/>;
                                  case "file/pdf":
                                    return <i className="fa bg-primary b-fa-file-pdf"/>;
                                  case "file/word":
                                    return <i className="fa bg-primary b-fa-file-word"/>;
                                  case "file/excel":
                                    return <i className="fa bg-primary b-fa-file-excel"/>;
                                  default:
                                    return <i className="fa bg-primary fa-envelope"/>;
                                }
                              })()}
                            {}
                            </>
                          ) : (
                            <i className="fa bg-primary fa-envelope"/>
                          )
                          }
                          <div className="timelineleft-item">
                            <span className="time">
                              <i className="fa fa-clock-o text-danger" /> {moment(post.createdOn).fromNow()}
                            </span>
                            <h3 className="timelineleft-header">
                              <a href="#">
                                {post.firstName} {post.lastName}
                              </a>
                            </h3>
                            <div className="timelineleft-body">
                              <p>{post.note}</p>
                              {post.attachment && post.attachment.length ? (
                                <>
                                  {post.attachment.map(
                                    (a, key) => {
                                      let attachment = '';
                                       if(a.type === "image"){
                                         attachment = (
                                           <img
                                             key={key}
                                             src={`${aws_cdn}${a.path}`}
                                             className="w-100 h-100"
                                             alt={`${post.firstName} ${post.lastName} attachment`}
                                           />
                                         )
                                       } else if(a.type === 'video') {
                                         attachment = (
                                           <ReactPlayer
                                             key={key}
                                             controls
                                             width={'100%'}
                                             url={`${aws_cdn}${a.path}`}
                                           />
                                         )
                                       } else if(a.type === 'video/link') {
                                         attachment = (
                                           <ReactPlayer
                                             key={key}
                                             controls
                                             width={'100%'}
                                             url={a.path}
                                           />
                                         )
                                       } else if (a.type === 'file/pdf'){
                                         attachment = (
                                           <div>
                                             <a target="_blank" key={key} href={`${aws_cdn}${a.path}`}>
                                               <span className="fileIcon color-red mr-2">
                                                 <i className="fa b-fa-file-pdf"/>
                                               </span>
                                               <span className="fileName"> {a.name}</span>
                                             </a>
                                           </div>
                                         )
                                       } else if (a.type === 'file/word'){
                                         attachment = (
                                           <div>
                                             <a target="_blank" key={key} href={`${aws_cdn}${a.path}`}>
                                               <span className="fileIcon color-blue mr-2">
                                                 <i className="fa b-fa-file-word"/>
                                               </span>
                                               <span className="fileName"> {a.name}</span>
                                             </a>
                                           </div>
                                         )
                                       } else if (a.type === 'file/excel'){
                                         attachment = (
                                           <div
                                             key={key}>
                                             <a target="_blank" key={key} href={`${aws_cdn}${a.path}`}>
                                               <span className="fileIcon color-green mr-2">
                                                 <i className="fa b-fa-file-excel"/>
                                               </span>
                                               <span className="fileName"> {a.name}</span>
                                             </a>
                                           </div>
                                         )
                                       }
                                      return attachment;
                                    }
                                  )}
                                </>
                              ) : null}
                            </div>
                            <div className="timelineleft-footer">
                              {post.likes && post.likes.filter(l => l.userId === this.state.user.id).length > 0 ? (
                                <button
                                  className="btn-link btn-sm btn-link-active mr-1"
                                  onClick={this.unLikeComment.bind(this, post.id)}
                                >
                                  <i className="fa fa-thumbs-o-up mr-1" />
                                  {(post.likes && post.likes.length) || 0}
                                </button>
                              ) : (
                                <button className="btn-link btn-sm mr-1" onClick={this.likeComment.bind(this, post.id)}>
                                  <i className="fa fa-thumbs-o-up mr-1" />
                                  {(post.likes && post.likes.length) || 0}
                                </button>
                              )}
                              <button onClick={this.openComments.bind(this, post.id)} className="btn-link">
                                <i className="fa fa-commenting-o" /> {post.reply ? post.reply.length : 0}
                              </button>
                              {
                                user.id === post.userId && (
                                  <button
                                    onClick={this.deletePost.bind(this, post.id)}
                                    className="btn-link pull-right"
                                    disabled={this.state.mode === STREAM_PAGE_MODE.DELETING && this.state.deletePostId === post.id}
                                  >
                                    {this.state.mode === STREAM_PAGE_MODE.DELETING && this.state.deletePostId === post.id ? (
                                      <span>
                                        <i className="fa fa-spinner fa-spin"/> Deleting...
                                      </span>

                                    ): (
                                      <i className="fa fa-trash-o" />
                                    )}

                                  </button>
                                )
                              }

                              <div ref={"reply-post-" + post.id} className="col-md-12 commentsblock mt-2 pb-2 hidden">
                                {post.reply &&
                                  post.reply.map((r, key) => (
                                    <div className="media" key={key}>
                                      <div className="media-left">
                                        <div className="img h-post-details-initials">
                                          {r.firstName[0]} {r.lastName[0]}
                                        </div>
                                      </div>
                                      <div className="media-body">
                                        <h4 className="media-heading">
                                          {r.firstName} {r.lastName}
                                        </h4>
                                        <p>{r.note}</p>
                                        {r.attachment && r.attachment.length ? (
                                          <p className="post-attachment">
                                            {r.attachment.map(
                                              (a, key) =>{
                                                let attachment = '';
                                                if(a.type === "image"){
                                                  attachment = (
                                                    <img
                                                      key={key}
                                                      src={`${aws_cdn}${a.path}`}
                                                      className="w-100 h-100"
                                                      alt={`${r.firstName} ${r.lastName} attachment`}
                                                    />
                                                  )
                                                } else if(a.type === 'video') {
                                                  attachment = (
                                                    <ReactPlayer
                                                      key={key}
                                                      controls
                                                      width={'100%'}
                                                      url={`${aws_cdn}${a.path}`}
                                                    />
                                                  )
                                                } else if(a.type === 'video/link') {
                                                  attachment = (
                                                    <ReactPlayer
                                                      key={key}
                                                      controls
                                                      width={'100%'}
                                                      url={a.path}
                                                    />
                                                  )
                                                } else if (a.type === 'file/pdf'){
                                                  attachment = (
                                                    <div>
                                                      <a target="_blank" key={key} href={`${aws_cdn}${a.path}`}>
                                                         <span className="fileIcon color-red mr-2">
                                                           <i className="fa b-fa-file-pdf"/>
                                                         </span>
                                                        <span className="fileName"> {a.name}</span>
                                                      </a>
                                                    </div>
                                                  )
                                                } else if (a.type === 'file/word'){
                                                  attachment = (
                                                    <div>
                                                      <a target="_blank" key={key} href={`${aws_cdn}${a.path}`}>
                                                         <span className="fileIcon color-blue mr-2">
                                                           <i className="fa b-fa-file-word"/>
                                                         </span>
                                                         <span className="fileName"> {a.name}</span>
                                                      </a>
                                                    </div>
                                                  )
                                                } else if (a.type === 'file/excel'){
                                                  attachment = (
                                                    <div>
                                                      <a target="_blank" key={key} href={`${aws_cdn}${a.path}`}>
                                                         <span className="fileIcon color-green mr-2">
                                                           <i className="fa b-fa-file-excel"/>
                                                         </span>
                                                          <span className="fileName"> {a.name}</span>
                                                      </a>
                                                    </div>
                                                  )
                                                }
                                                return attachment;
                                              }
                                            )}
                                          </p>
                                        ) : null}
                                        <ul className="nav nav-pills pull-left">
                                          <li className="post-likes">
                                            {r.likes &&
                                            r.likes.filter(l => l.userId === this.state.user.id).length > 0 ? (
                                              <button
                                                className="btn-link btn-sm btn-link-active mr-1"
                                                onClick={this.unLikeComment.bind(this, r.id)}
                                              >
                                                <i className="fa fa-thumbs-o-up mr-1" />
                                                {(r.likes && r.likes.length) || 0}
                                              </button>
                                            ) : (
                                              <button
                                                className="btn-link btn-sm mr-1"
                                                onClick={this.likeComment.bind(this, r.id)}
                                              >
                                                <i className="fa fa-thumbs-o-up mr-1" />
                                                {(r.likes && r.likes.length) || 0}
                                              </button>
                                            )}
                                          </li>
                                        </ul>
                                        <ul className="nav nav-pills pull-right">
                                          <li className="post-likes">
                                            {
                                              user.id === r.userId && (
                                                <button
                                                  onClick={this.deletePost.bind(this, r.id)}
                                                  className="btn-link pull-right"
                                                  disabled={this.state.mode === STREAM_PAGE_MODE.DELETING && this.state.deletePostId === r.id}
                                                >
                                                  {this.state.mode === STREAM_PAGE_MODE.DELETING && this.state.deletePostId === r.id ? (
                                                    <span>
                                                      <i className="fa fa-spinner fa-spin"/> Deleting...
                                                    </span>

                                                  ): (
                                                    <i className="fa fa-trash-o" />
                                                  )}
                                                </button>
                                              )
                                            }
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  ))}
                                <div className="status-upload mt-2 mb-3 d-inline-block w-100">
                                  <CommentForm streamPageMode={STREAM_PAGE_MODE} onFormSubmit={this.postReply} mode={this.state.mode} note={""} postId={post.id} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-xl-4 col-md-12 col-sm-12">
                {this.state.user.role === "manager" ? (
                  <div className="card">
                    <div className="card-header">
                      <h4 className="card-title">Today's Schedule</h4>
                    </div>
                    <div className="card-body pt-1 pb-3">
                      {this.state.schedules.map((schedule, key) => (
                        <div className="list d-flex align-items-center border-bottom py-3" key={key}>
                          <div className="top-scheduled-initials">
                            {schedule.firstName[0]} {schedule.lastName[0]}
                          </div>
                          <div className="wrapper w-100 ml-3">
                            <p className="mb-0">
                              {schedule.firstName} {schedule.lastName} ({schedule.duration.hrs}h{` ${schedule.duration.min > 0 ? schedule.duration.min + 'min' :''}`})
                            </p>
                            <div className="mb-0">
                              <Collapsible
                                trigger={
                                  schedule.events.length && (
                                    <span>
                                      Schedules ({schedule.events.length} ) <span className="caret" />
                                    </span>
                                  )
                                }
                              >
                                {schedule.events.map((event, key) => (
                                  <div key={key}>
                                    {event.name} {StringHelper.getTime(event.startDate)} -{" "}
                                    {StringHelper.getTime(event.endDate)}{ event.breaks && event.breaks > 0 ? ` • Break ${event.breaks} min ` : ' '}
                                    {event.name === "Offsite" ? (
                                      <span>
                                        <i className="fa fa-info-circle color-info" title={event.notes} />{" "}
                                      </span>
                                    ) : null}
                                  </div>
                                ))}
                              </Collapsible>
                            </div>
                          </div>
                        </div>
                      ))}
                      {this.state.schedulesLoading && <p className="text-center font-bold">Loading...</p>}
                      {this.state.schedules.length > 0 ? (
                        <div className="list d-flex justify-content-center align-items-center pt-3">
                          <Link to="/app/schedule?tab=my-employees">View All</Link>
                        </div>
                      ) : (
                        !this.state.schedulesLoading && <div className="list d-flex">No Schedule for today</div>
                      )}
                    </div>
                  </div>
                ) : this.state.user.role ? (
                  <div className="card">
                    <div className="card-header">
                      <h4 className="card-title">My Week Schedule</h4>
                    </div>
                    <div className="card-body pt-1 pb-3">
                      {this.state.schedules.map((schedule, key) => (
                        <div className="list d-flex align-items-center border-bottom py-3" key={key}>
                          <div className="wrapper w-100 ml-3">
                            <p className="mb-0">
                              {schedule.day} ({schedule.duration.hrs}h{` ${schedule.duration.min > 0 ? schedule.duration.min + 'min' :''}`})
                            </p>
                            <div className="mb-0">
                              <Collapsible
                                trigger={
                                  schedule.events.length && (
                                    <span>
                                      Schedules ({schedule.events.length} ) <span className="caret" />
                                    </span>
                                  )
                                }
                              >
                                {schedule.events.map((event, key) => (
                                  <div key={key}>
                                    {event.name} {StringHelper.getTime(event.startDate)} -{" "}
                                    {StringHelper.getTime(event.endDate)}{ event.breaks && event.breaks > 0 ? ` • Break ${event.breaks} min ` : ' '}

                                    {event.name === "Offsite" ? (
                                      <span>
                                        <i className="fa fa-info-circle color-info" title={event.notes} />{" "}
                                      </span>
                                    ) : null}
                                  </div>
                                ))}
                              </Collapsible>
                            </div>
                          </div>
                        </div>
                      ))}
                      {this.state.schedulesLoading && <p className="text-center font-bold">Loading...</p>}
                      {this.state.schedules.length > 0 ? (
                        <div className="list d-flex justify-content-center align-items-center pt-3">
                          <Link to="/app/schedule">View All</Link>
                        </div>
                      ) : (
                        !this.state.schedulesLoading && <div className="list d-flex">No Schedule for this week</div>
                      )}
                    </div>
                  </div>
                ) : null}
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Messages
                        <NavLink to="/app/compose-new-message" className="btn btn-warning btn-sm ml-3 compose-btn">
                          <i className="fa fa-pencil" /> Compose
                        </NavLink>
                    </h4>
                  </div>
                  <div className="card-body pt-1 pb-3">
                    {myMessages.map((msg, key) => (
                      <Link
                        to={`/app/messages/${msg.id}`}
                        key={key}
                        className="list d-flex align-items-center border-bottom py-3 h-msg-link"
                      >
                        <div className="img h-msg-details-initials">
                          {msg.firstName[0]} {msg.lastName[0]}
                        </div>
                        <div className="wrapper w-100 ml-3">
                          <p className="mb-0">
                            <b>
                              Message from {msg.firstName} {msg.lastName}
                            </b>
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <i className="mdi mdi-clock text-danger mr-1" />
                              <p className="mb-0">{msg.body}</p>
                            </div>
                            <small className="text-muted ml-auto">{moment(msg.createdAt).fromNow()}</small>
                          </div>
                        </div>
                      </Link>
                    ))}

                    {this.state.messagesLoading && <p className="text-center font-bold">Loading...</p>}
                    {myMessages.length > 0 ? (
                      <div className="list d-flex justify-content-center align-items-center pt-3">
                        <Link to="/app/messages">View All</Link>
                      </div>
                    ) : (
                      !this.state.messagesLoading && <div className="list d-flex">No Message to display</div>
                    )}
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Notifications</h4>
                  </div>
                  <div className="card-body pt-1 pb-3">
                    {myNotifications.map((notification, key) => (
                      <Link
                        to={`/app/notification/${notification.id}`}
                        key={key}
                        className="list d-flex align-items-center border-bottom py-3 h-msg-link"
                      >
                        <div className="wrapper w-100 ml-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <i className="mdi mdi-clock text-danger mr-1" />
                              <p className="mb-0">{notification.body}</p>
                            </div>
                            <small className="text-muted ml-auto">{moment(notification.createdAt).fromNow()}</small>
                          </div>
                        </div>
                      </Link>
                    ))}

                    {this.state.messagesLoading && <p className="text-center font-bold">Loading...</p>}
                    {myNotifications.length > 0 ? (
                      <div className="list d-flex justify-content-center align-items-center pt-3">
                        <Link to="/app/messages">View All</Link>
                      </div>
                    ) : (
                      !this.state.messagesLoading && <div className="list d-flex">No Notification to display</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  removeAttachment = () => {
    this.setState({
      attachment: null,
    });
  };

}

Stream.propTypes = {};

const mapStateToProps = (state)=>{
  return {
     posts : state.showPosts.posts,
     locations : state.showPosts.locations
  }
}

const mapActionToProps = (dispatch) =>{
  return {
    getPosts   : dispatch(getPosts())
  }
}

export default connect(mapStateToProps,mapActionToProps)(Stream);