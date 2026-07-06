import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function AnimatedCounter({ to, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(to.toString().replace(/,/g, ''));
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
  }, [to, duration, isInView]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Impact() {
  const stats = [
    { label: "Government Schemes", value: 150, suffix: "+" },
    { label: "AI Financial Insights", value: 5000, suffix: "+" },
    { label: "Marketplace Listings", value: 1200, suffix: "+" },
    { label: "Women Empowered", value: 10000, suffix: "+" },
  ];

  return (
    <section id="impact" className="py-24 bg-purple-900 text-white relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-4"
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-purple-300">
                <AnimatedCounter to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base font-medium text-purple-200">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
