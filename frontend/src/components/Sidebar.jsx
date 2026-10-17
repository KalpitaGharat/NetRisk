import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  PlusCircle, 
  Award, 
  History, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Globe,
  Sliders,
  KeyRound,
  UserCheck,
  LogOut
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  isCollapsed, 
  setIsCollapsed,
  currentUser,
  onLogout
}) {
  const navSections = [
    {
      title: "Risk Intelligence",
      items: [
        { id: "dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
        { id: "assessment", label: "New Assessment", icon: PlusCircle, badge: "7-Factor" },
        { id: "history", label: "Assessment History", icon: History },
      ]
    },
    {
      title: "SDLC Decision Engine",
      items: [
        { id: "sdlc-comparison", label: "SDLC Models & Simulator", icon: Sliders, badge: "5 Models" },
        { id: "documentation", label: "Documentation & SDG 9", icon: BookOpen },
        { id: "landing", label: "Architecture Showcase", icon: Globe },
        { id: "login", label: "Security Login Portal", icon: KeyRound },
      ]
    }
  ];

  return (
    <aside 
      className={`fixed top-0 bottom-0 left-0 z-40 bg-cyber-sidebar border-r border-cyber-border flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-cyber-border">
        <div 
          className="flex items-center gap-3 cursor-pointer overflow-hidden" 
          onClick={() => setCurrentTab('dashboard')}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyber-blue to-cyber-cyan flex items-center justify-center text-cyber-bg font-extrabold shadow-glow shrink-0">
            <ShieldAlert className="w-5 h-5 text-cyber-bg stroke-[2.5]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-extrabold text-white text-base tracking-wide flex items-center gap-1.5">
                NETRISK
                <span className="text-[10px] bg-cyber-cyan/15 text-cyber-cyan px-1.5 py-0.5 rounded font-mono font-bold border border-cyber-cyan/30">
                  v2.0
                </span>
              </span>
              <span className="text-[10px] text-cyber-textMuted uppercase tracking-wider font-medium">
                SDLC &bull; Risk Engine
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md text-cyber-textMuted hover:text-cyber-cyan hover:bg-cyber-elevated border border-cyber-border transition shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-cyber-textMuted mb-2">
                {sec.title}
              </p>
            )}
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isCollapsed ? 'justify-center' : 'justify-start'
                  } ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyber-cyan/15 to-transparent text-white border-l-2 border-cyber-cyan font-semibold' 
                      : 'text-cyber-textSecondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyber-cyan' : 'text-cyber-textMuted'}`} />
                  {!isCollapsed && (
                    <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.label}
                    </span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-cyber-cyan text-cyber-bg' 
                        : 'bg-cyber-elevated text-cyber-textMuted border border-cyber-border'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom User Profile & Status */}
      <div className="p-3 border-t border-cyber-border bg-black/20 space-y-2">
        {!isCollapsed ? (
          <>
            <div 
              onClick={() => setCurrentTab('login')}
              className="p-2 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-cyan/50 flex items-center gap-2.5 cursor-pointer transition"
              title="Click to view Security Login Portal"
            >
              <div className="w-7 h-7 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan font-bold text-xs shrink-0">
                {currentUser?.name?.charAt(0) || 'K'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{currentUser?.name || 'Kalpita Gharat'}</div>
                <div className="text-[10px] font-mono text-cyber-cyan truncate">{currentUser?.role || 'Lead Security Architect'}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onLogout) onLogout();
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg text-cyber-textMuted hover:text-rose-400 transition"
                title="Sign Out / Switch Profile"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="px-2 flex items-center justify-between text-[11px] text-cyber-textMuted font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Session
              </span>
              <span>Level 4</span>
            </div>
          </>
        ) : (
          <div 
            onClick={() => setCurrentTab('login')} 
            className="flex justify-center cursor-pointer" 
            title={`Logged in as ${currentUser?.name || 'Kalpita Gharat'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>
        )}
      </div>
    </aside>
  );
}
