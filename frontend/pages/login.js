import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { signIn } from "next-auth/react";
import Image from 'next/image';

import AppContext from "../components/context";
import styles from "../styles/Home.module.css";
import Layout from "../components/layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';



function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const appContext = useContext(AppContext);

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    // Clear the error message when the user starts typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!data.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) tempErrors.email = "Email is not valid";
    if (!data.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    console.log("Form submitted");
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const signInRes = await signIn("credentials", {
        redirect: false,
        username: data.email, // Use 'username' or 'email' based on your Strapi configuration
        password: data.password,
      });

      if (signInRes.error) {
        // If credentials login fails, set error and continue
        setErrors({ form: signInRes.error });
      } else {
        // Successfully logged in with credentials
        router.push("/");
      }
    } catch (error) {
      setErrors({ form: "Login failed. Please try again." });
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
      <br></br>
      <br></br>
      <br></br>
      <Container>
        <Row>
        <Col sm="7" md="10" lg="10">
            <div className={styles.paper}>
            <div className={styles.header}>
              <Image
                src="/logoimage.png"
                width={400}
                height={400}
                alt="Logo"
                className={styles.loginLogo}
              />
            </div>
              <section className={styles.wrapper}>
                {errors.form && <div className={styles.notification}>{errors.form}</div>}
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label>Email:</Label>
                    <Input
                      onChange={handleInputChange}
                      type="email"
                      name="email"
                      value={data.email}
                      className={errors.email ? styles.inputError : ""}
                    />
                    {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
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
                    {errors.password && <FormFeedback>{errors.password}</FormFeedback>}
                  </FormGroup>
                  <FormGroup className={`${styles.buttonGroup} text-center`}>
  <Button type="submit" className={`btn btn-primary ${styles.signInButton}`} disabled={loading}>
    {loading ? "Loading..." : "Sign In"}
  </Button>
  <br></br>
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
}

export default Login;
