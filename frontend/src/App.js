import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login_page/Login";
import Register from "./pages/register_page/Register";
import Products from "./pages/Products";
import { ProtectedRoute, PrivateRoute } from "./utils/Route";
import Refresh from "./utils/Refresh";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Refresh />}>

        <Route element={<PrivateRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
       
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<Products />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
