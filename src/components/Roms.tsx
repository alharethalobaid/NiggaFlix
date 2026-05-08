import { createResource, For, Suspense, createSignal } from "solid-js";

const SUPABASE_URL = "https://rwzsafzjrdqtrtalyzfz.supabase.co/rest/v1/roms"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3enNhZnpqcmRxdHJ0YWx5emZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTE0OTgsImV4cCI6MjA5MzQ2NzQ5OH0.ylIpVoOpwFP9JltF68oBZAT6JLfaDWuHDOxlkvwIiVU"

export default function Roms() {
  const [search, setSearch] = createSignal("")

  const [data] = createResource(async () => {
    const res = await fetch(SUPABASE_URL, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    })
    const all = await res.json()
    if (!Array.isArray(all)) return {}

    const grouped: Record<string, any[]> = {}
    for (const item of all) {
      const sys = item.system || 'Unknown'
      if (!grouped[sys]) grouped[sys] = []
      grouped[sys].push(item)
    }
    return grouped
  })

  const filtered = () => {
    const q = search().toLowerCase()
    const grouped = data() || {}
    if (!q) return grouped

    const result: Record<string, any[]> = {}
    for (const [system, items] of Object.entries(grouped)) {
      const matches = items.filter(item =>
        (item.title || item.file_name || '').toLowerCase().includes(q)
      )
      if (matches.length > 0) result[system] = matches
    }
    return result
  }

  return (
    <Suspense fallback={<span class="loading loading-ball loading-md"></span>}>
      <div class="p-4">
        <input
          type="text"
          placeholder="Search roms..."
          class="input input-bordered w-full max-w-md mb-6"
          value={search()}
          onInput={(e) => setSearch(e.target.value)}
        />

        <For each={Object.entries(filtered())}>
          {([system, items]) => (
            <div class="mb-8">
              <h2 class="text-xl font-bold mb-3 text-red-600">{system}</h2>
              <div class="flex flex-col gap-2">
                <For each={items}>
                  {(item) => (
                    <div class="card bg-base-100 shadow-sm p-3 flex flex-row justify-between items-center">
                      <p class="font-medium">{item.title || item.file_name}</p>
                      
                        href={item.file_url}
                        download={item.file_name}
                        class="btn btn-sm btn-error"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </Suspense>
  )
}