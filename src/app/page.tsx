'use client'
import { useState, useEffect, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  Code, 
  FileText, 
  Github, 
  Package,
  ChevronDown,
  Sparkles,
  User,
  Briefcase,
  MessageCircle
} from 'lucide-react'
import ThreeBackground from '@/components/ThreeBackground'
import InteractiveDots from '@/components/InteractiveDots'
import ChatWidget from '@/components/ChatWidget'
import { useChristmasTheme, SnowEffect, ChristmasThemeProvider } from '@/components/ChristmasTheme'
import { FaLinkedin, FaGithubSquare, FaPhone } from 'react-icons/fa'
import { FaSquareUpwork } from 'react-icons/fa6'
import { IoMail } from 'react-icons/io5'
import { SiStackoverflow } from 'react-icons/si'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const containerRef = useRef<HTMLDivElement>(null)
  const isChristmas = useChristmasTheme()

  useEffect(() => {
    setIsLoaded(true)
    
    const handleScroll = () => {
      const sections = ['hero', 'about', 'portfolio', 'contact']
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const navItems = [
    { id: 'hero', label: 'Home', icon: Code },
    { id: 'about', label: 'About', icon: User },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: MessageCircle },
  ]

  return (
    <ChristmasThemeProvider isChristmas={isChristmas}>
      <div ref={containerRef} className="relative min-h-screen overflow-y-auto bg-black text-white scroll-smooth">
        <Analytics />
        <SpeedInsights />
        <ThreeBackground />
        <InteractiveDots />
        <SnowEffect enabled={isChristmas} />
      
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-cyan-500/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`text-2xl font-bold bg-clip-text text-transparent cursor-pointer ${
              isChristmas
                ? 'bg-gradient-to-r from-red-400 via-green-500 to-yellow-400'
                : 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500'
            }`}
            onClick={() => scrollToSection('hero')}
          >
            Pradhul Dev
          </motion.div>
          <div className="hidden md:flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'text-cyan-400 bg-cyan-500/10' 
                      : 'text-gray-400 hover:text-cyan-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-cyan-500/10 rounded-lg border border-cyan-500/30"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="text-center z-10 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.5, rotate: isLoaded ? 0 : -180 }}
            transition={{ duration: 1, type: 'spring', stiffness: 200 }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-2 border-cyan-500/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-2 border-2 border-purple-500/30 rounded-full"
              />
              <div className="relative p-8 rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-cyan-500/30">
                <Code size={64} className="text-cyan-400" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`text-6xl md:text-8xl lg:text-9xl font-bold mb-6 bg-clip-text text-transparent leading-tight ${
              isChristmas
                ? 'bg-gradient-to-r from-red-400 via-green-500 to-yellow-400'
                : 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500'
            }`}
          >
            Pradhul Dev
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl md:text-3xl text-gray-300 mb-4 font-light"
          >
            Web & Mobile Developer
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg text-gray-400 mb-12"
          >
            8+ Years of Experience
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a
              href="/PRADHUL_DEV_RESUME.pdf"
              download="PRADHUL_DEV_RESUME.pdf"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 text-black font-semibold px-8 py-4 rounded-full transition-all shadow-lg ${
                isChristmas
                  ? 'bg-gradient-to-r from-red-500 to-green-500 hover:from-red-400 hover:to-green-400 shadow-red-500/50'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-cyan-500/50'
              }`}
            >
              <FileText size={20} />
              <span>Download Resume</span>
            </motion.a>

            <motion.button
              onClick={() => scrollToSection('portfolio')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-transparent border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-400 font-semibold px-8 py-4 rounded-full transition-all backdrop-blur-sm"
            >
              <Sparkles size={20} />
              <span>View Portfolio</span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-20"
          >
            <motion.button
              onClick={() => scrollToSection('about')}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ChevronDown size={40} />
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent ${
              isChristmas
                ? 'bg-gradient-to-r from-red-400 to-green-500'
                : 'bg-gradient-to-r from-cyan-400 to-purple-500'
            }`}>
              About Me
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 mx-auto mb-8 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-black/30 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:border-cyan-500/40 transition-all duration-300"
          >
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              Hi, I&apos;m <span className="text-cyan-400 font-semibold">Pradhul</span>, a passionate Web and Mobile Developer with over 8 years of experience crafting digital solutions.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              I specialize in building modern, responsive web applications and mobile apps that deliver exceptional user experiences. My expertise spans across various technologies and frameworks, allowing me to bring creative ideas to life.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              When I&apos;m not coding, I enjoy creating developer tools and extensions that make the development workflow more efficient. Check out my VS Code extensions below!
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Beyond coding and hanging out with friends, I have a passion for beatboxing, exploring music and movies, and gaming on my Nintendo Switch. I also love experimenting with new projects using my Raspberry Pi, constantly tinkering and learning new things.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className={`text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent ${
              isChristmas
                ? 'bg-gradient-to-r from-red-400 via-green-500 to-yellow-400'
                : 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500'
            }`}>
              Portfolio
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
          </motion.div>

          <div className="space-y-24">
            {/* Squash-Push Project */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="bg-black/30 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                  <div className="flex items-center mb-8">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="bg-white p-4 rounded-xl shadow-lg mr-6"
                    >
                      <Image src="/squashPush/icon.png" alt="Squash-Push Icon" width={80} height={80} />
                    </motion.div>
                    <div>
                      <div className="text-xs font-semibold text-cyan-400 mb-2 tracking-wider">VS CODE EXTENSION</div>
                      <h3 className="text-4xl md:text-5xl font-bold text-white">Squash-Push</h3>
                    </div>
                  </div>

                  <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
                    Simplify your Git workflow by squashing multiple commits before pushing to a remote repository. This extension streamlines the development process and keeps your commit history clean.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <motion.a
                      href="https://marketplace.visualstudio.com/items?itemName=PradhulDev.squash-push"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 text-black font-semibold py-3 px-6 rounded-lg transition-all shadow-lg ${
                        isChristmas
                          ? 'bg-gradient-to-r from-red-500 to-green-500 hover:from-red-400 hover:to-green-400 shadow-red-500/50'
                          : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-cyan-500/50'
                      }`}
                    >
                      <Package size={18} />
                      <span>VS Code Marketplace</span>
                    </motion.a>
                    <motion.a
                      href="https://github.com/pradhul/squash-push"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-transparent border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-400 font-semibold py-3 px-6 rounded-lg transition-all"
                    >
                      <Github size={18} />
                      <span>View on GitHub</span>
                    </motion.a>
                  </div>
                </div>

                <div className="flex-1 mt-6 md:mt-0">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-900/50 rounded-xl shadow-xl overflow-hidden border border-cyan-500/20"
                  >
                    <div className="bg-gray-800/50 p-3 flex items-center justify-between border-b border-cyan-500/20">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-xs font-mono text-gray-400">squash-push demo</div>
                    </div>
                    <div className="p-4">
                      <Image
                        src="/squashPush/recording.gif"
                        alt="Squash-Push Demo"
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-lg shadow-lg"
                        unoptimized
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* VS ColorCode Project */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="flex-1">
                  <div className="flex items-center mb-8">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="bg-white p-4 rounded-xl shadow-lg mr-6"
                    >
                      <Image src="/vsColorCode/icon.png" alt="vsColorCode Icon" width={80} height={80} />
                    </motion.div>
                    <div>
                      <div className="text-xs font-semibold text-purple-400 mb-2 tracking-wider">VS CODE EXTENSION</div>
                      <h3 className="text-4xl md:text-5xl font-bold text-white">vsColorCode</h3>
                    </div>
                  </div>

                  <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
                    A simple VS Code extension that randomly applies muted color themes to your workspace&apos;s status bar and title bar. This helps you visually distinguish between different projects or workspaces at a glance.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <motion.a
                      href="https://marketplace.visualstudio.com/items?itemName=PradhulDev.vscolorcode"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg ${
                        isChristmas
                          ? 'bg-gradient-to-r from-green-500 to-red-500 hover:from-green-400 hover:to-red-400 shadow-green-500/50'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-purple-500/50'
                      }`}
                    >
                      <Package size={18} />
                      <span>VS Code Marketplace</span>
                    </motion.a>
                    <motion.a
                      href="https://github.com/pradhul/vscolorcode"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-transparent border-2 border-purple-500/50 hover:border-purple-400 text-purple-400 font-semibold py-3 px-6 rounded-lg transition-all"
                    >
                      <Github size={18} />
                      <span>View on GitHub</span>
                    </motion.a>
                  </div>
                </div>

                <div className="flex-1 mt-6 md:mt-0">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-900/50 rounded-xl shadow-xl overflow-hidden border border-purple-500/20"
                  >
                    <div className="bg-gray-800/50 p-3 flex items-center justify-between border-b border-purple-500/20">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-xs font-mono text-gray-400">vsColorCode demo</div>
                    </div>
                    <div className="p-4">
                      <Image
                        src="/vsColorCode/demo.png"
                        alt="vsColorCode Demo"
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent ${
              isChristmas
                ? 'bg-gradient-to-r from-red-400 via-green-500 to-yellow-400'
                : 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500'
            }`}>
              Get In Touch
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 mx-auto mb-8 rounded-full" />
            <p className="text-xl text-gray-300">
              Let&apos;s discuss your next project or just say hello!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-black/30 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:border-cyan-500/40 transition-all duration-300"
          >
            <div className="space-y-8 mb-12">
              <motion.a
                href="mailto:pradhuldev.1990@gmail.com"
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-6 text-lg text-gray-300 hover:text-cyan-400 transition-colors group"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 rounded-full bg-cyan-500/20 border border-cyan-500/30 group-hover:bg-cyan-500/30 group-hover:border-cyan-500/50 transition-all"
                >
                  <IoMail className="text-cyan-400 text-2xl" />
                </motion.div>
                <span className="text-xl">pradhuldev.1990@gmail.com</span>
              </motion.a>

              <motion.a
                href="tel:+919986981757"
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-6 text-lg text-gray-300 hover:text-cyan-400 transition-colors group"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 rounded-full bg-cyan-500/20 border border-cyan-500/30 group-hover:bg-cyan-500/30 group-hover:border-cyan-500/50 transition-all"
                >
                  <FaPhone className="text-cyan-400 text-xl" />
                </motion.div>
                <span className="text-xl">+91-9986981757</span>
              </motion.a>
            </div>

            <div className="border-t border-cyan-500/20 pt-12">
              <p className="text-center text-gray-400 mb-8 text-lg">Connect with me on</p>
              <div className="flex justify-center gap-8">
                {[
                  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/pradhul-dev-30708814b/', color: 'text-blue-400 hover:text-blue-300' },
                  { icon: FaGithubSquare, href: 'https://github.com/pradhul', color: 'text-gray-300 hover:text-white' },
                  { icon: SiStackoverflow, href: 'https://stackoverflow.com/users/3309470/p-rad', color: 'text-orange-400 hover:text-orange-300' },
                  { icon: FaSquareUpwork, href: 'https://www.upwork.com/freelancers/~01a32f29fafd184f21', color: 'text-green-400 hover:text-green-300' },
                ].map(({ icon: Icon, href, color }) => (
                  <motion.a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.3, rotate: 10, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`${color} text-4xl transition-all`}
                  >
                    <Icon />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center text-gray-400 border-t border-cyan-500/10 bg-black/20 backdrop-blur-sm">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          © {new Date().getFullYear()} Pradhul Dev. All rights reserved.
        </motion.p>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
      </div>
    </ChristmasThemeProvider>
  )
}
