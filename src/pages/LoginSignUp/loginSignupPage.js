import React, { useState } from "react";

import "./LoginSignup.css";
import Login from "./Login"; 
import SignUp from "./SignUp";
import PropTypes from 'prop-types';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function LoginSignup() {
  const [isSignup, setIsSignup] = useState(true);




  return (
    <div className="login-signup-container">
         <ToastContainer/>
      <div className="heading">
        <h1>QUIZZIE</h1>
      </div>

      <div className="tabs">
        <button
          className={`tab ${isSignup ? "active" : ""}`}
          onClick={() => setIsSignup(true)}
        >
          Sign Up
        </button>
        <button
          className={`tab ${!isSignup ? "active" : ""}`}
          onClick={() => setIsSignup(false)}
        >
          Log In
        </button>
      </div>

     {
        isSignup? <SignUp setIsSignup={setIsSignup}  /> :<Login />
     }
    </div>
  );
}

export default LoginSignup;
