import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://rwzsafzjrdqtrtalyzfz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3enNhZnpqcmRxdHJ0YWx5emZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTE0OTgsImV4cCI6MjA5MzQ2NzQ5OH0.ylIpVoOpwFP9JltF68oBZAT6JLfaDWuHDOxlkvwIiVU"
)

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [error, setError] = createSignal("")
  const [loading, setLoading] = createSignal(false)

  async function handleLogin() {
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email: email(),
      password: password()
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate("/")
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-base-200">
      <div class="card bg-base-100 w-96 shadow-xl p-8">
        <h1 class="text-3xl font-bold text-center mb-6 text-red-700">NiggaFlix</h1>
        
        {error() && (
          <div class="alert alert-error mb-4">
            <p>{error()}</p>
          </div>
        )}

        <div class="form-control gap-4">
          <input
            type="email"
            placeholder="Email"
            class="input input-bordered w-full"
            value={email()}
            onInput={(e) => setEmail(e.target.value)}
          /><br/><br/>
          <input
            type="password"
            placeholder="Password"
            class="input input-bordered w-full"
            value={password()}
            onInput={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          /><br/><br/>
          <button
            class="btn btn-error w-full"
            onClick={handleLogin}
            disabled={loading()}
          >
            {loading() ? <span class="loading loading-spinner"></span> : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  )
}
