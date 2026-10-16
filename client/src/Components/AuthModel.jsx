
import { useState } from "react";
import { useToast } from "../Context/ToastContext";

export default function AuthModel({ isOpen, onClose }) {
  const toast = useToast();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  const isLogin = mode === "login";

  function switchMode(nextMode) {
    setMode(nextMode);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        title: "Signup failed",
      });
      return;
    }

    if (!isLogin && !acceptedTerms) {
      toast.warning("Please accept the Terms and Conditions.", {
      title: "Action required",
      });
      return;
    }

    // UI only. FastAPI integration will be added later.
    console.log(
      isLogin
        ? { email, password, rememberMe }
        : { fullName, email, phone, password, acceptedTerms }
    );
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10";

  const labelClass = "block text-sm font-semibold text-slate-800";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative grid h-[min(760px,94dvh)] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Left promotional panel */}
        <aside
          className="relative hidden min-h-0 flex-col justify-between bg-cover bg-center p-8 text-white md:flex lg:p-10"
          style={{
            backgroundImage:
              "linear-gradient(180deg,rgba(8,12,35,.72),rgba(5,10,25,.9)),url(https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85)",
          }}
        >
          <div className="flex items-center gap-3 text-3xl font-bold">
            <span className="text-4xl text-emerald-400">▦</span>
            EventHub
          </div>

          <div>
            <div className="mb-5 h-1.5 w-14 rounded-full bg-emerald-400" />

            <h2 className="text-3xl font-bold leading-tight lg:text-4xl">
              Discover Amazing Events Around You
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-200 lg:text-lg">
              Find, book, and enjoy the best events — from tech conferences
              to music festivals, all in one place.
            </p>

            <div className="mt-7 space-y-5 lg:mt-9 lg:space-y-7">
              <Feature
                icon="⌕"
                color="bg-emerald-600"
                title="Explore Events"
                description="Search and find events that match your interests"
              />
              <Feature
                icon="▣"
                color="bg-purple-700"
                title="Book Easily"
                description="Secure your spot in just a few clicks"
              />
              <Feature
                icon="♧"
                color="bg-amber-600"
                title="Unforgettable Experiences"
                description="Be part of amazing events and communities"
              />
            </div>
          </div>

          <p className="text-sm text-slate-300">
            Your next unforgettable experience starts here.
          </p>
        </aside>

        {/* Right authentication panel */}
        <section className="relative flex min-h-0 flex-col px-5 pb-4 pt-5 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication"
            className="absolute right-4 top-3 z-10 text-3xl leading-none text-slate-500 hover:text-slate-900"
          >
            ×
          </button>

          {/* Login / Signup tabs */}
          <div className="grid shrink-0 grid-cols-2 gap-3 pr-8">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`rounded-xl py-2.5 font-semibold transition ${
                isLogin
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`rounded-xl py-2.5 font-semibold transition ${
                !isLogin
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Scrollable content; outer modal height stays fixed */}
          <div className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            <div className="mb-5 text-center">
              <h1
                id="auth-title"
                className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
              >
                {isLogin ? "Welcome Back" : "Create Your Account"}
              </h1>

              <p className="mt-1.5 text-sm text-slate-500">
                {isLogin
                  ? "Login to your account to continue"
                  : "Join EventHub and discover amazing events"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Signup-only fields */}
              {!isLogin && (
                <label className={labelClass}>
                  Full Name
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </label>
              )}

              <label className={labelClass}>
                Email Address
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={inputClass}
                />
              </label>

              {!isLogin && (
                <label className={labelClass}>
                  Phone Number{" "}
                  <span className="font-normal text-slate-400">
                    (Optional)
                  </span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className={inputClass}
                  />
                </label>
              )}

              <label className={labelClass}>
                Password
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      isLogin ? "current-password" : "new-password"
                    }
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      isLogin ? "Enter your password" : "Create a password"
                    }
                    className={`${inputClass} mt-0 pr-16`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-emerald-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {!isLogin && (
                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    Use at least 8 characters.
                  </span>
                )}
              </label>

              {!isLogin && (
                <label className={labelClass}>
                  Confirm Password
                  <div className="relative mt-1.5">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className={`${inputClass} mt-0 pr-16`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-emerald-700"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>
              )}

              {isLogin ? (
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="size-4 accent-emerald-700"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      toast.info("Password recovery will be implemented later.")
                    }
                    className="font-semibold text-emerald-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-slate-600">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 size-4 shrink-0 accent-emerald-700"
                  />
                  <span>
                    I agree to the{" "}
                    <a
                      href="/terms"
                      onClick={(e) => e.preventDefault()}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      onClick={(e) => e.preventDefault()}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-700 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
              >
                {isLogin ? "Login" : "Create Account"}
                <span className="text-xl">→</span>
              </button>
            </form>

            <div className="my-4 flex items-center gap-4">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-500">OR</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={() => toast.info("Google sign-in will be implemented later.")}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              <span className="text-xl font-bold text-blue-600">G</span>
              Continue with Google
            </button>
          </div>

          {/* Fixed footer */}
          <p className="shrink-0 pt-3 text-center text-sm text-slate-500">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isLogin ? "signup" : "login")}
              className="font-semibold text-emerald-700 hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}

function Feature({ icon, color, title, description }) {
  return (
    <div className="flex items-center gap-4">
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-full text-2xl lg:size-14 ${color}`}
      >
        {icon}
      </span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 max-w-xs text-sm leading-5 text-slate-300">
          {description}
        </p>
      </div>
    </div>
  );
}
