import { createResource, For, Suspense, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";

const SUPABASE_URL = "https://rwzsafzjrdqtrtalyzfz.supabase.co/rest/v1/movies"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3enNhZnpqcmRxdHJ0YWx5emZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTE0OTgsImV4cCI6MjA5MzQ2NzQ5OH0.ylIpVoOpwFP9JltF68oBZAT6JLfaDWuHDOxlkvwIiVU"

const ADMIN_UID = "ccc240bc-3322-42cd-b24c-015be29b0c75"

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

function downloadFile(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

export default function Episodes() {
  const params = useParams()
  const isAdmin = getCurrentUserId() === ADMIN_UID
  const [playing, setPlaying] = createSignal<string | null>(null)

  const [data] = createResource(async () => {
    const show = decodeURIComponent(params.show)
    const res = await fetch(`${SUPABASE_URL}?show=eq.${encodeURIComponent(show)}&order=season.asc,episode.asc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    })
    return res.json()
  })

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">{decodeURIComponent(params.show)}</h1>
      <Suspense fallback={<span class="loading loading-ball loading-md"></span>}>
        <div class="flex flex-col gap-2">
          <For each={data()}>
            {(item) => {
              const key = `${item.season}-${item.episode}`
              return (
                <div class="card bg-base-100 shadow-sm p-4">
                  {playing() === key ? (
                    <div>
                      <video controls controlsList="nodownload" autoplay width="100%" src={item.video_url} />
                      <button class="btn btn-error w-full mt-2" onClick={() => setPlaying(null)}>✕ Close</button>
                    </div>
                  ) : (
                    <div class="flex justify-between items-center">
                      <p>S{String(item.season).padStart(2,'0')}E{String(item.episode).padStart(2,'0')} — {item.show}</p>
                      <div class="flex gap-2">
                        <button class="btn btn-error btn-sm" onClick={() => setPlaying(key)}>▶ Play</button>
                        <a href={`vlc://${item.video_url}`} class="btn btn-warning btn-sm">🎬 VLC</a>
                        {isAdmin && (
                          <button class="btn btn-success btn-sm" onClick={() => downloadFile(item.video_url, item.file_name)}>⬇ Download</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            }}
          </For>
        </div>
      </Suspense>
    </div>
  )
}