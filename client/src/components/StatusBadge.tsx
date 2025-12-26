import { CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface StatusBadgeProps {
  isOnTrack: boolean;
  score: number;
}

export function StatusBadge({ isOnTrack, score }: StatusBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
        ${isOnTrack 
          ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
          : "bg-rose-50 text-rose-700 border border-rose-100"
        }
      `}
    >
      {isOnTrack ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <AlertTriangle className="w-4 h-4" />
      )}
      <span>
        {isOnTrack ? "On Track" : "Drifting"}
      </span>
      <span className="w-px h-3 bg-current opacity-20 mx-1" />
      <span className="font-bold">{score}% Match</span>
    </motion.div>
  );
}
