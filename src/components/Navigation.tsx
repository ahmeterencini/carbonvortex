import React from 'react';
import { Camera, Scan, BarChart3, Filter, FileCheck2, Columns } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  detectedCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  detectedCount,
}) => {
  const tabs = [
    {
      id: 'upload' as TabType,
      label: 'Ölçümler',
      shortLabel: 'Ölçüm',
      icon: Camera,
      badge: null,
    },
    {
      id: 'analysis' as TabType,
      label: 'Yapay Zeka',
      shortLabel: 'AI Analiz',
      icon: Scan,
      badge: detectedCount > 0 ? `${detectedCount}` : null,
    },
    {
      id: 'comparison' as TabType,
      label: 'Karşılaştırma',
      shortLabel: 'Kıyasla',
      icon: Columns,
      badge: 'Önce/Sonra',
    },
    {
      id: 'filtration' as TabType,
      label: 'Süzülme & Gözenek',
      shortLabel: 'Süzülme',
      icon: Filter,
      badge: null,
    },
    {
      id: 'charts' as TabType,
      label: 'Grafikler',
      shortLabel: 'Grafik',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'reports' as TabType,
      label: 'TÜBİTAK Rapor',
      shortLabel: 'Rapor',
      icon: FileCheck2,
      badge: 'PDF',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#06111c]/95 backdrop-blur-xl border-t border-teal-900/50 pb-safe pt-1 px-1.5 max-w-xl md:max-w-3xl mx-auto md:rounded-t-2xl shadow-2xl shadow-cyan-950/60">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'text-teal-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active glow background */}
              {isActive && (
                <span className="absolute inset-0 bg-teal-500/15 rounded-xl border border-teal-500/30 -z-10 shadow-inner" />
              )}

              <div className="relative">
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-teal-400' : 'group-hover:scale-105'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[8px] sm:text-[9px] px-1 py-0.2 rounded-full font-mono font-bold leading-none ${
                      isActive
                        ? 'bg-teal-400 text-slate-950 ring-1 ring-teal-200'
                        : 'bg-slate-700 text-teal-300 border border-teal-500/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] sm:text-[11px] mt-1 tracking-tight text-center whitespace-nowrap">
                {tab.shortLabel}
              </span>

              {isActive && (
                <span className="absolute bottom-0 w-6 sm:w-8 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full shadow-[0_0_8px_#2dd4bf]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
