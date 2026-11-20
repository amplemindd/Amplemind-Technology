import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Nav from "./Components/nav";
import Home from "./Components/home";
import About from "./Components/about";
import Contact from "./Components/contact";
import Faq from "./Components/faq";
import Footer from "./Components/footer";
import Service from "./Components/service";

import Terms from "./Components/terms";
import Privacy from "./Components/privacy";
import Cookies from "./Components/cookies";
import ScrollToTop from "./Components/scrollToTop";
import Careers from "./Components/career";

import Signup from "./Components/signup";
import Login from "./Components/login";
import Admin from "./Components/admin";
import Blogs from "./Components/blogs";

/* ChatBot */
import ChatBot from "./Components/ChatBot/ChatBot";

/* Student */
import StudentLogin from "./Components/Student/StudentLogin";
import StudentRegister from "./Components/Student/StudentRegister";
import ForgotPassword from "./Components/Student/ForgotPassword";
import VerifyOTP from "./Components/Student/VerifyOTP";
import ResetPassword from "./Components/Student/ResetPassword";
import StudentDashboard from "./Components/Student/StudentDashboard";
import MyCourses from "./Components/Student/MyCourses";
import CourseDetails from "./Components/Student/CourseDetails";
import MyTests from "./Components/Student/MyTests";
import Results from "./Components/Student/Results";
import Certificates from "./Components/Student/Certificates";
import Payments from "./Components/Student/Payments";
import Profile from "./Components/Student/Profile";
import ChangePassword from "./Components/Student/ChangePassword";
import Notifications from "./Components/Student/Notifications";

function Layout() {
  const location = useLocation();

  const hideLayout =
    /* Admin */

    location.pathname === "/admin-login" ||
    location.pathname === "/admin-dashboard" ||
    /* Student Auth */

    location.pathname === "/student-login" ||
    location.pathname === "/student-register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/verify-otp" ||
    location.pathname === "/reset-password" ||
    /* Student Dashboard */

    location.pathname === "/student-dashboard" ||
    location.pathname === "/my-courses" ||
    location.pathname.startsWith("/course-details") ||
    location.pathname === "/my-tests" ||
    location.pathname === "/results" ||
    location.pathname === "/certificates" ||
    location.pathname === "/payments" ||
    location.pathname === "/profile" ||
    location.pathname === "/change-password" ||
    location.pathname === "/notifications";

  return (
    <>
      {!hideLayout && <Nav />}

      <Routes>
        {/* Home */}

        <Route path="/" element={<Home />} />

        <Route path="/home" element={<Home />} />

        {/* About */}

        <Route path="/about-us" element={<About />} />

        {/* Services */}

        <Route path="/services" element={<Service />} />

        {/* Contact */}

        <Route path="/contact-us" element={<Contact />} />

        {/* FAQ */}

        <Route path="/faqs" element={<Faq />} />

        {/* Careers */}

        <Route path="/careers" element={<Careers />} />

        {/* Login */}

        <Route path="/login" element={<Login />} />

        {/* Signup */}

        <Route path="/signup" element={<Signup />} />

        {/* Blogs */}

        <Route path="/blogs" element={<Blogs />} />

        {/* Admin */}

        <Route path="/admin-login" element={<Admin />} />

        <Route path="/admin-dashboard" element={<Admin />} />

        {/* Legal */}

        <Route path="/terms" element={<Terms />} />

        <Route path="/privacy" element={<Privacy />} />

        <Route path="/cookies" element={<Cookies />} />

        {/* ================= Student ================= */}

        <Route path="/student-login" element={<StudentLogin />} />

        <Route path="/student-register" element={<StudentRegister />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/student-dashboard" element={<StudentDashboard />} />

        <Route path="/my-courses" element={<MyCourses />} />

        <Route path="/course-details/:id" element={<CourseDetails />} />

        <Route path="/my-tests" element={<MyTests />} />

        <Route path="/results" element={<Results />} />

        <Route path="/certificates" element={<Certificates />} />

        <Route path="/payments" element={<Payments />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/notifications" element={<Notifications />} />
      </Routes>

      {!hideLayout && <Footer />}

      {!hideLayout && <ChatBot />}
    </>
  );
}

function Appp() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Layout />
    </BrowserRouter>
  );
}

export default Appp;