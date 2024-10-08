// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const GoogleRedirect = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");
//     const user = params.get("user");

//     // Log the raw values from the URL
//     console.log("Raw token from URL:", token);
//     console.log("Raw user from URL:", user);

//     if (token && user) {
//       try {
//         const decodedUser = decodeURIComponent(user); // First decode the URL-encoded string
//         console.log("Decoded user string:", decodedUser);

//         let parsedUser = JSON.parse(decodedUser); // Parse the user JSON string
//         console.log("Parsed user object:", parsedUser);

//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(parsedUser)); // Store the object as a string
//         console.log("User and Token stored:", parsedUser, token);
//         navigate("/"); // Redirect to home or dashboard
//       } catch (err) {
//         console.error("Failed to parse user data:", err);
//         alert("Login failed. Please try again.");
//       }
//     } else {
//       alert("Login failed. Please try again.");
//     }
//   }, [navigate]);

//   return <div>Loading...</div>;
// };

// export default GoogleRedirect;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userEncoded = params.get("user");

    // Log the raw values from the URL
    console.log("Raw token from URL:", token);
    console.log("Raw user from URL:", userEncoded);

    if (token && userEncoded) {
      try {
        const decodedUser = decodeURIComponent(userEncoded);
        const parsedUser = JSON.parse(decodedUser);

        if (parsedUser && parsedUser._id) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(parsedUser));
          navigate("/"); // Redirect to home or dashboard
        } else {
          throw new Error("Invalid user data");
        }
      } catch (err) {
        console.error("Error during token/user processing:", err);
        alert("Login failed. Please try again.");
      }
    }
    // else {
    //   console.error("Token or user data missing in URL params.");
    //   alert("Login failed. Please try again.");
    // }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default GoogleRedirect;
