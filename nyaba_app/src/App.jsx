import React from "react";
import "./App.css";
import AppSearch from "./pages/AppSearch";
import MarcheForm from "./pages/MarcheForm";
import TitulaireForm from "./pages/TitulaireForm";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Market_edit from "./pages/Market_edit";
import Market_details from "./pages/Market_details";
import UserManagement from "./pages/UserManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Dashboard" element={<Market_details />} />
        <Route path="/search" element={<AppSearch />} />
        <Route path="/add_market" element={<MarcheForm />} />
        <Route path="/edit_market/:id" element={<Market_edit />} />
        <Route path="/manage_users" element={<UserManagement />} />
        <Route path="/add_titulaire" element={<TitulaireForm />} />
        <Route path="*" element={"not found error 404"} /> {/* Page 404 */}
      </Routes>
    </Router>
  );
};

export default App;
