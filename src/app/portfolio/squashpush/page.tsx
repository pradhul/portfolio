import Image from 'next/image'
import ProjectPageShell, { ProjectHero } from '@/components/ProjectPageShell'
import { content } from '@/lib/content'

const MARKETPLACE = 'https://marketplace.visualstudio.com/items?itemName=PradhulDev.squash-push'
const GITHUB = 'https://github.com/pradhul/squash-push'

export default function SquashPushPortfolio() {
  return (
    <ProjectPageShell>
      <ProjectHero
        figure="Fig. 02"
        category={content.portfolio.squashPush.category}
        title={content.portfolio.squashPush.title}
        description={content.portfolio.squashPush.description}
        actions={
          <>
            <a href={MARKETPLACE} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              VS Code Marketplace
            </a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              View on GitHub
            </a>
          </>
        }
        media={
          <Image
            src="/squashPush/recording.gif"
            alt="Squash-Push Demo"
            width={800}
            height={600}
            className="h-auto w-full border border-line"
            unoptimized
          />
        }
      />

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">Key features</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['Branch detection', 'Automatically identifies your current Git branch and its configuration'],
            ['Commit listing', 'Lists local commits that have not been pushed yet'],
            ['Interactive UI', 'Clean interface to select a base commit for squashing'],
            ['One-step operation', 'Performs the squash operation with a single command'],
          ].map(([title, body]) => (
            <div key={title} className="frame p-5">
              <h3 className="font-display text-lg font-semibold text-cream">{title}</h3>
              <p className="mt-2 text-cream-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">Installation</h2>
        <ol className="ml-5 list-decimal space-y-2 text-cream-muted">
          <li>Launch VS Code</li>
          <li>Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)</li>
          <li>Search for “Squash-Push”</li>
          <li>Click Install</li>
        </ol>
        <div className="frame mt-6 p-5">
          <h3 className="font-display text-lg font-semibold text-cream">Requirements</h3>
          <ul className="mt-2 ml-5 list-disc text-cream-muted">
            <li>Git must be installed and available in your PATH</li>
            <li>VS Code 1.60 or higher</li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">Usage</h2>
        <ol className="ml-5 list-decimal space-y-2 text-cream-muted">
          <li>Open a Git repository in VS Code</li>
          <li>Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)</li>
          <li>Type “Squash Local Commits” and select the command</li>
          <li>Select the oldest commit you want to keep as the base for squashing</li>
          <li>The extension will squash your commits and open the commit message editor</li>
          <li>Save your new commit message and push your changes</li>
        </ol>
        <div className="frame mt-6 p-5">
          <div className="font-mono text-[13px] text-cream-muted">Command</div>
          <code className="mt-2 block bg-ink px-3 py-3 font-mono text-sm text-signal">
            Squash-Push: Squash Local Commits
          </code>
        </div>
        <p className="mt-6 text-cream-muted">Known limitation: may encounter issues with merge commits.</p>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-cream">Technical details</h2>
        <p className="mb-4 text-cream-muted">
          Squash-Push is built using the VS Code Extension API and implements Git operations through
          utility functions that integrate with VS Code UI components.
        </p>
        <div className="frame overflow-hidden">
          <div className="border-b border-line px-4 py-2 font-mono text-[13px] text-cream-muted">
            Core functions
          </div>
          <ul className="divide-y divide-line">
            {[
              ['execGitCommand', 'Executes Git commands and returns results as promises'],
              ['getCurrentBranch', 'Gets the name of the current Git branch'],
              ['getCurrentUpStreamBranch', 'Determines the upstream branch for the current branch'],
              ['getLocalCommits', 'Retrieves a list of local commits'],
              ['hasParent', 'Checks if a commit has a parent commit'],
              ['showCommitSelections', 'Displays UI for selecting commits'],
              ['getCommitID', 'Extracts and validates the selected commit ID'],
            ].map(([name, detail]) => (
              <li key={name} className="px-4 py-3">
                <div className="font-mono text-sm text-lime">{name}</div>
                <div className="text-sm text-cream-muted">{detail}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ProjectPageShell>
  )
}
