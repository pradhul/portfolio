"use client"

import { useState } from 'react';
import { ChevronDown, ChevronUp, Github, ExternalLink, Terminal, Code, Package, GitBranch, GitCommit, CheckCircle, RefreshCw, Search, AlertTriangle, BookOpen, Award } from 'lucide-react';
import SquashPushSummary from './hero';

export default function SquashPushPortfolio() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showFeatures, setShowFeatures] = useState(false);
  const [showInstallation, setShowInstallation] = useState(false);
  const [showUsage, setShowUsage] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 px-6 md:px-12 lg:px-24">
       <SquashPushSummary />
      </header>

      {/* Badges */}
      <div className="bg-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-4">
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Package size={16} className="mr-1" />
            Version 0.1.0
          </div>
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Code size={16} className="mr-1" />
            VS Code 1.60+
          </div>
          <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <GitBranch size={16} className="mr-1" />
            Git Workflow
          </div>
          <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Award size={16} className="mr-1" />
            Developer Productivity
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 font-medium text-sm mr-4 border-b-2 ${
                activeTab === "overview"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("technical")}
              className={`px-4 py-2 font-medium text-sm mr-4 border-b-2 ${
                activeTab === "technical"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Technical Details
            </button>
            <button
              onClick={() => setActiveTab("development")}
              className={`px-4 py-2 font-medium text-sm mr-4 border-b-2 ${
                activeTab === "development"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Development
            </button>
            <button
              onClick={() => setActiveTab("future")}
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                activeTab === "future"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Future Plans
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === "overview" && (
              <div>
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-6">About Squash-Push</h2>
                  <p className="text-lg text-gray-700 mb-8">
                    Squash-Push is a Visual Studio Code extension I developed to address a common pain point in Git
                    workflows. It simplifies the process of squashing multiple commits before pushing to a remote
                    repository, making commit history cleaner and more organized without requiring complex Git command
                    sequences.
                  </p>

                  <div
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-6 cursor-pointer"
                    onClick={() => setShowFeatures(!showFeatures)}
                  >
                    <h3 className="text-xl font-semibold flex items-center">
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                      Key Features
                    </h3>
                    {showFeatures ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {showFeatures && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex">
                          <div className="mr-4 text-indigo-500">
                            <Search size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">Branch Detection</h4>
                            <p className="text-gray-600">
                              Automatically identifies your current Git branch and its configuration
                            </p>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="mr-4 text-indigo-500">
                            <GitCommit size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">Commit Listing</h4>
                            <p className="text-gray-600">Lists local commits that haven&apos;t been pushed yet</p>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="mr-4 text-indigo-500">
                            <Terminal size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">Interactive UI</h4>
                            <p className="text-gray-600">
                              Clean interface to select base commit for squashing operations
                            </p>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="mr-4 text-indigo-500">
                            <RefreshCw size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">One-Step Operation</h4>
                            <p className="text-gray-600">Performs squash operation with a single command</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-6 cursor-pointer"
                    onClick={() => setShowInstallation(!showInstallation)}
                  >
                    <h3 className="text-xl font-semibold flex items-center">
                      <Package size={20} className="text-purple-500 mr-2" />
                      Installation
                    </h3>
                    {showInstallation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {showInstallation && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                      <ol className="list-decimal ml-5 space-y-2">
                        <li className="text-gray-700">Launch VS Code</li>
                        <li className="text-gray-700">Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)</li>
                        <li className="text-gray-700">Search for &quot;Squash-Push&quot;</li>
                        <li className="text-gray-700">Click Install</li>
                      </ol>

                      <div className="mt-4 p-4 bg-gray-50 rounded border-l-4 border-blue-500">
                        <h4 className="font-semibold mb-2 text-gray-800">Requirements:</h4>
                        <ul className="list-disc ml-5 text-gray-700">
                          <li>Git must be installed and available in your PATH</li>
                          <li>VS Code 1.60 or higher</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-6 cursor-pointer"
                    onClick={() => setShowUsage(!showUsage)}
                  >
                    <h3 className="text-xl font-semibold flex items-center">
                      <BookOpen size={20} className="text-blue-500 mr-2" />
                      Usage Guide
                    </h3>
                    {showUsage ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {showUsage && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                      <ol className="list-decimal ml-5 space-y-3">
                        <li className="text-gray-700">Open a Git repository in VS Code</li>
                        <li className="text-gray-700">Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)</li>
                        <li className="text-gray-700">
                          Type &quot;Squash Local Commits&quot; OR &quot;Squash-Push: Squash Local Commits&quot; and select the command
                        </li>
                        <li className="text-gray-700">
                          Select the oldest commit you want to keep as the base for squashing
                        </li>
                        <li className="text-gray-700">
                          The extension will squash your commits and open the commit message editor
                        </li>
                        <li className="text-gray-700">Save your new commit message and push your changes</li>
                      </ol>

                      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="font-mono text-sm text-gray-600">
                          <div className="flex items-center mb-2">
                            <Terminal size={16} className="mr-2" />
                            <span className="font-semibold">Command:</span>
                          </div>
                          <div className="bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
                            <code>Squash-Push: Squash Local Commits</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-8">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Known Limitations</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <ul className="list-disc space-y-1 pl-5">
                            <li>May encounter issues with merge commits</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "technical" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Technical Implementation</h2>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Core Architecture</h3>
                  <p className="text-gray-700 mb-4">
                    Squash-Push is built using the VS Code Extension API and implements several Git operations through
                    carefully designed utility functions. The extension integrates with VS Code&apos;s UI components to
                    provide a seamless experience for developers.
                  </p>

                  <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-800">Core Functions</h4>
                    </div>
                    <div className="p-4">
                      <ul className="divide-y divide-gray-200">
                        <li className="py-3">
                          <div className="font-mono text-sm font-semibold text-purple-600">execGitCommand</div>
                          <div className="text-gray-600 text-sm">
                            Executes Git commands and returns results as promises
                          </div>
                        </li>
                        <li className="py-3">
                          <div className="font-mono text-sm font-semibold text-purple-600">getCurrentBranch</div>
                          <div className="text-gray-600 text-sm">Gets the name of the current Git branch</div>
                        </li>
                        <li className="py-3">
                          <div className="font-mono text-sm font-semibold text-purple-600">
                            getCurrentUpStreamBranch
                          </div>
                          <div className="text-gray-600 text-sm">
                            Determines the upstream branch for the current branch
                          </div>
                        </li>
                        <li className="py-3">
                          <div className="font-mono text-sm font-semibold text-purple-600">getLocalCommits</div>
                          <div className="text-gray-600 text-sm">Retrieves a list of local commits</div>
                        </li>
                        <li className="py-3">
                          <div className="font-mono text-sm font-semibold text-purple-600">hasParent</div>
                          <div className="text-gray-600 text-sm">Checks if a commit has a parent commit</div>
                        </li>
                        <li className="py-3">
                          <div className="font-mono text-sm font-semibold text-purple-600">showCommitSelections</div>
                          <div className="text-gray-600 text-sm">Displays UI for selecting commits</div>
                        </li>
                        <li className="py-3">
                          <div className="font-mono text-sm font-semibold text-purple-600">getCommitID</div>
                          <div className="text-gray-600 text-sm">Extracts and validates the selected commit ID</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Error Handling</h3>
                  <p className="text-gray-700 mb-4">
                    Robust error handling is implemented to ensure a smooth user experience. The extension gracefully
                    handles various Git-related errors and provides meaningful feedback to users.
                  </p>

                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-800">Error Conditions Handled</h4>
                    </div>
                    <div className="p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-red-50 p-3 rounded-md border border-red-100">
                          <span className="text-red-700 text-sm">No workspace folder found</span>
                        </div>
                        <div className="bg-red-50 p-3 rounded-md border border-red-100">
                          <span className="text-red-700 text-sm">Detached HEAD state</span>
                        </div>
                        <div className="bg-red-50 p-3 rounded-md border border-red-100">
                          <span className="text-red-700 text-sm">No local commits found</span>
                        </div>
                        <div className="bg-red-50 p-3 rounded-md border border-red-100">
                          <span className="text-red-700 text-sm">Multiple commits selected as base</span>
                        </div>
                        <div className="bg-red-50 p-3 rounded-md border border-red-100">
                          <span className="text-red-700 text-sm">Attempting to squash onto a root commit</span>
                        </div>
                        <div className="bg-red-50 p-3 rounded-md border border-red-100">
                          <span className="text-red-700 text-sm">Errors during the squash operation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "development" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Development Approach</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Technology Stack</h3>
                  <p className="text-gray-700 mb-4">
                    Squash-Push is built using TypeScript and leverages the VS Code Extension API to provide a seamless
                    development experience. The extension is designed to be lightweight yet powerful.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-8">
                    <h4 className="font-semibold mb-3 text-gray-800">Development Setup</h4>
                    <div className="bg-gray-800 text-green-400 p-4 rounded-md overflow-x-auto font-mono text-sm">
                      <div># Clone the repository</div>
                      <div>git clone https://github.com/pradhul/squash-push.git</div>
                      <div className="mt-2"># Navigate to the project directory</div>
                      <div>cd squash-push</div>
                      <div className="mt-2"># Install dependencies</div>
                      <div>npm install</div>
                      <div className="mt-2"># Open in VS Code</div>
                      <div>code .</div>
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                    <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100">
                      <h4 className="font-semibold text-indigo-700">Build and Run</h4>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <div className="bg-indigo-100 p-1 rounded-md mr-2 mt-1">
                            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                          </div>
                          Press F5 to start debugging
                        </li>
                        <li className="flex items-start">
                          <div className="bg-indigo-100 p-1 rounded-md mr-2 mt-1">
                            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                          </div>
                          Run <code className="bg-gray-100 px-1 rounded text-sm">npm run compile</code> to compile the
                          TypeScript code
                        </li>
                        <li className="flex items-start">
                          <div className="bg-indigo-100 p-1 rounded-md mr-2 mt-1">
                            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                          </div>
                          Run <code className="bg-gray-100 px-1 rounded text-sm">npm run watch</code> to watch for file
                          changes during development
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Contributing</h3>
                  <p className="text-gray-700 mb-4">
                    Contributions to Squash-Push are welcome! I&apos;ve designed the codebase to be easily extendable and
                    maintainable, making it accessible for other developers to contribute.
                  </p>

                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-800">How to Contribute</h4>
                    </div>
                    <div className="p-4">
                      <ol className="list-decimal ml-5 space-y-2 text-gray-700">
                        <li>Fork the repository</li>
                        <li>
                          Create your feature branch (
                          <code className="bg-gray-100 px-1 rounded text-sm">
                            git checkout -b feature/amazing-feature
                          </code>
                          )
                        </li>
                        <li>
                          Commit your changes (
                          <code className="bg-gray-100 px-1 rounded text-sm">
                            git commit -m &apos;Add some amazing feature&apos;
                          </code>
                          )
                        </li>
                        <li>
                          Push to the branch (
                          <code className="bg-gray-100 px-1 rounded text-sm">
                            git push origin feature/amazing-feature
                          </code>
                          )
                        </li>
                        <li>Open a Pull Request</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "future" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Future Roadmap</h2>

                <p className="text-gray-700 mb-6">
                  Squash-Push is under active development, with several planned enhancements to make Git workflow
                  management even more efficient. Here&apos;s what&apos;s on the horizon:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">User Experience Improvements</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Custom commit message templates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Auto-push option after squashing</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Undo squash operation</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">Technical Enhancements</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Support for multiple workspace folders</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Interactive rebase option</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Branch protection rules</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-100">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Project Vision</h3>
                  <p className="text-gray-700">
                    My long-term vision for Squash-Push is to build a comprehensive Git workflow assistant that
                    simplifies complex Git operations for developers of all skill levels. By focusing on user experience
                    and addressing real pain points in development workflows, I aim to make Squash-Push an essential
                    tool in every VS Code user&apos;s toolkit.
                  </p>

                  <div className="mt-4 flex">
                    <a
                      href="https://github.com/pradhul/squash-push/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      <span>Request a feature</span>
                      <ExternalLink size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="bg-white p-1 rounded-md mr-2">
                  <img src="./squashPush/icon.png" alt="Squash-Push Icon" className="w-8 h-8" />
                </div>
                <span className="text-xl font-semibold text-white">Squash-Push</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://github.com/pradhul/squash-push"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Github size={20} />
              </a>
              <a
                href="https://marketplace.visualstudio.com/items?itemName=PradhulDev.squash-push"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Package size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
  }

