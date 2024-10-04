import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import { Form, Col, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
// import Select from "react-select";

function Calender({ handleClose }) {
  const [startDate, setStartDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    slot: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hourSlots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
  ];

  // const handleSelectChange = (selectedOption) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     slot: selectedOption ? selectedOption.value : "",
  //   }));
  // };

  const handleDateChange = async (date) => {
    setStartDate(date);
    setSlots(hourSlots);

    try {
      const formattedDate = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
      )
        .toISOString()
        .split("T")[0];
      const response = await axios.get(
        `http://localhost:5000/bookings?date=${formattedDate}`
      );
      console.log("API Response:", response.data);
      // Assuming response.data is an array of booking objects
      const bookedSlotsData = response.data.map((booking) => booking.slot);
      console.log("Booked slots fetched from API:", bookedSlotsData);
      setBookedSlots(bookedSlotsData);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  const handleSlotBooking = (slot) => {
    if (bookedSlots.includes(slot)) {
      alert(`The slot "${slot}" is already booked!`);
      return;
    }

    setSelectedSlot(slot);
    setFormData((prev) => ({
      ...prev,
      slot: slot,
    }));
    setShowAppointmentForm(true); // Show the appointment form
  };

  // const handleAppointmentSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const bookingData = {
  //       ...formData,
  //       date: startDate.toDateString(),
  //       slot: selectedSlot,
  //     };

  //     const response = await axios.post("api/users/booking", bookingData);
  //     if (response.data) {
  //       alert("Booking successfully!");
  //       setBookedSlots((prev) => [...prev, selectedSlot]); // Add slot to booked slots
  //       handleClose(); // Close the modal after successful submission
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 400) {
  //       alert(error.response.data.message);
  //     } else {
  //       console.error("Error creating user:", error);
  //     }
  //   }

  //   setShowAppointmentForm(false); // Hide the appointment form after booking
  // };
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    try {
      const amount = formData.amount;
      // Create Razorpay order via backend
      const paymentResponse = await axios.post(
        `http://localhost:5000/createOrder`,
        {
          amount: amount, // Specify the amount to be charged (replace with your logic)
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the JWT token
          },
        }
      );

      const { orderId } = paymentResponse.data;

      const options = {
        key: "rzp_test_ekV0HR5il0Avnp", // Replace with your Razorpay key id
        amount: amount * 100, // Amount is in paise
        currency: "INR",
        name: formData.name,
        description: "Test Transaction",
        order_id: orderId, // Pass the order ID obtained from backend
        handler: async function (response) {
          // Handle successful payment here
          try {
            const userId = JSON.parse(localStorage.getItem("user"))._id;
            const bookingData = {
              ...formData,
              date: startDate.toDateString(),
              slot: selectedSlot,
              paymentId: response.razorpay_payment_id, // Save payment ID for reference
              userId,
            };

            const bookingResponse = await axios.post(
              `http://localhost:5000/booking`,
              bookingData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the JWT token
                },
              }
            );
            console.log("Headers Sent:", {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            });
            console.log("Booking Data Sent to API:", bookingData);
            if (bookingResponse.data) {
              alert("Booking successfully!");
              setBookedSlots((prev) => [...prev, selectedSlot]); // Add slot to booked slots
              handleClose(); // Close the modal after successful submission
            }
          } catch (error) {
            console.error("Error creating booking:", error);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error in booking:", error);
    }
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "4px" }}
    >
      <DatePicker selected={startDate} onChange={handleDateChange} inline />
      <div style={{ marginTop: "20px" }}>
        <h5>Select a time slot:</h5>
        {slots.length > 0 ? (
          <>
            {/* <p>
              Currently booked slots:{" "}
              {bookedSlots.length > 0 ? bookedSlots.join(", ") : "None"}
            </p> */}

            {slots.map((slot, index) => (
              <Button
                key={index}
                variant="outline-primary"
                style={{
                  margin: "5px",
                  backgroundColor: bookedSlots.includes(slot)
                    ? "#ccc"
                    : selectedSlot === slot
                    ? "#3399cc" // Highlight selected slot with a color
                    : "",
                  color: selectedSlot === slot ? "#fff" : "",
                  cursor: bookedSlots.includes(slot)
                    ? "not-allowed"
                    : "pointer",
                }}
                disabled={bookedSlots.includes(slot)}
                onClick={() => handleSlotBooking(slot)}
              >
                {slot}
              </Button>
            ))}
          </>
        ) : (
          <p>Please select a date to see available Booking.</p>
        )}
      </div>
      {/* Appointment Form */}
      {showAppointmentForm && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <h5>Booking Form</h5>
          <p>
            Booking for {selectedSlot} on {startDate.toDateString()}
          </p>
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextName">
              <Form.Label column sm="2">
                Name
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  onChange={handleChange}
                  value={formData.name}
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextMobile"
            >
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextMobile"
              >
                <Form.Label column sm="2">
                  Email
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Label column sm="2">
                Mobile Number
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="mobile"
                  value={formData.mobile}
                  placeholder="Enter mobile number"
                  onChange={handleChange}
                />
              </Col>
              <Form.Label column sm="2">
                Amout
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  placeholder="Enter amount"
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            {/* <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextMobile"
            >
              <Form.Label column sm="2">
                Slot
              </Form.Label>
              <Col sm="10">
                <Select
                  name="slot"
                  options={options}
                  value={options.find(
                    (option) => option.value === formData.slot
                  )}
                  onChange={handleSelectChange}
                  placeholder="Select a slot"
                />
              </Col>
            </Form.Group> */}
            {/* <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextMobile"
            >
              <Form.Label column sm="2">
                slot
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="slot"
                  value={formData.slot}
                  placeholder="Enter your slot"
                  onChange={handleChange}
                />
              </Col>
            </Form.Group> */}
          </Form>

          <Button variant="success" onClick={handleAppointmentSubmit}>
            Confirm Booking
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowAppointmentForm(false)}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

export default Calender;
