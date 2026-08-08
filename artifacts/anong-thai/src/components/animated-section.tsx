import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function AnimatedSection({ children, id, className = '' }: { children: ReactNode, id?: string, className?: string }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
