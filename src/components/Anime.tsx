import { createSignal, Match, Switch } from "solid-js";

export default function Movie(props){
  const [myear , setMyear] = createSignal(2000)

  function updatemyear(e){
    setMyear(e.target.value)
   }
  return(
    <>
  <div class="card bg-base-100 w-96 shadow-sm">
    <figure>
      <img
        src={props.item.image}
        alt="Shoes" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{props.item.title}</h2>
      <Switch>
      <Match when={props.item.year < props.myear}>
              <p style={{ color: "red" }}>{props.item.year}</p>
            </Match>
            <Match when={props.item.year >= props.myear}>
              <p style={{ color: "green" }}>{props.item.year}</p>
            </Match>
          </Switch>

      <div class="card-actions justify-end">
      </div>
    </div>
  </div>
  
  
    
          <br/>
          
          <br/>
          
    </>
  )
  }