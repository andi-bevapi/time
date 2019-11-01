import React from "react";
import PropTypes from "prop-types";

const Toast = (props) => {
  return (
    <div className="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="toast-header">
        <div className={`rounded mr-2 toast-icon bg-${props.status}`} />
        <strong className={`mr-auto text-${props.status}`}>{props.title}</strong>
        <button type="button" onClick={props.dismiss} className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="toast-body">{props.message}</div>
    </div>
  );
};

Toast.defaultProps = {
  status: "danger",
  title: "Toast",
  message: "Toast message!",
  dismiss: () => alert("Toast dismiss clicked")
};

Toast.propTypes = {
  status: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  dismiss: PropTypes.func.isRequired
};

export default Toast;
