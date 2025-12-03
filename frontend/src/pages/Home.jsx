import React from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Gallery from "../components/Gallery";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <div className="fixed w-full ">
        <Banner />
        <Navbar />
      </div>
      <Hero />
      <Gallery />
      <Footer />
    </>
  );
};

export default Home;
