import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const scrollToSimulator = () => {
    const simulatorSection = document.getElementById("simulator");
    if (simulatorSection) {
      simulatorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-10 pb-20 sm:pt-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
          CPU Scheduling
          <br />
          <span className="text-gray-400">Visualization</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10">
          CPU scheduling is a fundamental concept in operating systems that
          determines which process gets the CPU for execution. This interactive
          tool helps you visualize and understand different scheduling
          algorithms and their impact on system performance.
        </p>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Button
            onClick={scrollToSimulator}
            className="relative group px-8 py-6 text-lg bg-gradient-to-r from-primary to-accent hover:cursor-pointer hover:opacity-90"
          >
            <span className="relative z-10 flex items-center">
              Try the simulator
              <ArrowDown className="h-4 w-4 ml-2" />
            </span>
            <div className="absolute inset-0 bg-white/20 blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
