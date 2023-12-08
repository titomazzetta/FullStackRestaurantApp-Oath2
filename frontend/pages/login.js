import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { login } from "../components/auth";
import AppContext from "../components/context";
import styles from '../styles/Home.module.css'; // Ensure this path is correct

function Login() {
  const [data, setData] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const appContext = useContext(AppContext);

  useEffect(() => {
    if (appContext.isAuthenticated) {
      router.push("/");
    }
  }, [appContext.isAuthenticated, router]);

  const validateForm = () => {
    let tempErrors = {};
    if (!data.identifier) {
      tempErrors.identifier = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.identifier)) {
      tempErrors.identifier = "Email is not valid";
    }
    if (!data.password) {
      tempErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
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
      const res = await login(data.identifier, data.password);
      appContext.setUser(res.data.user);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        const message = error.response.data.message[0].messages[0].message;
        // Check if the error message is about incorrect credentials
        if (message.toLowerCase().includes("identifier or password invalid")) {
          setErrors({ form: "Invalid email or password. Please try again." });
        } else {
          setErrors({ form: message });
        }
      } else {
        setErrors({ form: "Invalid email or password." });
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
                  <FormGroup>
                    <Label>Email:</Label>
                    <Input
                      onChange={onChange}
                      name="identifier"
                      type="email"
                      autoComplete="email"
                      className={errors.identifier ? styles.inputError : ""}
                    />
                    {errors.identifier && <small className={styles.errorText}>{errors.identifier}</small>}
                  </FormGroup>
                  <FormGroup>
                    <Label>Password:</Label>
                    <Input
                      onChange={onChange}
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      className={errors.password ? styles.inputError : ""}
                    />
                    {errors.password && <small className={styles.errorText}>{errors.password}</small>}
                  </FormGroup>

                  <FormGroup>
                    <span>
                      <a href=""><small>Forgot Password?</small></a>
                    </span>
                    <Button
                      onClick={handleSubmit}
                      className={styles.signInButton}>
                      {loading ? "Loading..." : "Sign In"}
                    </Button>

                  </FormGroup>
                </fieldset>
              </Form>
            </section>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
