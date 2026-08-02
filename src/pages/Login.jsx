import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";
import api from "../utils/API";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";


  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("cf_token", res.data.token);
      localStorage.setItem("cf_user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      navigate(from, { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p className="eyebrow mb-2">Welcome back</p>
      <h1 className="font-display text-3xl">Log in to your account</h1>
      <p className="mt-2 text-sm text-muted">
        Demo credentials: <span className="text-ink/70">aisha@example.com</span> /{" "}
        <span className="text-ink/70">password123</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="border border-bloom-100 bg-bloom-50 px-3 py-2 text-sm text-bloom-600">
            {error}
          </p>
        )}

        <Button type="submit" variant="cactus" className="w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-cactus-600 underline underline-offset-4">
          Register
        </Link>
      </p>
    </div>
  );
}