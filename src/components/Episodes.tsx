import { createResource, For, Suspense, createSignal, onMount, onCleanup } from "solid-js";
import { useParams } from "@solidjs/router";
import videojs from "video.js";
import "video.js/dist/video-css/video-js.css";

const SUPABASE_URL = "https://rwzsafzjrdqtrtalyzfz.supabase.co/rest/v1/movies"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3enNhZnpqcmRxdHJ0YWx5emZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTE0OTgsImV4cCI6MjA5MzQ2NzQ5OH0.ylIpVoOpwFP9JltF68oBZAT6JLfaDWuHDOxlkvwIiVU"

function VideoPlayer(props) {
  let videoRef
  let player
  const [subtitleUrl, setSubtitleUrl] = createSignal(null)

  onMount(() => {
    player = videojs(videoRef, {
      controls: true,
      autoplay: true,
      fluid: true,
      sources: [{ src: props.src, type: 'video/mp4' }]
    })
  })

  onCleanup(() => {
    if (player) player.dispose()
  })

  function handleSubtitleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setSubtitleUrl(url)

    // add subtitle track to player
    const track = document.createElement('track')
    track.kind = 'subtitles'
    track.label = file.name
    track.srclang = 'en'
    track.src = url
    track.default = true
    videoRef.appendChild(track)
    player.load()
  }

  return (
    <div>
      <div data-vjs-player>
        <video ref={videoRef} class="video-js vjs-big-play-centered vjs-theme-sea" />
      </div>
      <div class="mt-2 flex items-center gap-2">
        <label class="btn btn-sm btn-outline">
          📄 Upload Subtitle (.srt / .vtt)
          <input type="file" accept=".srt,.vtt" class="hidden" onChange={handleSubtitleUpload} />
        </label>
        {subtitleUrl() && <span class="text-sm text-success">✅ Subtitle loaded!</span>}
      </div>
      <button class="btn btn-error w-full mt-2" onClick={props.onClose}>✕ Close</button>
    </div>
  )
}

export default function Episodes() {
  const params = useParams()
  const [playing, setPlaying] = createSignal(null)

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
            {(item) => (
              <div class="card bg-base-100 shadow-sm p-4">
                {playing() === item.id ? (
                  <VideoPlayer
                    src={item.video_url}
                    onClose={() => setPlaying(null)}
                  />
                ) : (
                  <div class="flex justify-between items-center">
                    <p>S{String(item.season).padStart(2,'0')}E{String(item.episode).padStart(2,'0')} — {item.show}</p>
                    <button class="btn btn-error btn-sm" onClick={() => setPlaying(item.id)}>▶ Play</button>
                  </div>
                )}
              </div>
            )}
          </For>
        </div>
      </Suspense>
    </div>
  )
}