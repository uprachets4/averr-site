import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { PageToneProvider } from "./lib/pageTone";
import { NavToneProvider } from "./lib/navTone";
import AmbientEnvironment from "./components/AmbientEnvironment";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServicesNext from "./pages/ServicesNext";
import Work from "./pages/Work";
import CaseStudy from "./pages/CaseStudy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(
    function scrollOnRouteChange() {
      if (hash) return;
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [pathname, hash]
  );
  return null;
}

function App() {
  return (
    <PageToneProvider>
      <NavToneProvider>
      <ScrollToTop />
      <AmbientEnvironment />
      <Nav />
      <main id="main" style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          {/* 17c work-in-progress. noindex, linked from nowhere, deleted in
              17c-3 when it replaces /services. */}
          <Route path="/services/next" element={<ServicesNext />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      </NavToneProvider>
    </PageToneProvider>
  );
}

export default App;
