import type { Metadata } from "next";
import { createPageMetadata, pages } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(pages.about);

export default function About() {
  return (
    <div>
      <h1>About Me</h1>
      <p>Hi, I&apos;m Pradhul, a Web and Mobile Developer with 8+ years of experience...</p>
    </div>
  );
}
