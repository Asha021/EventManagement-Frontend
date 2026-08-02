import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import api from "../utils/apiClient";

export default function Register() {

  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert(res.data.message);

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div>
      <p className="eyebrow mb-2">Join the register</p>
      <h1 className="font-display text-3xl">Create your account</h1>
      <p className="mt-2 text-sm text-muted">Register to browse and book fashion events.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Aisha Verma"
          />
        </div>
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
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            required
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="border border-bloom-100 bg-bloom-50 px-3 py-2 text-sm text-bloom-600">{error}</p>}

        <Button type="submit" variant="cactus" className="w-full" disabled={submitting}>
          {submitting ? "Creating account…" : "Register"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already registered?{" "}
        <Link to="/login" className="text-cactus-600 underline underline-offset-4">
          Log in
        </Link>
      </p>
    </div>
  );
}
