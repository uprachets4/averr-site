import Nav from './components/Nav';
import Hero from './components/Hero';
import AgentFlow from './components/AgentFlow';
import ProofOfWork from './components/ProofOfWork';
import HowIWork from './components/HowIWork';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <AgentFlow />
      <ProofOfWork />
      <HowIWork />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
