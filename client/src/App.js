import "./App.css";
import Nav from "./components/Nav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/footer";
import Signup from "./components/Signup";
import PrivateComponent from "./components/privateComponent";
import Login from "./components/login";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/productList";
import UpdateProduct from "./components/updateProduct";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<ProductList/>} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/update/:id" element={<UpdateProduct/>} />
            <Route path="/logout" element={<h1>logout Product component</h1>} />
            <Route
              path="/profile"
              element={<h1>profile Product component</h1>}
            />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      {/* <Signup /> */}
      <Footer />
    </div>
  );
}

export default App;
