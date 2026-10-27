import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FaLinkedin, FaGithubSquare } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { SiStackoverflow } from "react-icons/si";
import { FaSquareUpwork } from "react-icons/fa6";
import ContactForm from "@/components/ContactForm";
import HireCtas from "@/components/HireCtas";
import { createPageMetadata, pages } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(pages.contact);

export default function Contact() {
  return (
    <main className="min-h-screen bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cream-muted transition-colors hover:text-brass"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-line bg-ink-soft p-6 md:p-8">
            <h1 className="mb-2 font-display text-4xl font-semibold tracking-tight text-cream md:text-5xl">
              Contact
            </h1>
            <p className="mb-8 text-cream-muted">
              Available for hire — send a message, email me, or reach out on Upwork.
            </p>
            <ContactForm />
          </section>

          <section className="rounded-2xl border border-line bg-ink-soft p-6 md:p-8">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-cream-faint">
              Hire me
            </p>
            <HireCtas />

            <p className="mb-2 mt-10 font-mono text-xs uppercase tracking-[0.25em] text-cream-faint">
              Email
            </p>
            <a
              href="mailto:pradhuldev.1990@gmail.com"
              className="inline-flex items-center gap-2 text-cream transition-colors hover:text-brass"
            >
              <IoMail className="text-xl" />
              pradhuldev.1990@gmail.com
            </a>

            <p className="mb-6 mt-10 font-mono text-xs uppercase tracking-[0.25em] text-cream-faint">
              Connect with me on
            </p>
            <div className="flex flex-wrap gap-6">
              {[
                { icon: FaLinkedin, href: "https://www.linkedin.com/in/pradhul-dev-30708814b/", label: "LinkedIn" },
                { icon: FaGithubSquare, href: "https://github.com/pradhul", label: "GitHub" },
                { icon: SiStackoverflow, href: "https://stackoverflow.com/users/3309470/p-rad", label: "Stack Overflow" },
                { icon: FaSquareUpwork, href: "https://www.upwork.com/freelancers/~01a32f29fafd184f21", label: "Upwork" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-cream-muted transition-colors hover:text-brass"
                >
                  <Icon className="text-2xl" />
                  <span className="text-sm font-medium">{label}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
