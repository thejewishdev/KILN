import { Shell } from "../Shell";
import { BuildTeaser } from "./BuildTeaser";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { Signatures } from "./Signatures";
import { Story } from "./Story";
import { Visit } from "./Visit";

export function HomePage() {
  return (
    <Shell page="home" tone="dark" renderHeader={(header) => <Hero header={header} />}>
      <Marquee />
      <Signatures />
      <BuildTeaser />
      <Story />
      <Visit />
    </Shell>
  );
}
