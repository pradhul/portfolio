"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { motion } from "framer-motion";
import { Code, User, Mail, FileText, ExternalLink } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`${styles.container} min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 text-white`}>
      <Analytics />
      <SpeedInsights />
      <Head>
        <title>Pradhul Dev | Web & Mobile Developer</title>
        <meta
          name="description"
          content="Portfolio of Pradhul Dev - Web and Mobile Developer with 8+ years of experience"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main} px-4 py-12`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-4 p-4 rounded-full bg-indigo-500/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Code size={40} className="text-indigo-400" />
          </motion.div>
          <motion.h1
            className={`${styles.title} text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Pradhul Dev
          </motion.h1>
          <motion.p
            className={`${styles.description} text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Web & Mobile Developer | 8+ Years of Experience
          </motion.p>
        </motion.div>

        <div className={`${styles.grid}`}>
          {/* <motion.a
            href="/about"
            className={`${styles.card} group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-800 to-indigo-900 p-8 flex flex-col h-64 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20`}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <User size={32} className="mb-4 text-indigo-400" />
            <h2 className="text-2xl font-bold mb-2 text-white">About Me</h2>
            <p className="text-gray-300">Learn about my journey and professional background.</p>
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-indigo-400 to-purple-500 group-hover:w-full transition-all duration-300" />
          </motion.a> */}

          <motion.a
            href="/portfolio"
            className={`${styles.card} group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-800 to-purple-900 p-8 flex flex-col h-64 transition-all duration-300 shadow-lg hover:shadow-purple-500/20`}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Code size={32} className="mb-4 text-purple-400" />
            <h2 className="text-2xl font-bold mb-2 text-white">Portfolio</h2>
            <p className="text-gray-300">Explore my latest projects and achievements.</p>
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-400 to-fuchsia-500 group-hover:w-full transition-all duration-300" />
          </motion.a>

          <motion.a
            href="/contact"
            className={`${styles.card} group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 p-8 flex flex-col h-64 transition-all duration-300 shadow-lg hover:shadow-blue-500/20`}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Mail size={32} className="mb-4 text-blue-400" />
            <h2 className="text-2xl font-bold mb-2 text-white">Contact</h2>
            <p className="text-gray-300">Get in touch to discuss your next project.</p>
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-300" />
          </motion.a>
        </div>

        <motion.div
          className="w-full max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="/PRADHUL_DEV_RESUME.pdf"
              download="PRADHUL_DEV_RESUME.pdf"
              className={`${styles.card} group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full transition-all duration-300`}
              whileHover={{ scale: 1.05 }}
            >
              <FileText size={20} className="text-gray-200" />
              <span className="font-medium text-gray-200">Download Resume</span>
            </motion.a>

            <motion.a
              href="https://github.com/pradhul"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <ExternalLink size={20} className="text-gray-200" />
              <span className="font-medium text-gray-200">GitHub</span>
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/pradhul-dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <ExternalLink size={20} className="text-gray-200" />
              <span className="font-medium text-gray-200">LinkedIn</span>
            </motion.a>
          </div>
        </motion.div>
      </main>

      <footer className={`${styles.footer} py-8 text-center text-gray-400 border-t border-gray-800`}>
        <p>© {new Date().getFullYear()} Pradhul Dev. All rights reserved.</p>
      </footer>
    </div>
  );
}
