import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createSignal, onMount, Show } from "solid-js";
import "./app.css";
import Nav from "~/components/Nav";
import Footer from "./components/Footer";
import { createClient } from "@supabase/supabase-js";
import { useNavigate, useLocation } from "@solidjs/router";
import ws from 'ws'

const supabase = createClient(
  "https://rwzsafzjrdqtrtalyzfz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3enNhZnpqcmRxdHJ0YWx5emZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTE0OTgsImV4cCI6MjA5MzQ2NzQ5OH0.ylIpVoOpwFP9JltF68oBZAT6JLfaDWuHDOxlkvwIiVU",
  {
    global: {
      fetch: fetch.bind(globalThis)
    },
    realtime: {
      transport: ws
    }
  }
)

export default function App() {
  return (
    <main class="mx-auto flex flex-col h-screen bg-base-100 text-base-content">
      <Router
        root={props => {
          const navigate = useNavigate()
          const location = useLocation()
          const [checked, setChecked] = createSignal(false)

          onMount(async () => {
            const { data } = await supabase.auth.getSession()
            if (!data.session && location.pathname !== "/Login") {
              navigate("/Login")
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
