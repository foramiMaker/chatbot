import React, { useEffect, useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const Navigate = useNavigate();
  const params = useParams();
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
  useEffect(() => {
    const getProduct = async () => {
      const result = await axios.get(
        `http://localhost:5000/product/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`, // Assuming it's a Bearer token
          },
        }
      );
      console.log(result.data);
      setFormData(result.data);
    };
    getProduct();
  }, [params.id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log(
      formdata.name,
      formdata.prise,
      formdata.category,
      formdata.company
    );
    const product = await axios.put(
      `http://localhost:5000/product/${params.id}`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${Token}`, // Assuming it's a Bearer token
        },
      }
    );

    if (product.data) {
      alert("data updte successfully");
      Navigate("/");
      console.log("dataupdate", product.data);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formdata, [e.target.name]: e.target.value });

  return (
    <div className="addProduct">
      <h3>update Product</h3>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Col sm="5">
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
          <Col sm="5">
            <Form.Control
              type="text"
              name="prise"
              placeholder="enter your prise"
              onChange={handleChange}
              value={formdata.prise}
            />
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
            />
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
            />
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit" onClick={handleUpdate}>
          Update
        </Button>
      </Form>
    </div>
  );
};
export default UpdateProduct;
