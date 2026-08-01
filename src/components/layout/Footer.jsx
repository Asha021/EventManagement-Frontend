export default function Footer() {
  return (
    <footer className="border-t border-ink/15 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="font-display text-base text-ink/70">
          Cactus<span className="text-cactus-500 italic">Fashions</span> Events
        </div>
        <p className="eyebrow">&copy; 2026 &middot; Assignment demo &middot; dummy data only</p>
      </div>
    </footer>
  );
}
