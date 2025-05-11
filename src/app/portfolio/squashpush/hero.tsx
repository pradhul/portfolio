'use client'
import { Github, Package } from "lucide-react";

export default function SquashPushSummary() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center mb-6">
            <div className="bg-white p-2 rounded-lg shadow-lg mr-4">
              <img src="/squashPush/icon.png" alt="Squash-Push Icon" className="w-12 h-12" />
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-200">VS CODE EXTENSION</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Squash-Push</h1>
            </div>
          </div>

          <p className="text-lg md:text-xl text-white/90 mb-8">
            Simplify your Git workflow by squashing multiple commits before pushing to a remote repository.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="https://marketplace.visualstudio.com/items?itemName=PradhulDev.squash-push"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Package size={18} />
              <span>VS Code Marketplace</span>
            </a>
            <a
              href="https://github.com/pradhul/squash-push"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Github size={18} />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        <div className="flex-1 mt-6 md:mt-0">
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
            <div className="bg-gray-900 p-2 flex items-center justify-between border-b border-gray-700">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs font-mono text-gray-400">squash-push demo</div>
            </div>
            <div className="p-4">
              <img
                src="/squashPush/recording.gif"
                alt="Squash-Push Demo"
                className="w-full h-auto rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}