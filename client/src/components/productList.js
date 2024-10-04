import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Chatbox from "../components/chat";
import Calender from "../components/Calender";
import BookingDetail from "../components/BookingDetail";
import Form from "react-bootstrap/Form";
import { Download } from "react-bootstrap-icons";

const ProductList = () => {
  const [product, setProduct] = useState([]);
  const [showChatBox, setShowChatBox] = useState(false);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  const getToken = () => {
    return localStorage.getItem("token");
  };
  const Token = getToken();

  const handleChatbox = () => {
    setShowChatBox(true);
  };

  const handleBookingClick = () => {
    setShowDatepicker(true);
  };

  const handleBookingDetailClick = () => {
    setShowBookingDetail(true); // Toggle BookingDetail visibility
  };

  const handleClose = () => {
    setShowChatBox(false);
    setShowDatepicker(false);
    setShowBookingDetail(false);
  };

  const handleImportCsv = async () => {
    if (!csvFile) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      
      const token = localStorage.getItem("token"); 
      const response = await axios.post(
        "http://localhost:5000/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        alert("CSV Imported Successfully");
        getProduct(); // Refresh the data
      }
    } catch (error) {
      console.error("Error importing CSV:", error);
    }
  };
  const handleChange = (e) => {
    const { files } = e.target;
    setCsvFile(files[0]);
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage

      const response = await axios.get("http://localhost:5000/export", {
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header with the token
        },
        responseType: "blob", // Important: specify responseType as 'blob' to handle binary data
      });

      // Create a new Blob object using the response data
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "productsData.csv"); // Name of the file to be downloaded
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up and remove the link element
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
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
      if (Array.isArray(response.data)) {
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
      <div className="main">
        {" "}
        {/* <h1>Prouct List</h1> */}
        <Form>
          <input
            type="file"
            name="file"
            className="file-input"
            onChange={handleChange}
            accept=".csv"
          />
          <Button
            variant="primary"
            onClick={handleImportCsv}
            className="import"
          >
            Import
          </Button>
        </Form>
      </div>

      <div className="chat-search">
        <input
          type="text"
          className="search"
          placeholder="Seach here"
          onChange={handleSearch}
        />
        <div className="booking-btn">
          <Button
            variant="primary"
            className="download_button"
            onClick={handleDownload}
          >
            <Download />
          </Button>
          <Button
            variant="primary"
            onClick={handleBookingClick}
            className=""
            style={{ marginRight: "10px" }}
          >
            Booking
          </Button>
          <Button
            variant="primary"
            className=""
            onClick={handleBookingDetailClick}
            style={{ marginRight: "10px" }}
          >
            Booking Detail
          </Button>
          <Button variant="primary" onClick={handleChatbox} className="">
            Chatbox
          </Button>
        </div>
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

      {/* calender component */}
      <Modal show={showDatepicker} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>calender Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calender handleClose={handleClose} />
        </Modal.Body>
      </Modal>

      {/* Booking Detail Modal */}
      <Modal show={showBookingDetail} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BookingDetail handleClose={handleClose} />
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
