import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 font-display text-4xl">This page walked off the runway</h1>
      <p className="mt-3 text-sm text-muted">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6">
        <Button variant="cactus">Back to home</Button>
      </Link>
    </div>
  );
}
