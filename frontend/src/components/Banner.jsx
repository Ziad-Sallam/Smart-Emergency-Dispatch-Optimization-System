import React from "react";

const Banner = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`left-0  items-center justify-between px-3 md:px-5 lg:px-24 xl:px-32 transition-all duration-500 z-50 font-medium text-sm text-white text-center bg-accent ${
        isScrolled
          ? "bg-primary/80 shadow-md text-gray-700 backdrop-blur-lg py-2.5 md:py-2.5"
          : "py-2.5 md:py-2.5"
      }`}
    >
      <p>
        <span className="px-3 py-1 rounded-md text-accent  bg-white mr-2">
          Report Accident
        </span>
        If you witness an emergency, contact us immediately
      </p>
    </div>
  );
};

export default Banner;
