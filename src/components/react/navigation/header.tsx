import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, X, Zap } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = ["Home", "Pricing"]

  return (
    <header className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <img
                width="64"
                height="64"
                src="/logo.png"
                className="size-24 text-primary filter drop-shadow-lg mt-2"
              />
            </motion.div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map(item => (
                  <motion.a
                    key={item}
                    href={item === "Home" ? "/" : `/${item.at(0)?.toLowerCase() + item.slice(1)}`}
                    className="relative px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition duration-300 ease-in-out"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105">
              <a href="/">Start Now</a>
            </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden z-50 w-screen absolute bg-background">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <a
                key={item}
                href={`/${item.at(0)?.toLowerCase() + item.slice(1)}`}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted transition duration-300 ease-in-out"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-muted">
            <div className="px-2">
              <a href="/">
                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out">
                  Connect Git
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
