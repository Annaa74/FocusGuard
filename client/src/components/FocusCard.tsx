import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FocusCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FocusCard({ children, className = "", delay = 0 }: FocusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`
        bg-card rounded-2xl border border-border/50 shadow-xl shadow-black/5 
        overflow-hidden ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
