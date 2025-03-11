import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { PageHeader } from "../../components/page-header";
import { useSiteConfig } from "../../providers/site-config";
import { Footer } from "../../components/footer";

export function AdminAuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useSiteConfig();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    try {
      const data = await login(email, password);

      if (data?.error) {
        setErrorMessage(data.error);
        return;
      }

      // If no error, navigate to admin dashboard
      navigate("/admin");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Auth - Robot Vacuum Finder & Guide</title>
        <meta name="description" content="Login to your dashboard" />
      </Helmet>
      <div className="flex flex-col min-h-screen bg-background text-text">
        {/* Header / Hero style */}
        <PageHeader
          title="Admin Sign In"
          subtitle="Please enter your admin credentials to continue"
          containerClassName="border-b border-border"
        />

        {/* Main content (form) */}
        <main className="flex-grow px-6 py-8 sm:py-12">
          <div className="max-w-[1240px] px-4 mx-auto">
            <form onSubmit={handleLogin} className="bg-background-alt p-8 rounded border border-border space-y-4">
              {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}

              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-border rounded bg-background text-text focus:outline-none focus:ring-2 focus:ring-text/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full px-3 py-2 border border-border rounded bg-background text-text focus:outline-none focus:ring-2 focus:ring-text/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-background text-text border border-border rounded px-4 py-2 mt-4 hover:bg-background-alt hover:border-text transition-colors"
              >
                Sign In
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
