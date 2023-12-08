// /pages/register.js
import React, { useState, useContext } from "react";
import { useRouter } from 'next/router';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { registerUser } from "../components/auth";
import AppContext from "../components/context";
import styles from '../styles/Home.module.css';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [data, setData] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const appContext = useContext(AppContext);
  const router = useRouter();

  const handleGoogleLogin = async (googleResponse) => {
    const googleToken = googleResponse.credential;
  
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
      const res = await fetch(`${API_URL}/api/auth/google/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: googleToken })
      });
      const data = await res.json();
      if (res.ok) {
        // Store JWT token and user data in the context
        appContext.setUser(data.user);
        localStorage.setItem('jwt', data.jwt);

        // Navigate to home page
        router.push('/');
      } else {
        // Handle errors from your backend
        console.error("Strapi authentication error:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };




  

  const validateForm = () => {
    let tempErrors = {};
    if (!data.username) {
      tempErrors.username = "Username is required";
    }
    if (!data.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      tempErrors.email = "Email is not valid";
    }
    if (!data.password) {
      tempErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    if (!data.confirmPassword) {
      tempErrors.confirmPassword = "Confirm password is required";
    } else if (data.confirmPassword !== data.password) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const onChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await registerUser(data.username, data.email, data.password);
      appContext.setUser(res.data.user);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error.message;
        if (errorMessage.includes("Email or Username are already taken")) {
          setErrors({ form: "Email and Username already taken. Please use a different one." });
        } else {
          setErrors({ form: errorMessage });
        }
      } else {
        setErrors({ form: "An unexpected error occurred" });
      }
      setLoading(false);
    }
  };
  return (
    <Container>
  
      
      <br></br>
      <br></br>
      <Row>
    
        <Col sm="12" md={{ size: 5, offset: 3 }}>
          <div className={styles.paper}>
          
          <div className={styles.header}>
              <img
                src="http://localhost:1337/uploads/DALL_E_2023_11_26_15_21_17_A_modern_minimalist_black_and_white_photo_icon_featuring_a_sleek_one_line_drawing_style_of_food_The_design_emphasizes_simplicity_and_elegance_wit_138770b511.png"
                alt="Logo"
                className={styles.loginLogo}
              />
            </div>
            <section className={styles.wrapper}>
              {errors.form && <div className={styles.notification}>{errors.form}</div>}
              <Form>
                <fieldset disabled={loading}>
                  {/* Username Field */}
                  <FormGroup>
                    <Label>Username:</Label>
                    <Input onChange={onChange} type="text" name="username" className={errors.username ? styles.inputError : ""} />
                    {errors.username && <small className={styles.errorText}>{errors.username}</small>}
                  </FormGroup>

                  {/* Email Field */}
                  <FormGroup>
                    <Label>Email:</Label>
                    <Input
                      onChange={onChange}
                      type="email"
                      name="email"
                      autoComplete="email"  // Add this line
                      className={errors.email ? styles.inputError : ""}
                    />
                    {errors.email && <small className={styles.errorText}>{errors.email}</small>}
                  </FormGroup>

                  {/* Password Field */}
                  <FormGroup>
                    <Label>Password:</Label>
                    <Input
                      onChange={(e) => setData({ ...data, password: e.target.value })}
                      value={data.password}
                      type="password"
                      name="password"
                      autoComplete="new-password" // Add this line
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup>
                      {/* Confirm Password Field */}
                  <FormGroup>
                    <Label>Confirm Password:</Label>
                    <Input
                      onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                      value={data.confirmPassword}
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password" // Add this line
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup>

                  {/* Submit Button */}
                  <FormGroup>
                    <Button onClick={handleSubmit} className={styles.signInButton}>
                      {loading ? "Loading..." : "Sign Up"}
                    </Button>
                  </FormGroup>
                </fieldset>
              </Form>
            </section>
          </div>
          <GoogleLogin
              clientId="650195335062-pb1skr3mh9v37s93t4c487k883gaad78.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={handleGoogleLogin}
              onFailure={() => console.error('Google Login Failed')}
              cookiePolicy={'single_host_origin'}
            />
          
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
