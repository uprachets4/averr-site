import Nav from './components/Nav';
import Hero from './components/Hero';
import ProofOfWork from './components/ProofOfWork';
import AgentFlow from './components/AgentFlow';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <ProofOfWork />
      <AgentFlow />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
