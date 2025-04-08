"use client";

import Navbar from "./components/TopNav";
import Hero from "./components/Hero";
import PostSection from "./components/PostSection";
import Contact from "./components/Contact";
import Testimonial from "./components/Testimonial";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero/>
      <div id="room">
        <PostSection />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Testimonial />
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
