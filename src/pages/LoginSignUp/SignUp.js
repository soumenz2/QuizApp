import React,{useEffect} from "react";
import "./LoginSignup.css";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from '../../config/config';

const SignUp = ({ setIsSignup }) => {

  const registrationSchema = Yup.object({
    name: Yup.string().required("Enter First Name"),
    email: Yup.string().email("Invalid Email id").required("Enter Email Id"),
    password: Yup.string()
      .required("Enter Your Password")
      .min(6, "Password must be at least 6 characters long")
      .matches(/[A-Z]/, "At least one Upper case character needed")
      .matches(/[a-z]/, "At least one lower case character needed")
      .matches(/[0-9]/, "One numeric value needed")
      .matches(
        /[~!@#$%^&*()_+{}\[\]:;"'<>,.?/|\\-`]/,
        "One special Character needed"
      ),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      try {
        await axios
          .post(`${API_BASE_URL}//signup`, values)
          .then((res) => {
            console.log("entered sucess part");
            toast.success(res.data.message);
           // showMsg("Registered successfully!")
           setTimeout(() => {
            setIsSignup(false);
           },2000);
           
            console.log(res.data.message);
          })
       
         
      } catch (err) {
        console.error(err);
        
        toast.error("Registration failed");
      }
    },
  });

  return (
    <div>
      <ToastContainer/>
      <form onSubmit={formik.handleSubmit} method="POST">
        {" "}
        {/* No action attribute, form handled by JavaScript */}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        {formik.touched.name && formik.errors.name && (
          <div className="error-message">{formik.errors.name}</div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <div className="error-message">{formik.errors.email}</div>
        )}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className="error-message">{formik.errors.password}</div>
        )}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="error-message">{formik.errors.confirmPassword}</div>
        )}
        <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
          {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};
// SignUp.propTypes = {
//   setIsSignup: PropTypes.func.isRequired,
//   showMsg: PropTypes.func.isRequired,
// };



export default SignUp;
