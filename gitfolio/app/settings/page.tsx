import Link from "next/link";

export default function Settings() {
  return (
    <div className="min-h-screen bg-[#050510] text-cyan-50 font-mono selection:bg-fuchsia-500/30 selection:text-fuchsia-200 overflow-x-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-fuchsia-900/20 to-transparent opacity-30" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050510]/80 backdrop-blur-md border-b border-cyan-900/30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:to-cyan-400 transition-all duration-300"
          >
            GITFOLIO
          </Link>
          <div className="flex gap-8 text-xs font-bold tracking-widest uppercase text-cyan-700/80">
            <Link href="/#work" className="hover:text-cyan-400 hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-all">PROJECTS</Link>
            <Link href="/#philosophy" className="hover:text-fuchsia-400 hover:drop-shadow-[0_0_5px_rgba(232,121,249,0.8)] transition-all">ABOUT</Link>
            <Link href="/#contact" className="hover:text-yellow-400 hover:drop-shadow-[0_0_5px_rgba(250,204,21,0.8)] transition-all">CONTACT</Link>
            <Link href="/settings" className="text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)] transition-all">SETTINGS</Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <section className="py-12 space-y-6 border-b border-cyan-900/30">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-400 text-xs font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,1)]" />
            CONTROL PANEL
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-[1.1] drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 animate-gradient-x">SETTINGS</span>
          </h1>
          <p className="text-lg text-cyan-100/70 max-w-2xl leading-relaxed font-light border-l-2 border-purple-500/50 pl-6">
            Configure your portfolio. Tune the appearance, profile details, and integrations to match your style.
          </p>
        </section>

        {/* Appearance */}
        <section className="py-16 grid md:grid-cols-12 gap-12 border-b border-cyan-900/30">
          <div className="md:col-span-4">
            <h2 className="text-2xl font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
              {"// APPEARANCE"}
            </h2>
            <p className="mt-4 text-sm text-cyan-100/60 font-light">
              Customize the visual theme of your portfolio.
            </p>
          </div>
          <div className="md:col-span-8 space-y-6">
            <SettingRow label="THEME" description="Color scheme for your portfolio.">
              <select className="bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs font-bold tracking-widest uppercase px-4 py-2 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                <option>CYBERPUNK</option>
                <option>NEON_NIGHT</option>
                <option>SYNTHWAVE</option>
              </select>
            </SettingRow>
            <SettingRow label="ACCENT_COLOR" description="Primary accent across the site.">
              <div className="flex gap-3">
                <ColorSwatch className="bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <ColorSwatch className="bg-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.8)]" />
                <ColorSwatch className="bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                <ColorSwatch className="bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
              </div>
            </SettingRow>
            <SettingRow label="GRID_BACKGROUND" description="Toggle the cyber grid overlay.">
              <Toggle defaultOn />
            </SettingRow>
            <SettingRow label="ANIMATIONS" description="Enable shimmer and gradient motion.">
              <Toggle defaultOn />
            </SettingRow>
          </div>
        </section>

        {/* Profile */}
        <section className="py-16 grid md:grid-cols-12 gap-12 border-b border-cyan-900/30">
          <div className="md:col-span-4">
            <h2 className="text-2xl font-bold tracking-widest text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.6)]">
              {"// PROFILE"}
            </h2>
            <p className="mt-4 text-sm text-cyan-100/60 font-light">
              Personal details displayed on your portfolio.
            </p>
          </div>
          <div className="md:col-span-8 space-y-6">
            <SettingRow label="DISPLAY_NAME" description="Shown in headers and meta tags.">
              <input
                type="text"
                defaultValue="YOUR_NAME"
                className="bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs font-bold tracking-widest uppercase px-4 py-2 w-56 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_10px_rgba(232,121,249,0.4)]"
              />
            </SettingRow>
            <SettingRow label="EMAIL" description="Contact email (kept private).">
              <input
                type="email"
                defaultValue="you@example.com"
                className="bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs font-bold tracking-widest px-4 py-2 w-64 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_10px_rgba(232,121,249,0.4)]"
              />
            </SettingRow>
            <SettingRow label="PUBLIC_PROFILE" description="Allow search engines to index this page.">
              <Toggle defaultOn />
            </SettingRow>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-16 grid md:grid-cols-12 gap-12 border-b border-cyan-900/30">
          <div className="md:col-span-4">
            <h2 className="text-2xl font-bold tracking-widest text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">
              {"// INTEGRATIONS"}
            </h2>
            <p className="mt-4 text-sm text-cyan-100/60 font-light">
              External services connected to your portfolio.
            </p>
          </div>
          <div className="md:col-span-8 space-y-6">
            <SettingRow label="GITHUB" description="Sync repos to PROJECTS section.">
              <Toggle defaultOn />
            </SettingRow>
            <SettingRow label="ANALYTICS" description="Track visits to your portfolio.">
              <Toggle />
            </SettingRow>
            <SettingRow label="RSS_FEED" description="Expose project posts as RSS.">
              <Toggle />
            </SettingRow>
          </div>
        </section>

        {/* Save Bar */}
        <section className="py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-cyan-950/20 border border-cyan-500/20 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-purple-500" />
            <p className="text-sm text-cyan-200/70 font-light">
              <span className="text-fuchsia-400">›</span> Changes are stored locally until you deploy.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-2 border border-cyan-900/50 text-cyan-400/70 text-xs font-bold tracking-widest uppercase hover:border-cyan-500/50 hover:text-cyan-300 transition-all">
                RESET
              </button>
              <button className="group relative px-8 py-2 bg-purple-950/30 border border-purple-500/50 text-purple-300 font-bold tracking-widest uppercase text-xs overflow-hidden hover:bg-purple-900/50 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <span className="relative z-10">SAVE_CHANGES</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-xs font-mono text-cyan-900/50 border-t border-cyan-900/20">
        <p>Made with ❤️ by <a href="https://gh.io/gfb" target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:text-cyan-400 hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-all">GitHub for Beginners</a> and <a href="https://gh.io/gfb-copilot" target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:text-cyan-400 hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-all">GitHub Copilot</a></p>
      </footer>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string, description: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-[#0a0a1a] border border-cyan-900/30 hover:border-cyan-500/30 transition-all">
      <div className="space-y-1">
        <h3 className="text-xs font-bold tracking-widest uppercase text-cyan-300">
          <span className="text-fuchsia-500">›</span> {label}
        </h3>
        <p className="text-xs text-cyan-100/50 font-light pl-4">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ColorSwatch({ className }: { className: string }) {
  return (
    <button
      className={`w-6 h-6 rounded-full border border-cyan-900/50 hover:scale-110 transition-transform ${className}`}
      aria-label="color swatch"
    />
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
      <div className="w-11 h-6 bg-cyan-950/50 border border-cyan-900/50 peer-checked:bg-fuchsia-950/40 peer-checked:border-fuchsia-500/50 peer-checked:shadow-[0_0_10px_rgba(232,121,249,0.4)] transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-cyan-500 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-fuchsia-400" />
    </label>
  );
}
