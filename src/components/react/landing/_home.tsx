import { motion } from "framer-motion"
import { CloudIcon, CodeIcon, ZapIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function HeroSection() {
    return (
        <div className="min-h-screen flex flex-col justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <motion.h1
                    className="text-6xl sm:text-8xl font-extrabold text-white mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Deploy Cloud Functions in Seconds
                </motion.h1>
                <motion.p
                    className="text-2xl sm:text-3xl text-purple-200 mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Simplify your serverless journey with our intuitive platform
                </motion.p>
                <motion.div
                    className="flex justify-center items-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <a href="/get-started">
                        <Button className="w-full sm:w-auto text-3xl py-4 px-8">
                            Get Started
                        </Button>
                    </a>
                </motion.div>
                <motion.div
                    className="flex justify-center space-x-8 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="flex flex-col items-center">
                        <CloudIcon className="w-8 h-8 mb-2 text-purple-300" />
                        <h3 className="text-lg font-semibold mb-1">Easy Deployment</h3>
                        <p className="text-purple-200">Deploy your functions with just a few clicks</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <ZapIcon className="w-8 h-8 mb-2 text-purple-300" />
                        <h3 className="text-lg font-semibold mb-1">Lightning Fast</h3>
                        <p className="text-purple-200">Experience blazing-fast execution times</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <CodeIcon className="w-8 h-8 mb-2 text-purple-300" />
                        <h3 className="text-lg font-semibold mb-1">Any Language</h3>
                        <p className="text-purple-200">Support for all major programming languages</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
