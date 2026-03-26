import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ScholarshipListingPage from "./pages/ScholarshipListingPage";
import ScholarshipDetailsPage from "./pages/ScholarshipDetailsPage";
import InternshipListingPage from "./pages/InternshipListingPage";
import InternshipDetailsPage from "./pages/InternshipDetailsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scholarships" element={<ScholarshipListingPage />} />
      <Route path="/scholarships/:id" element={<ScholarshipDetailsPage />} />
      <Route path="/internships" element={<InternshipListingPage />} />
      <Route path="/internships/:id" element={<InternshipDetailsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogDetailsPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
