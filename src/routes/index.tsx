import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://rwzsafzjrdqtrtalyzfz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3enNhZnpqcmRxdHJ0YWx5emZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTE0OTgsImV4cCI6MjA5MzQ2NzQ5OH0.ylIpVoOpwFP9JltF68oBZAT6JLfaDWuHDOxlkvwIiVU"
)

export default function Index() {
  const navigate = useNavigate()

  onMount(async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      navigate("/home")
    } else {
      navigate("/login")
    }
  })

  return <></>
}
