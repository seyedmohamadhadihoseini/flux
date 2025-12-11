import Features from "./Features";
import Hero from "./Hero";
import Navbar from "./Navbar";


export default function HomePageComponent() {
  return (
    <main>
      <div className="background-glow"></div>
      <Navbar />
      <Hero />
      <Features />
      {/* <Footer /> */}
    </main>
  );
}