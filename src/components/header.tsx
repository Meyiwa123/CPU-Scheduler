import { Cpu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-center">
        <div className="flex items-center gap-2 font-bold">
          <Cpu className="h-6 w-6" />
          <span className="hidden sm:inline-block">
            CPU Scheduling Visualizer
          </span>
          <span className="sm:hidden">CPU Scheduler</span>
        </div>

        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a
            href="#simulator"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Simulator
          </a>
          <a
            href="#algorithms"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Algorithms
          </a>
        </nav>
      </div>
    </header>
  );
}
