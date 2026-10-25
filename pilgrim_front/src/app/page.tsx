import { SITE } from "@/shared/config/site";

export default function HomePage() {
  return (
    <main>
      <h1>{SITE.name}</h1>
      <p>{SITE.tagline}</p>
    </main>
  );
}
