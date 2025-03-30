export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">
          CPU Scheduling Visualizer.
        </p>
        <p className="text-xs text-muted-foreground">
          Built for educational purposes to help understand operating system
          concepts.
        </p>
      </div>
    </footer>
  );
}
