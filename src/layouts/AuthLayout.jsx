import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink md:block">
        <svg viewBox="0 0 600 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="auth-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3F5A38" />
              <stop offset="100%" stopColor="#14150F" />
            </linearGradient>
          </defs>
          <rect width="600" height="900" fill="url(#auth-grad)" />
          <circle cx="470" cy="180" r="220" fill="#F1EFE3" fillOpacity="0.05" />
          <circle cx="90" cy="740" r="260" fill="#E6532C" fillOpacity="0.08" />
        </svg>
        <div className="grain-overlay absolute inset-0 mix-blend-overlay" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="font-display text-2xl text-paper">
            Cactus<span className="text-sand-300 italic">Fashions</span>
          </Link>
          <div>
            <p className="eyebrow text-paper/60">Event Management</p>
            <p className="mt-3 max-w-xs font-display text-3xl leading-snug text-paper">
              Runway shows, trunk shows, and trade fairs — one register.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
