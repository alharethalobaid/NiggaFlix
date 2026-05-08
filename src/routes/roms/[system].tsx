import { createResource, For, Suspense, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";

const SUPABASE_URL = "https://rwzsafzjrdqtrtalyzfz.supabase.co/rest/v1/roms"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3enNhZnpqcmRxdHJ0YWx5emZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTE0OTgsImV4cCI6MjA5MzQ2NzQ5OH0.ylIpVoOpwFP9JltF68oBZAT6JLfaDWuHDOxlkvwIiVU"

const ADMIN_UID = "ccc240bc-3322-42cd-b24c-015be29b0c75"

function downloadFile(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

function getCurrentUserId(): string | null {
  try {
    const raw = localStorage.getItem('sb-rwzsafzjrdqtrtalyzfz-auth-token')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.user?.id || null
  } catch {
    return null
  }
}

export default function RomSystem() {
  const params = useParams()
  const [search, setSearch] = createSignal("")
  const isAdmin = getCurrentUserId() === ADMIN_UID

  const [data] = createResource(async () => {
    const system = decodeURIComponent(params.system)
    const res = await fetch(`${SUPABASE_URL}?system=eq.${encodeURIComponent(system)}&order=title.asc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    })
    return res.json()
  })

  const filtered = () => {
    const q = search().toLowerCase()
    if (!q) return data() || []
    return (data() || []).filter(item =>
      (item.title || item.file_name || '').toLowerCase().includes(q)
    )
  }

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">{decodeURIComponent(params.system)}</h1>
      <input
        type="text"
        placeholder="Search games..."
        class="input input-bordered w-full max-w-md mb-6"
        value={search()}
        onInput={(e) => setSearch(e.target.value)}
      />
      <Suspense fallback={<span class="loading loading-ball loading-md"></span>}>
        <div class="flex flex-wrap gap-4">
          <For each={filtered()}>
            {(item) => (
              <div class="card bg-base-100 w-48 shadow-sm hover:scale-105 transition-transform">
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    class="rounded-t-xl w-full h-64 object-cover"
                  />
                ) : (
                  <div class="w-full h-64 bg-base-300 rounded-t-xl flex items-center justify-center text-4xl">
                    🎮
                  </div>
                )}
                <div class="card-body p-3">
                  <p class="font-medium text-sm">{item.title || item.file_name}</p>
                  {isAdmin ? (
                    <button
                      class="btn btn-sm btn-error w-full mt-2"
                      onClick={() => downloadFile(item.file_url, item.file_name)}
                    >
                      Download
                    </button>
                  ) : (
                    <button class="btn btn-sm btn-disabled w-full mt-2" disabled>
                      🔒 Unavailable
                    </button>
                  )}
                </div>
              </div>
            )}
          </For>
        </div>
      </Suspense>
    </div>
  )
}