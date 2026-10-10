import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CmsProvider } from "./store/cms";
import { AnnouncementBar, Footer, MobileContactBar, Navbar } from "./components/layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { CourseDetail, Courses } from "./pages/Courses";
import { FaqsPage, Vehicles } from "./pages/Vehicles";
import { Contact, NotFound, Privacy } from "./pages/Contact";
import { Admin } from "./pages/Admin";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const TITLES: Record<string, string> = {
  "/": "Allied Driving School Lahore | Driving Lessons in DHA Phase 4, Lahore",
  "/about": "About | Allied Driving School Lahore",
  "/courses": "Driving Courses in Lahore | Allied Driving School",
  "/vehicles": "Training Vehicles & Offers | Allied Driving School Lahore",
  "/faqs": "FAQs | Allied Driving School Lahore",
  "/contact": "Contact & Enquire | Allied Driving School Lahore",
  "/privacy": "Privacy Policy | Allied Driving School Lahore",
  "/admin": "Admin | Allied Driving School Lahore",
};

function TitleManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/courses/")) {
      document.title = "Course details | Allied Driving School Lahore";
    } else {
      document.title = TITLES[pathname] ?? TITLES["/"];
    }
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <CmsProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
        <ScrollToTop />
        <TitleManager />
        <AnnouncementBar />
        <Navbar />
        <div className="min-h-[60vh] pb-20 lg:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        <MobileContactBar />
      </BrowserRouter>
    </CmsProvider>
  );
}
