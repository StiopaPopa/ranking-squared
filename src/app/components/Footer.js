import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-center text-md sm:text-xl text-gray-600">
      <div className="py-8">
        <p>© {currentYear} Ranking^2. All rights reserved.</p>
        <p className="mt-0.5 sm:mt-1">A satirical weekend project by Steve M</p>
        <p className="mt-1 sm:mt-2">
          <a
            href="mailto:stevelikespi@gmail.com"
            className="text-violet-500 hover:underline"
          >
            Contact Me
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
