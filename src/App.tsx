import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Pillars from "./components/Pillars";
import Numbers from "./components/Numbers";
import CaseStudies from "./components/CaseStudies";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Pillars />
        <Numbers />
        <CaseStudies />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

export default App;