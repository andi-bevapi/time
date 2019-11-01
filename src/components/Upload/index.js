import React from "react";
import FileUpload from "../FileUpload/FileUpload";
import PropTypes from "prop-types";
import FlipMove from "react-flip-move";
import Modal from "react-modal";

const customModalStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const marginAutoCenterStyle = {
  margin: 'auto 0',
};

const SUPPORTED_VIDEO_PROVIDERS = [
  'youtube.com',
  'vimeo.com',
];

class Upload extends React.Component {
  state = {
    hasImage: false,
    attachmentError: null,
    showVideoModal: false,
    validVideoUrl: false,
    videoUrl: '',
  };

  constructor(props) {
    super(props);
    this.onUploadFileError = this.onUploadFileError.bind(this);
    this.onUploadFilesChanged = this.onUploadFilesChanged.bind(this);
    this.setVideoUploader = this.setVideoUploader.bind(this);
    this.onVideoUpload = this.onVideoUpload.bind(this);
    this.closeVideoModal = this.closeVideoModal.bind(this);
    this.saveVideoModal = this.saveVideoModal.bind(this);
    this.triggerVideoSelector = this.triggerVideoSelector.bind(this);
    this.onVideoUrlChanged = this.onVideoUrlChanged.bind(this);
  }

  onVideoUrlChanged (e) {
    try {
      const url = new URL(e.target.value);
      const isValid = SUPPORTED_VIDEO_PROVIDERS.some((provider) => {
        return url.hostname.endsWith(provider);
      });
      this.setState({
        videoUrl: e.target.value,
        validVideoUrl: isValid,
      });
    } catch (e) {}
  }

  onUploadFileError (err) {
    this.setState({
      attachmentError: err,
    });
  }
  setVideoUploader(videoUploader) {
    this.videoUploader = videoUploader;
  }

  onVideoUpload() {
    this.setState({
      showVideoModal: true,
      validVideoUrl: false,
    });
  }

  triggerVideoSelector() {
    if (this.videoUploader) {
      this.videoUploader.triggerFileUpload();
    }
  }

  closeVideoModal() {
    this.setState({
      showVideoModal: false,
    });
  }
  onUploadFilesChanged = (files) => {
      console.log(files);
    if (files[0]) {
      this.props.onUploadFilesChanged(files);
      this.setState({
        attachmentError: null,
      });
      if (this.state.showVideoModal) {
        this.closeVideoModal();
      }
    }
  };
  saveVideoModal = () => {
    this.setState({
      showVideoModal: false,
    });
    const attachment = {
      url: this.state.videoUrl,
      preview: {
        type: 'url',
      }
    };
    this.props.saveVideoModal(attachment);
  };
  render() {
    return (
    <>
        {this.renderFilePreview()}
        <div className="errorsContainer">
          {this.props.attachmentError ? (<span>{this.renderFileUploadErrors()}</span>) : null}
        </div>
        <FileUpload
          buttonClassName={this.props.attachment !== null ? "hidden" : ""}
          withIcon={false}
          buttonText={this.props.imageButtonText}
          accept={this.props.imageAccept}
          onChange={this.onUploadFilesChanged}
          onError={this.onUploadFileError}
          maxFileSize={this.props.imageMaxSize}
          multiple={this.props.imageMultiple}
          withLabel={false}
        />
        <FileUpload
          buttonClassName={this.props.attachment !== null ? "hidden" : ""}
          onRef={this.setVideoUploader}
          onUploadRequest={this.onVideoUpload}
          withIcon={false}
          buttonText={this.props.videoButtonText}
          accept={this.props.videoAccept}
          onChange={this.onUploadFilesChanged}
          onError={this.onUploadFileError}
          maxFileSize={this.props.videoMaxSize}
          multiple={this.props.videoMultiple}
          withLabel={false}
        />
        <FileUpload
          buttonClassName={this.props.attachment !== null ? "hidden" : ""}
          withIcon={false}
          buttonText={this.props.fileButtonText}
          accept={this.props.fileAccept}
          onChange={this.onUploadFilesChanged}
          onError={this.onUploadFileError}
          maxFileSize={this.props.fileMaxSize}
          multiple={this.props.fileMultiple}
          withLabel={false}
        />
      <Modal
        isOpen={this.state.showVideoModal}
        onRequestClose={this.closeVideoModal}
        style={customModalStyles}
        contentLabel="Upload Video"
        shouldCloseOnOverlayClick={false}
      >
        <div className="modal-header">
          <h4>Upload Video</h4>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <div className="row">
              <label>Video Url</label>
              <input
                type="text"
                name="attachmentUrl"
                onChange={this.onVideoUrlChanged}
                autoFocus={true}
                className="form-control"
                placeholder="Enter Video Url"
              />
              <span className="font-weight-bold mt-2">current supported providers are Youtube and Vimeo</span>
            </div>
            <div className="row mt-1 mb-1 justify-content-center">
              <div className="col"><hr/></div>
              <div className="col-md-1 flex-column justify-content-center" style={marginAutoCenterStyle}>OR</div>
              <div className="col"><hr/></div>
            </div>
            <div className="row justify-content-center fileContainer">
              <button type="button" className="chooseFileButton text-nowrap" onClick={this.triggerVideoSelector}>Choose Video</button>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="pull-right">
            <button className="btn btn-outline-info btn-sm mr-2" onClick={this.saveVideoModal} disabled={!this.state.validVideoUrl}>Save</button>
            <button className="btn btn-outline-info btn-sm mr-2" onClick={this.closeVideoModal}>Close</button>
          </div>
        </div>
      </Modal>
    </>
    )
  }

