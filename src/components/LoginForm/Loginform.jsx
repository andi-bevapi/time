import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';

class LoginForm extends React.Component{

    render(){

		const loginSchema = Yup.object().shape({
			employeeCode : Yup.string().trim().required('Please insert your number'),
			password : Yup.string().required('Please insert your password'),
			rememberMe : Yup.bool()
		});

        return(
			<Formik initialValues ={{
				employeeCode : '',
				password : '',
				rememberMe : true
			}}
			validationSchema ={ loginSchema }
			onSubmit={ async (values, { setSubmitting }) => {
				await this.props.handleSubmitlogin(values);
				setSubmitting(false);
			}}
			>
				{
					({ errors, values, touched, isSubmitting, handleChange, handleSubmit, handleBlur })=>(
							<form id="login" onSubmit={handleSubmit} className="card-body" tabIndex="500">
								<h4 className="mb-3">Login</h4>
								<div className="">
									<div className="form-group">
										<input
											type="text"
											name="employeeCode"
											id="employeeCode"
											autoFocus={true}
											className="form-control"
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.employeeCode}
											placeholder="Employee Number"
                                            disabled={isSubmitting}
										/>
										{errors.employeeCode && touched.employeeCode && (
										  <div className="input-validation-error">{errors.employeeCode}</div>
										)}
									</div>
									<div className="form-group">
										<input
											type="password"
											name="password"
											id="password"
											className="form-control"
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.password}
											placeholder="Password"
                                            disabled={isSubmitting}
										/>
										{errors.password && touched.password && (
										  <div className="input-validation-error">{errors.password}</div>
										)}
									</div>
									<div className="checkbox">
										<div className="custom-checkbox custom-control">
											<input
												type="checkbox"
												name="rememberMe"
												id="rememberMe"
												className="custom-control-input"
												onChange={handleChange}
												onBlur={handleBlur}
												checked={values.rememberMe}
												value={values.rememberMe}
												disabled={isSubmitting}
											/>
											<label htmlFor="rememberMe" className="custom-control-label">
											</label>
										</div>
									</div>
								</div>
								<div className="submit mt-3 mb-3">
									<button type="submit" className="btn btn-info btn-block" disabled={isSubmitting}>
										Login
									</button>
								</div>
					        </form>
					)
			    }
			</Formik>		
        );
    }
}

export default LoginForm;