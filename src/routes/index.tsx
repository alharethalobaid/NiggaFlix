import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://rwzsafzjrdqtrtalyzfz.supabase.co",
  "your_anon_key_here"
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
