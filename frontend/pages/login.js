import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { signIn } from "next-auth/react";
import AppContext from "../components/context";
import styles from '../styles/Home.module.css';
import Layout from '../components/layout'; // Ensure this path is correct

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const appContext = useContext(AppContext);

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });

  };

  const handleGitHubSignIn = () => {
    signIn('github', { callbackUrl: '/' });
  };
  
  

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
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
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      });
    
      if (!result.error) {
        router.push('/'); // Redirect to the desired page after successful sign-in
      } else {
        setErrors({ form: result.error });
      }
    } catch (error) {
      setErrors({ form: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container>
        <Row>
          <Col sm="12" md={{ size: 5, offset: 3 }}>
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
