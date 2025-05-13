import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import SendForm from "./pages/SendForm";
import Application from "./pages/Application";
import UserApplications from "./pages/UserApplications";
import ApplicationRespond from "./pages/ApplicationRespond";
import Layout from "./layout/Layout";
import ProtectedRoute, { AdminRoute, UserRoute } from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoute>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/send"
                element={
                  <UserRoute>
                    <SendForm />
                  </UserRoute>
                }
              />
              <Route
                path="/application"
                element={
                  <AdminRoute>
                    <Application />
                  </AdminRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <UserRoute>
                    <UserApplications />
                  </UserRoute>
                }
              />
              <Route
                path="/application/:id/respond"
                element={
                  <AdminRoute>
                    <ApplicationRespond />
                  </AdminRoute>
                }
              />
            </Route>
          </Routes>
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
};

export default App;
