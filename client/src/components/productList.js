import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Chatbox from "../components/chat";

const ProductList = () => {
  const [product, setProduct] = useState([]);
  const [showChatBox, setShowChatBox] = useState(false);
  const getToken = () => {
    return localStorage.getItem("token");
  };
  const Token = getToken();

  const handleChatbox = () => {
    setShowChatBox(true);
  };

  const handleClose = () => {
    setShowChatBox(false);
  };

  const handleDelete = async (id) => {
    const product = await axios.delete(`http://localhost:5000/Delete/${id}`, {
      headers: {
        Authorization: `Bearer ${Token}`, // Assuming it's a Bearer token
      },
    });
    alert("delete record", product.data.message);
    getProduct();
  };

  const handleSearch = async (e) => {
    const key = e.target.value;
    if (key) {
      try {
        const response = await fetch(`http://localhost:5000/search/${key}`, {
          headers: {
            Authorization: `Bearer ${Token}`, // Assuming it's a Bearer token
          },
        });

        const result = await response.json();

        if (result.product) {
          setProduct(result.product);
        } else {
          console.error(
            "Search result does not contain a valid product array:",
            result
          );
        }
      } catch (err) {
        console.error("Search error:", err.message);
      }
    } else {
      getProduct(); // Fetch all products if no search key is provided
    }
  };

  const getProduct = async () => {
    try {
      const response = await axios.get("http://localhost:5000/fetchproduct", {
        headers: {
          Authorization: `Bearer ${Token}`, // Assuming it's a Bearer token
        },
      });
      if (response.data) {
        setProduct(response.data);
      } else {
        console.error("Fetch response data is not an array:", response.data);
        setProduct([]);
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
      setProduct([]); // Optionally handle errors by setting an empty array
    }
  };
  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="table" style={{ maxHeight: "500px", overflowY: "auto" }}>
      <h1>Prouct List</h1>

      <div className="chat-search">
        <input
          type="text"
          className="search"
          placeholder="Seach here"
          onChange={handleSearch}
        />
        <Button variant="primary" onClick={handleChatbox} className="">
          Chatbox
        </Button>
      </div>
      {/* chat box */}
      <Modal show={showChatBox} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>chat Box</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Chatbox Token={Token} handleClose={handleClose} />
        </Modal.Body>
      </Modal>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Prise</th>
            <th>category</th>
            <th>company</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {product.length === 0 ? (
            <tr>
              <td colSpan="6">No products found</td>
            </tr>
          ) : (
            product.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.prise}</td>
                <td>{item.category}</td>
                <td>{item.company}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                  <Link to={`/update/${item._id}`}>
                    <Button variant="primary" className="edit-button">
                      Edit
                    </Button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};
export default ProductList;
