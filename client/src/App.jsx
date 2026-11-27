

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/Register";
import ProductList from "./components/ProductList";
import AuthProvider from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import PosterBuilder from "./pages/user/PosterBuilder.jsx";
import MyPoster from "./pages/user/MyPoster.jsx";
import PosterReview from "./pages/admin/PosterReview.jsx";
import AdminProducts from "./pages/admin/AddProduct.jsx";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<><Navbar /><ProductList /></>} />
            <Route path="/my-poster" element={<><Navbar /><MyPoster /></>} />
            <Route path="/poster-builder" element={<><Navbar /><PosterBuilder /></>} />
          </Route>
          <Route path="/admin/posters" element={<><Navbar variant="admin" /><PosterReview /></>} />
          <Route path="/admin/products" element={<><Navbar variant="admin" /><AdminProducts /></>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;