import { Col, Form, Row, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  //   const [name, setName] = useState("");
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");

  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  });

  const handleChange = (e) =>
    setFormData({ ...formdata, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await axios.post(
        "http://localhost:5000/create",
        formdata
      );

      if (response.data) {
        console.log("Data saved successfully:", response.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        localStorage.setItem("token", response.data.token);
        navigate("/add");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div
      className="Register-form"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h1>Register</h1>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="enter name"
              name="name"
              onChange={handleChange}
              value={formdata.name}
            />
          </Col>
        </Form.Group>

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
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Signup;
