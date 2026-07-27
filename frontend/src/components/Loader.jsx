import { Loader } from "lucide-react";
import { motion } from "framer-motion";

export const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Loader className="w-12 h-12 text-indigo-600" />
      </motion.div>
    </div>
  );
};

  