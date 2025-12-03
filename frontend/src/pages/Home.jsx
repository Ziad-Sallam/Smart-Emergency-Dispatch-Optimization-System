import React from "react";
import Hero from "../components/homepage/Hero";
import Footer from "../components/homepage/Footer";
import Gallery from "../components/homepage/Gallery";
import Banner from "../components/homepage/Banner";
import Navbar from "../components/homepage/Navbar";

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
