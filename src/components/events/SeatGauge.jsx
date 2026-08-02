import { cn } from "../../lib/utils";

export default function SeatGauge({ event, className }) {
  const left = event.availableSeats || 0;
  const registered = event.capacity ? event.capacity - left : 0;
  const rate = event.capacity ? registered / event.capacity : 0;
  const isFull = left === 0;
  const isAlmostFull = !isFull && rate >= 0.85;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="eyebrow">
          {isFull ? "Sold out" : `${left} seat${left === 1 ? "" : "s"} left`}
        </span>
        <span className="font-mono text-[10px] text-muted">
          {registered}/{event.capacity}
        </span>
      </div>
      <div className="h-1.5 w-full bg-ink/10 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500",
            isFull ? "bg-bloom" : isAlmostFull ? "bg-sand-300" : "bg-cactus-500"
          )}
          style={{ width: `${rate * 100}%` }}
        />
      </div>
    </div>
  );
}
