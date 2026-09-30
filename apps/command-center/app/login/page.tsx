import Link from "next/link";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-brand"><div className="auth-mark">C</div><span>CompanyForge</span></div>
        <div className="auth-card">
          <div className="auth-kicker">YOUR AI COMPANY OPERATING SYSTEM</div>
          <h1>Welcome back.</h1>
          <p className="auth-subtitle">Sign in and continue building, launching and operating your company.</p>
          {params.error === "invalid_credentials" && <div className="auth-error">The email or password is incorrect.</div>}
          <form action="/auth/login" method="post" className="auth-form">
            <label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
            <label>Password<input name="password" type="password" autoComplete="current-password" required placeholder="Your password" /></label>
            <button type="submit" className="auth-primary">Sign in <span>→</span></button>
          </form>
          <div className="auth-divider"><span>New to CompanyForge?</span></div>
          <Link href="/signup" className="auth-secondary">Create your company account</Link>
        </div>
        <p className="auth-footer">One account. Your companies. Your AI workforce.</p>
      </section>
    </main>
  );
}