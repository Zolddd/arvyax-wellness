import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const carouselItems = [
  {
    img: "/hero1.jpg",
    slogan: "🧘 Find Your Inner Peace with Arvyax",
  },
  {
    img: "/hero2.jpg",
    slogan: "🌿 Recharge Your Mind & Body",
  },
  {
    img: "/hero3.jpg",
    slogan: "💚 Wellness Starts with You",
  },
];

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);

  // Manual navigation
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  };

  // Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Fetch sessions
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/sessions")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const publishedSessions = sessions.filter(
    (session) => session.status === "published"
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <Navbar onMobileMenuToggle={setMobileMenuOpen} />

      {/* Push-down animation */}
      <motion.div
        animate={{ marginTop: mobileMenuOpen ? 220 : 64 }}
        transition={{ duration: 0.3 }}
      >
        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto px-4 py-4">
          <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute w-full h-full"
              >
                <img
                  src={carouselItems[currentSlide].img}
                  alt="Slide"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex justify-center items-center text-center p-4">
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg"
                  >
                    {carouselItems[currentSlide].slogan}
                  </motion.h2>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/70 text-black p-2 rounded-full"
            >
              <FaArrowLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/70 text-black p-2 rounded-full"
            >
              <FaArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Published Sessions */}
        <section className="container mx-auto py-10 px-4">
          <h2 className="text-3xl font-bold mb-8 text-green-700 text-center">
            🌿 Published Sessions
          </h2>

          {/* Loader state */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                >
                  <div className="bg-green-200 h-12 w-full"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-green-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : publishedSessions.length === 0 ? (
            <p className="text-gray-500 text-center">
              No published sessions yet.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {publishedSessions.slice(0, visibleCount).map((session, index) => (
                  <motion.div
                    key={session._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    {/* Title bar */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {session.title}
                      </h3>
                    </div>

                    {/* Card content */}
                    <div className="p-5">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {session.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* View details button */}
                      <a
                        href={session.json_file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block w-full text-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      >
                        View Details
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < publishedSessions.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 9)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Footer */}
        <Footer />
      </motion.div>
    </div>
  );
};

export default Dashboard;