  renderFilePreview() {
    const { attachment } = this.props;
    const previewStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      width: "100%"
    };

    if (attachment) {
      return (
        <div className="previewsWrapper">
          <FlipMove enterAnimation="fade" leaveAnimation="fade" style={previewStyle}>
            <div className={'uploadContainer ' + (attachment.preview.type === 'image' ? 'imageFile' : 'otherFile')}>
              <div className="deleteImage" onClick={() => this.props.removeAttachment()}>X</div>
              {attachment && attachment.preview.type === 'image' && <img src={attachment.preview.url} className="uploadPicture" alt="preview"/>}
              {attachment.preview.type === 'file' && <span className="uploadPicture">{attachment.name}</span>}
              {attachment.preview.type === 'url' && <span className="uploadPicture">{attachment.url}</span>}
            </div>
          </FlipMove>
        </div>
      );
    }
  }

  renderFileUploadErrors() {
    const err = this.state.attachmentError;
    if (err) {
      return (
        <div className="errorMessage">
          * {err.message}
        </div>
      );
    }
  }
}

Upload.defaultProps = {
  onUploadFilesChanged: () => {},
  saveVideoModal: () => {},
  removeAttachment: () => {},
  attachment: null,
  imageAccept: 'image/*',
  videoAccept: 'video/*,audio/*"',
  fileAccept: '.pdf,.csv,.doc,.docx,.xls,.xlsx',
  fileButtonText: "Document",
  imageButtonText: "Image",
  videoButtonText: "Video",
  fileMaxSize: 5242880, // 5 mb
  imageMaxSize: 5242880, // 5 mb
  videoMaxSize: 10485760, // 10 mb
  fileMultiple: false,
  imageMultiple: false,
  videoMultiple: false,
};

Upload.propTypes = {
  onUploadFilesChanged: PropTypes.func,
  saveVideoModal: PropTypes.func,
  removeAttachment: PropTypes.func,
  attachment: PropTypes.object,
  imageAccept: PropTypes.string,
  videoAccept: PropTypes.string,
  fileAccept: PropTypes.string,
  fileButtonText: PropTypes.string,
  imageButtonText: PropTypes.string,
  videoButtonText: PropTypes.string,
  fileMaxSize: PropTypes.number,
  imageMaxSize: PropTypes.number,
  videoMaxSize: PropTypes.number,
  fileMultiple: PropTypes.bool,
  imageMultiple: PropTypes.bool,
  videoMultiple: PropTypes.bool,
};

export default Upload;
