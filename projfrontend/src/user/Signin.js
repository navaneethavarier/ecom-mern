import React, { useState } from 'react';
import Base from '../core/Base';
import { Link, Redirect } from "react-router-dom";
import "../styles.css"
import { signin, isAuthenticated, authenticate } from "../auth/helper";
const Signin = () => {

  const [values, setValues] = useState({
    email: "hitesh@gmail.com",
    password: "123456",
    error: "",
    loading: false,
    didRedirect: false
  });

  const { email, password, error, loading, didRedirect } = values;

  const { user } = isAuthenticated();

  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    setValues({ ...values, error: false, loading: true })
    signin({ email, password })
      .then(data => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: true })
        }
        else {
          authenticate(data, () => {
            setValues({
              ...values, didRedirect: true
            })
          })
        }
      })
      .catch(() => {
        console.log("Signin request failed")
      })
  }

  const performRedirect = () => {
    if (didRedirect) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard"/>
      }
      else {
        return <Redirect to="/user/dashboard"/>
      }
    }
    if (isAuthenticated()) {
      return <Redirect to="/" />
    }
  }

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading...</h2>
        </div>
      )
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  const signInForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group p-2">
              <label className="text-light">Email</label>
              <input onChange={handleChange("email")} value={email} className="form-control" type="email" />
            </div>

            <div className="form-group p-2">
              <label className="text-light">Password</label>
              <input onChange={handleChange("password")} value={password} className="form-control" type="password" />
            </div>
            <button onClick={onSubmit} className=" btn-block btn btn-success">Submit</button>
          </form>
        </div>
      </div>
    );
  };
  return (
    <Base title="Sign in page" description="A place for user to sign in!">
      {loadingMessage()}
      {errorMessage()}
      {signInForm()}
      {performRedirect()}
    </Base>
  )
}

export default Signin;
