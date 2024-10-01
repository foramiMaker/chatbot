import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
// import "./App.css";
import axios from "axios";

// axios.defaults.baseURL = "http://localhost:5000/";

function BookingDetail() {
  const [bookingList, setBookingList] = useState([]);

  const getFetchData = async (e) => {
    try {
      const response = await axios.get(`http://localhost:5000/bookingdetails`);
      console.log(response.data);
      setBookingList(response.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  useEffect(() => {
    getFetchData();
  }, []);

  console.log(bookingList);

  return (
    <div>
      {" "}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Slot</th>
            <th>Mobile</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {bookingList[0] ? (
            bookingList.map((el, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{el.name}</td>
                  <td>{el.slot}</td>
                  <td>{el.mobile}</td>
                  <td>{el.date}</td>
                  <td> </td>
                </tr>
              );
            })
          ) : (
            <p style={{ textalign: "center" }}>No Data</p>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default BookingDetail;
