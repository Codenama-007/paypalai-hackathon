"use client";

import { TABS, TabId } from "@/lib/constants";

interface TabNavProps {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

export default function TabNav({ activeTab, setActiveTab }: TabNavProps) {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800/80 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto text-xs py-1">
        {TABS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 font-medium rounded-t border-b-2 transition-colors whitespace-nowrap ${
                activeTab === item.id
                  ? "border-blue-500 text-blue-400 bg-zinc-800/50"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
