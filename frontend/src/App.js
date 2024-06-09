import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login_page/Login";
import Register from "./pages/register_page/Register";
import Products from "./pages/product_list/Products";
import { ProtectedRoute, PrivateRoute } from "./utils/Route";
import Refresh from "./utils/Refresh";
import ProductDetails from "./pages/product_details/ProductDetails";
import AddProduct from "./pages/add_product/AddProduct";
import NavBar from "./components/nav_bar/NavBar";

function App() {
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Refresh />}>
          <Route element={<PrivateRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route index element={<Products />} />
            <Route path="products" element={<Products />} />
            <Route path="details/:id" element={<ProductDetails />}></Route>
            <Route path="add-product" element={<AddProduct />} />
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/' />}></Route>
      </Routes>
    </>
  );
}

export default App;
