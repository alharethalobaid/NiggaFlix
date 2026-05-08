import { createSignal } from "solid-js";

export default function Roms(props) {
  const [playing, setPlaying] = createSignal(false)

  return (
    <>
      <div class="card bg-base-100 w-96 shadow-sm">
      <img style={{"border-radius": "12px"}} src={props.item.thumbnail_url} alt={props.item.show} width="100%" />
        {playing() ? (
          <div class="p-4">
            <video
              controls
              autoplay
              width="100%"
              src={props.item.video_url}
            />
            <button
              class="btn btn-error w-full mt-2"
              onClick={() => setPlaying(false)}
            >
              ✕ Close
            </button>
          </div>
        ) : (
          <div class="card-body">
            <h2 class="card-title">{props.item.show || props.item.title}</h2>
            <p>Season {props.item.season} · Episode {props.item.episode}</p>
            <p class="text-xs text-gray-400">{props.item.file_name}</p>
            <button
              class="btn btn-error w-full mt-2"
              onClick={() => setPlaying(true)}
            >
              ▶ Play
            </button>
          </div>
        )}
      </div>
      <br/>
    </>
  )
}