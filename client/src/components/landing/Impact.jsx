import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

function AnimatedCounter({ to, suffix = "", duration = 2 }) {
  const shouldReduceMotion = useReducedMotion();
  const end = parseInt(to.toString().replace(/,/g, ''));
  const [count, setCount] = useState(shouldReduceMotion ? end : 0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;

    let start = 0;
    if (start === end) return;

    const totalMilSecDur = duration * 1000;
    const incrementTime = (totalMilSecDur / end) * 5; // Adjust speed

    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMilSecDur / 50));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [to, duration, isInView, shouldReduceMotion]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Impact() {
  const shouldReduceMotion = useReducedMotion();
  const stats = [
    { label: "Government Schemes", value: 150, suffix: "+" },
    { label: "AI Financial Insights", value: 5000, suffix: "+" },
    { label: "Marketplace Listings", value: 1200, suffix: "+" },
    { label: "Entrepreneurs Empowered", value: 10000, suffix: "+" },
  ];

  return (
    <section id="impact" className="py-24 bg-[#0B192C] text-white relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-4">
              <div className="text-4xl md:text-5xl font-black mb-2 text-white">
                <AnimatedCounter to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base font-semibold text-[#B85042]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
