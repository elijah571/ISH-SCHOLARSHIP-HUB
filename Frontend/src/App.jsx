import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute } from "./components/ProtectedRoute";
import FloatingChatButton from "./components/FloatingChatButton";
import Loader from "./components/Loader";

const HomePage = lazy(() => import("./pages/HomePage"));
const ScholarshipListingPage = lazy(() => import("./pages/ScholarshipListingPage"));
const ScholarshipDetailsPage = lazy(() => import("./pages/ScholarshipDetailsPage"));
const InternshipListingPage = lazy(() => import("./pages/InternshipListingPage"));
const InternshipDetailsPage = lazy(() => import("./pages/InternshipDetailsPage"));
const CountryScholarshipsPage = lazy(() => import("./pages/CountryScholarshipsPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetailsPage = lazy(() => import("./pages/BlogDetailsPage"));
const ChatPage = lazy(() => import("./pages/ChatPage").then((m) => ({ default: m.ChatPage })));
const ApplyGuidePage = lazy(() => import("./pages/ApplyGuidePage"));
const StudentResourcesPage = lazy(() => import("./pages/StudentResourcesPage"));
const SuccessStoriesPage = lazy(() => import("./pages/SuccessStoriesPage"));
const ResumeReviewPage = lazy(() => import("./pages/ResumeReviewPage"));
const InterviewPrepPage = lazy(() => import("./pages/InterviewPrepPage"));
const EssayEditingPage = lazy(() => import("./pages/EssayEditingPage"));
const AdmissionConsultingPage = lazy(() => import("./pages/AdmissionConsultingPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader size="lg" />
  </div>
);

export default function App() {
  return (
    <>
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
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
