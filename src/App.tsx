import Nav from "./components/Nav";
import Hero from "./components/Hero";

export default function App() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
      </main>
    </>
  );
}
