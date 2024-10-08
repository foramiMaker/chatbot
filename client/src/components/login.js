import React, { useEffect, useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem("token");
    if (token) {
      const auth = localStorage.getItem("user");
      if (auth) {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formdata, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    console.log(formdata.email, formdata.password);
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:5000/login", formdata);
      console.log(result);
      if (result) {
        // console.log("login successfully", result);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        localStorage.setItem("token", result.data.token);
        navigate("/");
      } else {
        alert("user not found");
      }
    } catch (err) {
      console.error(err.message);
      alert("An error occurred. Please try again.");
    }
  };

  // Redirect for social login (e.g., Google, Facebook)
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
    console.log("Current URL:", window.location.href);
  };

  return (
    <div className="login" style={{ maxWidth: "400px", margin: "auto" }}>
      <h1 className="text-center mb-4">Login</h1>
      <Form onSubmit={handleLogin}>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Col sm="10">
            <Form.Control
              type="text"
              name="email"
              placeholder="example@gmail.com"
              onChange={handleChange}
              value={formdata.email}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Col sm="10">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formdata.password}
            />
          </Col>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className=""
          style={{ width: "150px", marginLeft: "30%" }}
          // onClick={handleLogin}
        >
          Login
        </Button>
        <div className="text-center mt-3">
          <p>or login with</p>

          {/* Social login buttons */}
          <Button
            variant="danger"
            onClick={handleGoogleLogin}
            className="me-2"
            style={{ width: "150px" }}
          >
            <FaGoogle /> Google
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default Login;
