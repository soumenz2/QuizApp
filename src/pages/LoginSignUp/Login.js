import React from 'react'
import "./LoginSignup.css"; 
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserId } from '../../redux/userslices';// Import the action
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../../config/config';


const Login = () => {
    const navigate = useNavigate();
    const dispatch=useDispatch()
    const loginSchema = Yup.object({
        email: Yup.string().email("Invalid Email id").required("Enter Email Id"),
        password: Yup.string()
          .required("Enter Your Password")
          .min(6, "Password must be at least 6 characters long")
      });
    
      const formik = useFormik({
        initialValues: {
          email: "",
          password: ""
        },
        validationSchema: loginSchema,
        onSubmit: async(values) => {
          try{
            console.log("Login Data Submitted: ", values);
            console.log(API_BASE_URL)
            const response = await axios.post(`${API_BASE_URL}/login`, values);
            const { token } = response.data;
            console.log("login sucessfully",response.data)

            // Store the token in localStorage
           localStorage.setItem('token', token);

        // Decode the token to get the user ID
        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id;
        localStorage.setItem('user', userId);
        console.log(userId)

        // Dispatch the action to store userId in Redux
        dispatch(setUserId(userId));
        //navigate('/dashboard')

          }catch(err){
            console.error('Login failed', err);
          }
     
        }
      });
  return (
    <div>
        <form  onSubmit={formik.handleSubmit} method="POST">
          
          
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
            {formik.touched.email && formik.errors.email ? (
            <div className="error-message" >{formik.errors.email}</div>
          ) : null}
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
            {formik.touched.password && formik.errors.password ? (
            <div className="error-message" >{formik.errors.password}</div>
          ) : null}
           
            <button type="submit" >Log In</button>
          </form>
    </div>
  )
}


export default Login