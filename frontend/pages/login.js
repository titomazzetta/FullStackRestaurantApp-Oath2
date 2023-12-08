import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { signIn } from "next-auth/react";
import axios from "axios"; // Import axios
import AppContext from "../components/context";
import styles from "../styles/Home.module.css";
import Layout from "../components/layout";

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
      <Container>
        <Row>
          <Col sm="8" md="16" lg="32">
            <div className={styles.paper}>
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
                  <FormGroup>
                    <Button type="submit" className={styles.signInButton} disabled={loading}>
                      {loading ? "Loading..." : "Sign In"}
                    </Button>
                    <Button onClick={handleGoogleSignIn} className={styles.googleSignInButton}>
                      Sign in with Google
                    </Button>
                    <Button onClick={handleGitHubSignIn} className={styles.githubSignInButton}>
                      Sign in with GitHub
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
