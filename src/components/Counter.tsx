import { createSignal } from "solid-js";


export default function Counter() {
  const [count, setCount] = createSignal(0);

  function incCount(){
    setCount(count() + 1);
  }

  return (
    <button
      class="btn btn-primary w-[200px] rounded-full" 
      onClick={incCount}>
      Click: {count()}
    </button>
  );
}
