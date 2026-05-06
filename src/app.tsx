import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createSignal, onMount, Show } from "solid-js";
import "./app.css";
import Nav from "~/components/Nav";
import Footer from "./components/Footer";
import { useNavigate, useLocation } from "@solidjs/router";

const SUPABASE_URL = "https://rwzsafzjrdqtrtalyzfz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3enNhZnpqcmRxdHJ0YWx5emZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTE0OTgsImV4cCI6MjA5MzQ2NzQ5OH0.ylIpVoOpwFP9JltF68oBZAT6JLfaDWuHDOxlkvwIiVU"

export default function App() {
  return (
    <main class="mx-auto flex flex-col h-screen bg-base-100 text-base-content">
      <Router
        root={props => {
          const navigate = useNavigate()
          const location = useLocation()
          const [checked, setChecked] = createSignal(false)

          onMount(async () => {
            try {
              const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
                headers: {
                  apikey: SUPABASE_KEY,
                  Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`
                }
              })
              if (!res.ok && location.pathname !== "/login") {
                navigate("/login")
              }
            } catch {
              if (location.pathname !== "/login") navigate("/login")
            }
            setChecked(true)
          })

          return (
            <>
              <Nav />
              <Show when={checked()}>
                <Suspense>{props.children}</Suspense>
              </Show>
              <Footer />
            </>
          )
        }}
      >
        <FileRoutes />
      </Router>
    </main>
  )
}