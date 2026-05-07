import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import ScholarshipListingPage from "./pages/ScholarshipListingPage";
import ScholarshipDetailsPage from "./pages/ScholarshipDetailsPage";
import InternshipListingPage from "./pages/InternshipListingPage";
import InternshipDetailsPage from "./pages/InternshipDetailsPage";
import CountryScholarshipsPage from "./pages/CountryScholarshipsPage";
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
import { ChatPage } from "./pages/ChatPage";
import ApplyGuidePage from "./pages/ApplyGuidePage";
import StudentResourcesPage from "./pages/StudentResourcesPage";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import ResumeReviewPage from "./pages/ResumeReviewPage";
import InterviewPrepPage from "./pages/InterviewPrepPage";
import EssayEditingPage from "./pages/EssayEditingPage";
import AdmissionConsultingPage from "./pages/AdmissionConsultingPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import FloatingChatButton from "./components/FloatingChatButton";

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scholarships" element={<ScholarshipListingPage />} />
      <Route path="/scholarships/:id" element={<ScholarshipDetailsPage />} />
      <Route path="/countries/:country" element={<CountryScholarshipsPage />} />
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
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
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
      <Route path="/apply-guide" element={<ApplyGuidePage />} />
      <Route path="/student-resources" element={<StudentResourcesPage />} />
      <Route path="/success-stories" element={<SuccessStoriesPage />} />
      <Route path="/services/resume-review" element={<ResumeReviewPage />} />
      <Route path="/services/interview-prep" element={<InterviewPrepPage />} />
      <Route path="/services/essay-editing" element={<EssayEditingPage />} />
      <Route path="/services/admission-consulting" element={<AdmissionConsultingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
    </Routes>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <FloatingChatButton />
    </>
  );
}
