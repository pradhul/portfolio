"use client";
import styles from "./page.module.css";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <div className={styles.container}>
      <Analytics />
      <Head>
        <title>Pradhul Dev Portfolio</title>
        <meta name="description" content="Portfolio of Pradhul Dev" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className="text-blue-600">Pradhul.dev</span>
        </h1>

        <p className={styles.description}>Web and Mobile Developer | 8+ Years of Experience</p>

        <div className={styles.grid}>
          <a className={styles.card}>
            <h2>About &rarr;</h2>
            <p>Learn more about me and my journey.</p>
          </a>

          <a className={styles.card}>
            <h2>Portfolio &rarr;</h2>
            <p>Check out my projects and experience.</p>
          </a>

          <a href="/contact" className={styles.card}>
            <h2>Contact &rarr;</h2>
            <p>Get in touch with me.</p>
          </a>

          <a
            href="/PRADHUL_DEV_RESUME.pdf"
            download="PRADHUL_DEV_RESUME.pdf"
            className={styles.card}
          >
            <b>Download Resume &#8595;</b>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://pradhul.dev" target="_blank" rel="noopener noreferrer">
          Built by Pradhul Dev
        </a>
      </footer>
    </div>
  );
}
