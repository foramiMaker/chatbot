// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import logo from "../../src/images/logo.avif";

// function Nav() {
//   const auth = localStorage.getItem("user");
//   const Navigate = useNavigate();
//   const logOut = () => {
//     localStorage.clear();
//     Navigate("/signup");
//   };

//   return (
//     <div className="">
//       <img alt="logo" src={logo} className="logo" />
//       {auth ? (
//         <ul className="nav-ul">
//           <li>
//             <Link to="/">Products</Link>
//           </li>

//           <li>
//             <Link to="/add">Add Products</Link>
//           </li>

//           <li>
//             <Link to="/update">Update Products</Link>
//           </li>

//           <li>
//             <Link to="/profile">Profile</Link>
//           </li>
//           <li>
//             <Link to="/signup" onClick={logOut}>
//               Logout ({JSON.parse(auth).name})
//             </Link>
//           </li>
//         </ul>
//       ) : (
//         <ul className="nav-ul nav-right">
//           <li>
//             <Link to="/signup">Register</Link>
//           </li>
//           <li>
//             <Link to="/login">Login</Link>
//           </li>
//         </ul>
//       )}
//     </div>
//   );
// }

// export default Nav;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../src/images/logo.avif";

function Nav() {
  const auth = localStorage.getItem("user");
  const Navigate = useNavigate();

  const logOut = () => {
    localStorage.clear();
    Navigate("/signup");
  };

  // Parse the user only if it exists
  let user = null;
  if (auth) {
    try {
      user = JSON.parse(auth); // Attempt to parse only if auth is not null
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user"); // Clear invalid data
    }
  }

  return (
    <div className="">
      <img alt="logo" src={logo} className="logo" />
      {user ? ( // Check if user is parsed successfully
        <ul className="nav-ul">
          <li>
            <Link to="/">Products</Link>
          </li>
          <li>
            <Link to="/add">Add Products</Link>
          </li>
          <li>
            <Link to="/update">Update Products</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/signup" onClick={logOut}>
              Logout ({user.name}) {/* Use user name from parsed object */}
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="nav-ul nav-right">
          <li>
            <Link to="/signup">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Nav;
