import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import FlipMove from 'react-flip-move';
import UploadIcon from './UploadIcon.svg';

const styles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "left",
  flexWrap: "wrap",
  width: "100%"
};

class ReactFileUploadComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: props.defaultFile ? [props.defaultFile] : [],
      filterFiles: [],
      notAcceptedFileType: [],
      notAcceptedFileSize: []
    };
    this.inputElement = '';
    this.onDropFile = this.onDropFile.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.triggerFileUpload = this.triggerFileUpload.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevState.filterFiles !== this.state.filterFiles){
      this.props.onChange(this.state.filterFiles, this.state.files);
    }
  }

  /*
   Load file at the beggining if defaultFile prop exists
   */
  componentWillReceiveProps(nextProps){
    if(nextProps.defaultFile){
      this.setState({files: [nextProps.defaultFile]});
    }
  }

  /*
	 Check file extension (onDropFile)
	 */
  hasExtension(fileName) {
    const pattern = '(' + this.props.fileExtension.join('|').replace(/\./g, '\\.') + ')$';
    return new RegExp(pattern, 'i').test(fileName);
  }

  /*
   Handle file validation
   */
  onDropFile(e) {
    const filterFiles = e.target.filterFiles;
    const allFilePromises = [];

    // Iterate over all uploaded filterFiles
    for (let i = 0; i < filterFiles.length; i++) {
      let f = filterFiles[i];
      // Check for file extension
      if (!this.hasExtension(f.name)) {
        const newArray = this.state.notAcceptedFileType.slice();
        newArray.push(f.name);
        this.setState({notAcceptedFileType: newArray});
        continue;
      }
      // Check for file size
      if(f.size > this.props.maxFileSize) {
        const newArray = this.state.notAcceptedFileSize.slice();
        newArray.push(f.name);
        this.setState({notAcceptedFileSize: newArray});
        continue;
      }

      allFilePromises.push(this.readFile(f));
    }

    Promise.all(allFilePromises).then(newFilesData => {
      const dataURLs = this.state.files.slice();
      const filterFiles = this.state.filterFiles.slice();

      newFilesData.forEach(newFileData => {
        dataURLs.push(newFileData.dataURL);
        filterFiles.push(newFileData.file);
      });

      this.setState({files: dataURLs, filterFiles: filterFiles});
    });
  }

  onUploadClick(e) {
    // Fixes https://github.com/JakeHartnell/react-images-upload/issues/55
    e.target.value = null;
  }

  /*
     Read a file and return a promise that when resolved gives the file itself and the data URL
   */
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Read the file via FileReader API and save file result in state.
      reader.onload = function (e) {
        // Add the file name to the data URL
        let dataURL = e.target.result;
        dataURL = dataURL.replace(";base64", `;name=${file.name};base64`);
        resolve({file, dataURL});
      };

      reader.readAsDataURL(file);
    });
  }

  /*
   Remove the file from state
   */
  removeFile(picture) {
    const removeIndex = this.state.files.findIndex(e => e === picture);
    const filteredPictures = this.state.files.filter((e, index) => index !== removeIndex);
    const filteredFiles = this.state.filterFiles.filter((e, index) => index !== removeIndex);

    this.setState({files: filteredPictures, filterFiles: filteredFiles}, () => {
      this.props.onChange(this.state.filterFiles, this.state.files);
    });
  }

  /*
   Check if any errors && render
   */
  renderErrors() {
    let notAccepted = '';
    if (this.state.notAcceptedFileType.length > 0) {
      notAccepted = this.state.notAcceptedFileType.map((error, index) => {
        return (
          <div className={'errorMessage ' + this.props.errorClass} key={index} style={this.props.errorStyle}>
            * {error} {this.props.fileTypeError}
          </div>
        )
      });
    }
    if (this.state.notAcceptedFileSize.length > 0) {
      notAccepted = this.state.notAcceptedFileSize.map((error, index) => {
        return (
          <div className={'errorMessage ' + this.props.errorClass} key={index} style={this.props.errorStyle}>
            * {error} {this.props.fileSizeError}
          </div>
        )
      });
    }
    return notAccepted;
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
   Render preview images
   */
  renderPreview() {
    return (
      <div className="uploadPicturesWrapper">
        <FlipMove enterAnimation="fade" leaveAnimation="fade" style={styles}>
          {this.renderPreviewPictures()}
        </FlipMove>
      </div>
    );
  }

  renderPreviewPictures() {
    return this.state.files.map((picture, index) => {
      return (
        <div key={index} className="uploadPictureContainer">
          <div className="deleteFile" onClick={() => this.removeFile(picture)}>X</div>
          <img src={picture} className="uploadPicture" alt="preview"/>
        </div>
      );
    });
  }

  /*
   On button click, trigger input file to open
   */
  triggerFileUpload() {
    this.inputElement.click();
  }

  clearPictures() {
    this.setState({files: []})
  }

  render() {
    return (
      <div className={"fileUploader " + this.props.className} style={this.props.style}>
        <div className="fileContainer" style={this.props.fileContainerStyle}>
          {this.renderIcon()}
          {this.renderLabel()}
          <div className="errorsContainer">
            {this.renderErrors()}
          </div>
          <button
            type={this.props.buttonType}
            className={"chooseFileButton " + this.props.buttonClassName}
            style={this.props.buttonStyles}
            onClick={this.triggerFileUpload}
          >
            {this.props.buttonText}
          </button>
          <input
            type="file"
            ref={input => this.inputElement = input}
            name={this.props.name}
            multiple={!this.props.singleFile}
            onChange={this.onDropFile}
            onClick={this.onUploadClick}
            accept={this.props.accept}
          />
          { this.props.withPreview ? this.renderPreview() : null }
        </div>
      </div>
    )
  }
}

ReactFileUploadComponent.defaultProps = {
  className: '',
  fileContainerStyle: {},
  buttonClassName: "",
  buttonStyles: {},
  withPreview: false,
  accept: ".doc,.docx, .xls, .xlsx, .ppt, .pptx, application/pdf",
  name: "",
  withIcon: true,
  buttonText: "Choose images",
  buttonType: "button",
  withLabel: true,
  label: "Max file size: 5mb, accepted: word|excel|powerpoint|pdf",
  labelStyles: {},
  labelClass: "",
  fileExtension: ['.doc', '.docx','.xls', '.xlsx','.ppt', '.pptx', '.pdf'],
  maxFileSize: 5242880,
  fileSizeError: " file size is too big",
  fileTypeError: " is not a supported file extension",
  errorClass: "",
  style: {},
  errorStyle: {},
  singleFile: false,
  onChange: () => {},
  defaultFile: ""
};

ReactFileUploadComponent.propTypes = {
  style: PropTypes.object,
  fileContainerStyle: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
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
  fileExtension: PropTypes.array,
  maxFileSize: PropTypes.number,
  fileSizeError: PropTypes.string,
  fileTypeError: PropTypes.string,
  errorClass: PropTypes.string,
  errorStyle: PropTypes.object,
  singleFile: PropTypes.bool,
  defaultFile: PropTypes.string
};

export default ReactFileUploadComponent;
