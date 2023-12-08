import React, { useState, useContext } from "react";
import { useRouter } from 'next/router';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from "reactstrap";
import axios from 'axios';
import { signIn } from 'next-auth/react';
import AppContext from "../components/context";
import styles from '../styles/Home.module.css';
import Layout from '../components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';

const Register = () => {
  const [data, setData] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const appContext = useContext(AppContext);

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!data.username) tempErrors.username = "Username is required";
    if (!data.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) tempErrors.email = "Email is not valid";
    if (!data.password) tempErrors.password = "Password is required";
    else if (data.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    if (data.confirmPassword !== data.password) tempErrors.confirmPassword = "Passwords do not match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const registrationResponse = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}api/auth/local/register`, {
        username: data.username,
        email: data.email,
        password: data.password
      });
      
    
      if (registrationResponse.data) {
        const signInRes = await signIn('credentials', {
          redirect: false,
          username: data.username, // Use 'username' or 'email' based on your Strapi configuration
          password: data.password,
        });
    
        if (signInRes.error) {
          setErrors({ form: signInRes.error });
        } else {
          appContext.setUser(registrationResponse.data.user);
          router.push('/');
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed"; // Default message

      if (error.response && error.response.data) {
        console.log("Error response data:", error.response.data);

        if (typeof error.response.data.message === 'string') {
          errorMessage = error.response.data.message;
        } else if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message[0]?.messages[0]?.message || errorMessage;
        }
      }

      setErrors({ form: errorMessage });
    } finally {
      setLoading(false);
    }
  };

// Function to handle Google login
const handleGoogleSignIn = () => {
  signIn("google", { callbackUrl: "/" });
};

// Function to handle GitHub login
const handleGitHubSignIn = () => {
  signIn("github", { callbackUrl: "/" });
};
  return (
    <Layout>
      <br></br><br></br>
    <Container>
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
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Username:</Label>
                  <Input
                    onChange={handleInputChange}
                    type="text"
                    name="username"
                    value={data.username}
                    className={errors.username ? styles.inputError : ""}
                  />
                  {errors.username && <small className={styles.errorText}>{errors.username}</small>}
                </FormGroup>
                <FormGroup>
                  <Label>Email:</Label>
                  <Input
                    onChange={handleInputChange}
                    type="email"
                    name="email"
                    value={data.email}
                    className={errors.email ? styles.inputError : ""}
                  />
                  {errors.email && <small className={styles.errorText}>{errors.email}</small>}
                </FormGroup>
                <FormGroup>
                  <Label>Password:</Label>
                  <Input
                    onChange={handleInputChange}
                    type="password"
                    name="password"
                    value={data.password}
                    className={errors.password ? styles.inputError : ""}
                  />
                  {errors.password && <small className={styles.errorText}>{errors.password}</small>}
                </FormGroup>
                <FormGroup>
                  <Label>Confirm Password:</Label>
                  <Input
                    onChange={handleInputChange}
                    type="password"
                    name="confirmPassword"
                    value={data.confirmPassword}
                    className={errors.confirmPassword ? styles.inputError : ""}
                  />
                  {errors.confirmPassword && <small className={styles.errorText}>{errors.confirmPassword}</small>}
                </FormGroup>
                <FormGroup>
                  <Button type="submit" className={styles.signInButton} disabled={loading}>
                    {loading ? "Loading..." : "Sign Up"}
                  </Button>
                </FormGroup>

                <FormGroup className={`${styles.buttonGroup} text-center`}>

  <Button
    onClick={handleGoogleSignIn}
    className={`btn btn-primary ${styles.googleSignInButton} rounded mx-2`}
    title="Sign in via Google Account"
  >
    <FontAwesomeIcon icon={faGoogle} />
  </Button>
  <Button
    onClick={handleGitHubSignIn}
    className={`btn btn-primary ${styles.githubSignInButton} rounded mx-2`}
    title="Sign in via GitHub Account"
  >
    <FontAwesomeIcon icon={faGithub} />
  </Button>
</FormGroup>
              </Form>
            </section>
          </div>
        </Col>
      </Row>
    </Container>
    </Layout>
  );
};

export default Register;
