import { createResource, For, Suspense, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

const SUPABASE_URL = "https://rwzsafzjrdqtrtalyzfz.supabase.co/rest/v1/roms"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3enNhZnpqcmRxdHJ0YWx5emZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTE0OTgsImV4cCI6MjA5MzQ2NzQ5OH0.ylIpVoOpwFP9JltF68oBZAT6JLfaDWuHDOxlkvwIiVU"
const THUMBNAILS_URL = "https://videos.alharethalobaid.com/thumbnails"

function getSystemThumbnail(system: string): string {
  // normalize: lowercase, remove spaces
  const key = system.toLowerCase().replace(/\s+/g, '')
  return `${THUMBNAILS_URL}/${key}.jpg`
}

export default function Roms() {
  const navigate = useNavigate()
  const [search, setSearch] = createSignal("")

  const [data] = createResource(async () => {
    const res = await fetch(SUPABASE_URL, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    })
    const all = await res.json()
    if (!Array.isArray(all)) return []

    const seen = new Set()
    const systems: any[] = []
    for (const item of all) {
      if (!item.system) continue
      if (seen.has(item.system)) continue
      seen.add(item.system)
      systems.push({
        system: item.system,
        thumbnail_url: getSystemThumbnail(item.system)
      })
    }
    return systems
  })

  const filtered = () => {
    const q = search().toLowerCase()
    if (!q) return data() || []
    return (data() || []).filter(item =>
      (item.system || '').toLowerCase().includes(q)
    )
  }

  return (
    <Suspense fallback={<span class="loading loading-ball loading-md"></span>}>
      <div class="p-4">
        <input
          type="text"
          placeholder="Search systems..."
          class="input input-bordered w-full max-w-md mb-6"
          value={search()}
          onInput={(e) => setSearch(e.target.value)}
        />
        <div class="flex flex-wrap gap-4">
          <For each={filtered()}>
            {(item) => (
              <div
                class="card bg-base-100 w-60 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/roms/${encodeURIComponent(item.system)}`)}
              >
                <img class="rounded-t-xl" src={item.thumbnail_url} alt={item.system} width="100%" />
                <div class="card-body">
                  <h2 class="card-title">{item.system}</h2>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </Suspense>
  )
}