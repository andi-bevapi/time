import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import UploadIcon from './UploadIcon.svg';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
    this.inputElement = '';
    this.id = 0;
    this.onDropFile = this.onDropFile.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.triggerFileUpload = this.triggerFileUpload.bind(this);
    this.triggerUpload = this.triggerUpload.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  /*
   Load image at the beggining if defaultImage prop exists
   */
  componentWillReceiveProps(nextProps){
    if(nextProps.defaultImage){
      this.setState({pictures: [nextProps.defaultImage]});
    }
  }

  /*
   Handle file validation
   */
  onDropFile(e) {
    const files = e.target.files;
    const acceptedFiles = [];

    // Iterate over all uploaded files
    for (let i = 0; i < files.length; i++) {
      let f = files[i];
      // Check for file extension
      const acceptType = this.props.accept.split(',').some((accept) => {
        if (accept.startsWith('.')) {
          return f.name.endsWith(accept);
        } else {
          const [type, subType] = accept.split('/');
          if (subType === '*') {
            return type === f.type.split('/')[0];
          }
          return f.type === accept;
        }
      });
      if (!acceptType) {
        this.onError(`${f.name} ${this.props.fileTypeError}`, f);
        continue;
      }
      // Check for file size
      if(f.size > this.props.maxFileSize) {
        this.onError(`${f.name} ${this.props.fileSizeError}`, f);
        continue;
      }

      // add previews
      if (f.type && f.type.startsWith('image/')) {
        f.preview = {
          type: 'image',
          url: URL.createObjectURL(f)
        }
      } else {
        f.preview = {
          type: 'file'
        }
      }

      f.id = 'file-' + this.id++
      acceptedFiles.push(f);
    }

    this.setState({
      files: this.props.multiple === false
        ? acceptedFiles
        : [...this.state.files, ...acceptedFiles],
    }, () => {
      this.props.onChange(this.state.files);
    });
  }

  onUploadClick(e) {
    // Fixes https://github.com/JakeHartnell/react-images-upload/issues/55
    e.target.value = null;
  }

  /*
   Remove the image from state
   */
  removeFile (fileToRemove) {
    this.setState({
      files: this.state.files.filter(file => file.id !== fileToRemove.id),
    }, () => {
      this.props.onChange(this.state.files);
    })
  }

  removeFiles () {
    this.setState({
      files: []
    }, () => {
      this.props.onChange(this.state.files);
    })
  }

  onError (message, file) {
    this.props.onError({ message }, file);
  }

  /*
   Render the upload icon
   */
  renderIcon() {
    if (this.props.withIcon) {
      return <img src={UploadIcon} className="uploadIcon"	alt="Upload Icon" />;
    }
  }

  /*
   Render label
   */
  renderLabel() {
    if (this.props.withLabel) {
      return <p className={this.props.labelClass} style={this.props.labelStyles}>{this.props.label}</p>
    }
  }

  /*
   On button click, trigger input file to open
   */
  triggerFileUpload() {
    this.inputElement.value = null;
    this.inputElement.click();
  }

  triggerUpload() {
    if (typeof this.props.onUploadRequest === 'function') {
      this.props.onUploadRequest();
    } else {
      this.triggerFileUpload();
    }
  }


  render() {
    return (
      <div className={"fileUploader " + this.props.className} style={this.props.style}>
        <div className="fileContainer" style={this.props.fileContainerStyle}>
          {this.renderIcon()}
          {this.renderLabel()}
          <button
            type={this.props.buttonType}
            className={"chooseFileButton text-nowrap " + this.props.buttonClassName}
            style={this.props.buttonStyles}
            onClick={this.triggerUpload}
          >
            {this.props.buttonText}
          </button>
          <input
            type="file"
            ref={input => this.inputElement = input}
            name={this.props.name}
            multiple={!this.props.multiple}
            onChange={this.onDropFile}
            onClick={this.onUploadClick}
            accept={this.props.accept}
          />
        </div>
      </div>
    )
  }
}

FileUpload.defaultProps = {
  className: '',
  fileContainerStyle: {},
  buttonClassName: "",
  buttonStyles: {},
  withPreview: false,
  accept: "image/*",
  name: "",
  withIcon: true,
  buttonText: "Choose files",
  buttonType: "button",
  withLabel: true,
  label: "Max file size: 5mb, accepted: jpg|gif|png",
  labelStyles: {},
  labelClass: "",
  maxFileSize: 5242880,
  fileSizeError: " file size is too big",
  fileTypeError: " is not a supported file extension",
  errorClass: "",
  style: {},
  errorStyle: {},
  multiple: false,
  onChange: () => {},
  onError: () => {},
  defaultImage: "",
  onRef: () => {},
};

FileUpload.propTypes = {
  style: PropTypes.object,
  fileContainerStyle: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  buttonClassName: PropTypes.string,
  buttonStyles: PropTypes.object,
  buttonType: PropTypes.string,
  withPreview: PropTypes.bool,
  accept: PropTypes.string,
  name: PropTypes.string,
  withIcon: PropTypes.bool,
  buttonText: PropTypes.string,
  withLabel: PropTypes.bool,
  label: PropTypes.string,
  labelStyles: PropTypes.object,
  labelClass: PropTypes.string,
  maxFileSize: PropTypes.number,
  fileSizeError: PropTypes.string,
  fileTypeError: PropTypes.string,
  errorClass: PropTypes.string,
  errorStyle: PropTypes.object,
  multiple: PropTypes.bool,
  defaultImage: PropTypes.string,
  onRef: PropTypes.func,
  onUploadRequest: PropTypes.func,
};

export default FileUpload;
