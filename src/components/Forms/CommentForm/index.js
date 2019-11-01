import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Upload from "../../Upload";

// CreateLevelForm validations schema
const creatCommentFormSchema = Yup.object().shape({
  note: Yup.string()
    .trim()
    .required("Comment note is required"),
  postId: Yup.number().required("Post Id is necessary for a reply")
});
export default class CommentForm extends React.Component {
  state = {
    note: this.props.note,
    postId: this.props.postId,
    hasImage: false,
    hasFile: false,
    picture: null,
    pictureData: null,
    attachment: null,
    attachmentError: null,
    showVideoModal: false,
    validVideoUrl: false,
    videoUrl: '',
  };
  constructor(props) {
    super(props);
    this.onUploadFilesChanged = this.onUploadFilesChanged.bind(this);
    this.saveVideoModal = this.saveVideoModal.bind(this);
  }
  handleChange = (e) => {
    this.setState({
      note: e.target.value
    })
  };
  onUploadFilesChanged = (files) => {
    if (files[0]) {
      this.setState({
        attachment: files[0]
      });
    } else {
      this.setState({
        attachment: null,
      })
    }
  };
  saveVideoModal = (attachment) => {
    this.setState({
      attachment
    });
  };

  render() {
    const formValues = {
      note: this.state.note,
      postId: this.state.postId,
      image: this.state.picture ? {
        data: this.state.picture.data,
        type: this.state.picture.type,
        name: this.state.picture.name
      } : null
    };
    const initialValues = {
      note: '',
      postId: 0,
      picture: null,
      attachment: null,
    };
    const {attachment} = this.state;
    return (
      <Formik
        initialValues={formValues}
        validationSchema={creatCommentFormSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          values.attachment = this.state.attachment;
          await this.props.onFormSubmit(values);
          resetForm(initialValues);
          this.setState({
            picture: null,
            hasImage: false,
            hasFile: false,
            attachment: null,
            attachmentError: null,
            note: '',
          });
          setSubmitting(false);
        }}
        enableReinitialize={true}
      >
        {({ errors, values, touched, isSubmitting, handleSubmit, handleReset }) => (
          <form className="form-horizontal" onReset={handleReset} onSubmit={handleSubmit}>
            <div className="form-group row">
              <div className="col-md-12">
                <textarea
                  value={values.note}
                  className="form-control pt-2"
                  placeholder="Add a reply..."
                  rows={5}
                  onChange={this.handleChange}
                />
                {errors.note && touched.note && <div className="input-validation-error px-3 py-1">{errors.note}</div>}
                {errors.postId && touched.postId && <div className="input-validation-error px-3 py-1">{errors.postId}</div>}
              </div>
            </div>
            <Upload
              attachment={attachment}
              onUploadFilesChanged={this.onUploadFilesChanged}
              saveVideoModal={this.saveVideoModal}
              removeAttachment={this.removeAttachment}
            />
            <br />
            <div className="row">
              <div className="col-12">

                <button
                  type="submit"
                  className="btn btn-sm btn-success pull-right"
                  disabled={this.props.mode === this.props.streamPageMode.SAVING}
                >
                  {this.props.mode === this.props.streamPageMode.SAVING ? (
                    <span>
                      <i className="fa fa-spinner fa-spin"/> Replying...
                    </span>

                  ): (
                    <span>
                      <i className="fa fa-share ml-1" /> Reply
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    );
  }

  removeAttachment = () => {
    this.setState({
      attachment: null,
    });
  }

}
