import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

// Lazy loaded components
const HeroSection = lazy(() => import('../components/home/HeroSection'));
const TestimonialCarousel = lazy(() => import('../components/home/TestimonialCarousel'));
const LatestUpdates = lazy(() => import('../components/home/LatestUpdates'));
const LoadingSpinner = lazy(() => import('../components/common/LoadingSpinner'));

function HomePage() {
  const { isAuthenticated } = useSelector(state => state.auth);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.05 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="home-page"
    >
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection isAuthenticated={isAuthenticated} />
        <TestimonialCarousel />
        <LatestUpdates />
      </Suspense>
    </motion.div>
  );
}

export default HomePage;
