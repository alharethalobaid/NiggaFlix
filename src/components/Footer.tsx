


export default function Footer() {
  return (
    <footer class="bg-red-700">
      <ul class="flex gap-3 p-5 justify-center text-sm text-neutral-content">
        <li>
          Copyright {(new Date()).getFullYear()}
        </li>
      </ul>
    </footer>
  );
}
