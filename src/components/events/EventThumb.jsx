import { cn } from "../../lib/utils";

const palettes = {
  Runway: ["#3F5A38", "#1A2417"],
  "Trunk Show": ["#C9B98C", "#8A8674"],
  "Pop-Up": ["#E6532C", "#C43F1C"],
  "Trade Show": ["#14150F", "#3F5A38"],
  Workshop: ["#8A8674", "#3F5A38"],
  "Launch Party": ["#E6532C", "#3F5A38"],
};

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export default function EventThumb({ event, className }) {

  if (event.image) {
    return (
      <img
        src={event.image}
        alt={event.title}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const [c1, c2] = palettes[event.category] || ["#3F5A38", "#14150F"];
  const seed = hashStr(event._id);
  const angle = seed % 360;
  const cx = 20 + (seed % 60);
  const cy = 20 + ((seed >> 3) % 60);
  const r = 40 + (seed % 30);

  return (
    <div className={cn("relative overflow-hidden bg-ink", className)}>
    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`g-${event._id}`} gradientTransform={`rotate(${angle})`}>
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill={`url(#g-${event._id})`} />
        <circle cx={cx * 2} cy={cy * 2} r={r} fill="#F1EFE3" fillOpacity="0.08" />
        <circle cx={200 - cx * 1.5} cy={200 - cy} r={r * 0.6} fill="#F1EFE3" fillOpacity="0.06" />
      </svg>
      <div className="absolute inset-0 grain-overlay mix-blend-overlay" />
      <div className="absolute bottom-2 left-2 font-mono text-[10px] tracking-widest2 uppercase text-paper/70">
        {event.category}
      </div>
    </div>
  );
}