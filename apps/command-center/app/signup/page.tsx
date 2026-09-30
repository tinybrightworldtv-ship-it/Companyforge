import Link from "next/link";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string; created?: string }> }) {
  const params = await searchParams;
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-brand"><div className="auth-mark">C</div><span>CompanyForge</span></div>
        <div className="auth-card">
          <div className="auth-kicker">START YOUR COMPANY</div>
          <h1>Build something real.</h1>
          <p className="auth-subtitle">Create your account. Then CompanyForge helps turn your idea into an operating business.</p>
          {params.created === "1" && <div className="auth-success">Check your email to confirm your CompanyForge account, then sign in.</div>}
          {params.error === "account_exists" && <div className="auth-error">An account with this email already exists. Try signing in.</div>}
          {params.error === "invalid_input" && <div className="auth-error">Enter your name, a valid email and a password with at least 8 characters.</div>}
          {params.error === "signup_failed" && <div className="auth-error">We could not create the account. Please try again.</div>}
          <form action="/auth/signup" method="post" className="auth-form">
            <label>Your name<input name="name" type="text" autoComplete="name" required placeholder="Your name" /></label>
            <label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
            <label>Password<input name="password" type="password" autoComplete="new-password" minLength={8} required placeholder="At least 8 characters" /></label>
            <button type="submit" className="auth-primary">Create account <span>→</span></button>
          </form>
          <p className="auth-terms">By creating an account, you agree to use CompanyForge responsibly and keep control of consequential actions.</p>
          <div className="auth-divider"><span>Already have an account?</span></div>
          <Link href="/login" className="auth-secondary">Sign in</Link>
        </div>
        <p className="auth-footer">Research → Strategy → Build → Launch → Operate → Improve</p>
      </section>
    </main>
  );
}