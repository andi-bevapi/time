import React from "react";
import PropTypes from "prop-types";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import * as BootstrapTooltip from "react-bootstrap/Tooltip";

/**
 * @description Creates a bootstrap tooltip with custom text and position
 * @param {String} placement
 * @param {String} text
 */
const Tooltip = ({placement, text, children}) => {
  return (
    <OverlayTrigger
      key={placement}
      placement={placement}
      overlay={<BootstrapTooltip id={`tooltip-${placement}`}>{text}</BootstrapTooltip>}
    >
      {children}
    </OverlayTrigger>
  );
};

Tooltip.defaultProps = {
  placement: "top",
  text: "Tooltip here!",
  children: <p>Tooltip</p>
};

Tooltip.propTypes = {
  placement: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.element
};

export default Tooltip;
