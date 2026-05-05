import { createResource, createSignal, For, Suspense } from "solid-js";
import Anime from "./Anime";

export default function Movies() {
  const [limit , setlimit] = createSignal(2000)
  const [offset , setOffset] = createSignal(0)
  const [myear, setMyear] = createSignal(2000)
const url = "https://apiqsasmstiryuwcyemk.supabase.co/rest/v1/movie?"
const options = {
method: "GET",
headers:{
apikey : "sb_publishable_7hlyHenDUcmecwApd4hjFg_E3UhudBj"
}
}
const filter = ()=>"limit="+limit()+"&offset="+offset();
 const [data] = createResource(filter,async()=>{
  const data = await fetch(url+filter(),options);
return  await data.json();
 })

 function updateLimit(e){
  setlimit(e.target.value)
}

function updateOffset(e){
 setOffset(e.target.value)
}


  return (
   <>
     <div>
     limit:
     <input value ={limit()} onInput={updateLimit} class="input border-2 border-black" type="number" />
   </div>
   <div>
     Offset:
     <input value ={offset()} onInput={updateOffset} class="input border-2 border-black" type="number" />
   </div>
   <div>
     year:
     <input value={myear()} onInput={(e) => setMyear(Number(e.target.value))} class="input border-2 border-black" type="number" />
   </div>
   <Suspense fallback={<><span class="loading loading-ball loading-xs"></span>
<span class="loading loading-ball loading-sm"></span>
<span class="loading loading-ball loading-md"></span>
<span class="loading loading-ball loading-lg"></span>
<span class="loading loading-ball loading-xl"></span></>}>
   <For each={data()}>
     {(item,index)=>
     <>
        <Anime item={item} myear={myear()} />  
     </>
     }
     </For>
     </Suspense> 
   </>
  );
}
