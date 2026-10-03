import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { PageToneProvider } from "./lib/pageTone";
import { NavToneProvider } from "./lib/navTone";
import AmbientEnvironment from "./components/AmbientEnvironment";
import Home from "./pages/Home";

/**
 * Home stays eager — it is the landing route and the LCP surface, so
 * putting it behind a dynamic import would only add a round trip to the
 * page that matters most. Everything else splits.
 */
const Services = lazy(() => import("./pages/Services"));
const Work = lazy(() => import("./pages/Work"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

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

/**
 * The gap between routes.
 *
 * Deliberately not blank and not a spinner: it paints the page ground at
 * the height of a viewport, so a route change never flashes white and
 * never collapses the document to zero height. A collapsed main is what
 * makes the footer jump up and the scroll position lurch — the same
 * class of problem as the AnimatePresence gap (§5.6), one level up.
 */
function RouteFallback() {
  return (
    <div
      aria-hidden
      style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}
    />
  );
}

function App() {
  return (
    <PageToneProvider>
      <NavToneProvider>
        <ScrollToTop />
        <AmbientEnvironment />
        <Nav />
        <main id="main" style={{ position: "relative", zIndex: 1 }}>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<CaseStudy />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </NavToneProvider>
    </PageToneProvider>
  );
}

export default App;
