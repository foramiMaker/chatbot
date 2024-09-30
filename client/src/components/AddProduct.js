import React, { useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
  const Navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [formdata, setFormData] = useState({
    name: "",
    prise: "",
    category: "",
    company: "",
  });

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const Token = getToken();
  const handleAdd = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setValidated(true);

    console.log(
      formdata.name,
      formdata.prise,
      formdata.category,
      formdata.company
    );
    try {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      const response = await axios.post(
        "http://localhost:5000/addProduct",
        {
          ...formdata,
          userId,
        }, // Include userId in the request body
        {
          headers: {
            Authorization: `Bearer ${Token}`, // Assuming it's a Bearer token
          },
        }
      );
      if (response.data) {
        Navigate("/");
        console.log("productadd", response.data);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formdata, [e.target.name]: e.target.value });

  return (
    <div className="addProduct">
      <h1>Add Product Form</h1>
      <Form noValidate validated={validated}>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Col sm="5">
            <Form.Control
              type="text"
              placeholder="enter name"
              name="name"
              onChange={handleChange}
              value={formdata.name}
              required
            />

            <Form.Control.Feedback type="invalid">
              Please provide a name.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Col sm="5">
            <Form.Control
              type="text"
              name="prise"
              placeholder="enter your prise"
              onChange={handleChange}
              value={formdata.prise}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter prise.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Col sm="5">
            <Form.Control
              type="text"
              name="category"
              placeholder="enter category name"
              onChange={handleChange}
              value={formdata.category}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter category.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Col sm="5">
            <Form.Control
              type="text"
              name="company"
              placeholder="enter company name"
              onChange={handleChange}
              value={formdata.company}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please Enter compny.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit" onClick={handleAdd}>
          Add
        </Button>
      </Form>
    </div>
  );
};
export default AddProduct;
