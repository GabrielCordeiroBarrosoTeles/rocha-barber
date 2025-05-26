// Removida importação do Router que não é mais necessária neste componente
import Header from "./components/Header"
import Hero from "./components/Hero"
import Services from "./components/Services"
import Features from "./components/Features"
import About from "./components/About"
import Testimonials from "./components/Testimonials"
import CTA from "./components/CTA"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import FAQ from "./components/FAQ"

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Services />
        <About />
        <Testimonials />
        <FAQ />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}