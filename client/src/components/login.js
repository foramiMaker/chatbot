import React, { useEffect, useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  });

  const handleChange = (e) =>
    setFormData({ ...formdata, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    console.log(formdata.email, formdata.password);
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:5000/login", formdata);

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

  return (
    <div className="login">
      <h1>Login</h1>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Col sm="5">
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
          <Col sm="5">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formdata.password}
            />
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </div>
  );
};
export default Login;
