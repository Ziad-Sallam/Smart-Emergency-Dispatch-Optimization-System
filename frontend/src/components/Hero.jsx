import React from "react";
import heroBg from "../assets/hero_bg_4.jpg";


const Hero = () => {
  return (
    <div
      className="flex items-center
    md:px-16 lg:px-24 xl:px-32 text-white bg-no-repeat bg-cover bg-center h-screen p-0"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <section className="w-1/2 px-30">
        <p className="inline-block bg-primary/50 px-3.5 py-1 rounded-full mt-20">
          Help us save people!
        </p>
        <h1 className="text-2x1 md:text-5x1 md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4">
          Act Fast. Save Lives.
        </h1>
        <p className="max-w-130 mt-2 text-sm md:text-base text-secondary">
          Every second counts during an emergency. Our Smart Emergency Dispatch
          system connects you directly with trained responders in real time,
          ensuring help arrives as quickly as possible. If you witness an
          accident or urgent situation, don’t hesitate—report it immediately.
          Your swift action can make a difference and help save lives.
        </p>
      </section>
      <section className="w-1/2 flex flex-col items-center mt-10">
        <form className="flex flex-col items-center text-sm bg-white text-gray-500 rounded-lg px-6 py-4">
          <p className="bg-primary/50 px-3.5 py-1 rounded-full mt-10 text-white">
            Contact Us
          </p>
          <h1 className="text-4xl font-semibold text-slate-700 pb-4">
            Get in touch with us
          </h1>
          <p className="text-sm text-gray-500 text-center pb-10 max-w-[60ch] mx-auto">
            If you witness an accident or emergency, please fill out the form on
            the right with your the incident location, incident severity,
            incident type, and a brief description of the situation.
            <br />
            Make sure to include the exact location and any critical details.{" "}
            <br />
            Once submitted, our dispatch system will immediately alert trained
            responders to provide assistance.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-8 w-[350px] md:w-[700px]">
            <div className="w-full">
              <label className="text-black/70" htmlFor="name">
                Your Name
              </label>
              <input
                className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300"
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <label className="text-black/70" htmlFor="name">
                Your Email
              </label>
              <input
                className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300"
                type="email"
                required
              />
            </div>
          </div>

          <div className="mt-6 w-[350px] md:w-[700px]">
            <label className="text-black/70" htmlFor="name">
              Message
            </label>
            <textarea
              className="w-full mt-2 p-2 h-40 border border-gray-500/30 rounded resize-none outline-none focus:border-indigo-300"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="mt-5 bg-accent text-white h-12 w-56 px-4 rounded active:scale-95 transition"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default Hero;
