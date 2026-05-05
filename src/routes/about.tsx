import { A } from "@solidjs/router";
import Counter from "~/components/Counter";

export default function About() {
  return (
    <main class="mx-auto mb-auto p-4 text-center">
      
      <h1 class="text-6xl text-primary font-thin uppercase my-16">
        About
      </h1>
      
      <Counter />
      
      <p class="mt-8">
        Visit 
        <A href="https://solidjs.com" target="_blank" class="text-primary hover:underline">
          solidjs.com
        </A> to learn how to build Solid apps.
      </p>
            
    </main>
  );
}
