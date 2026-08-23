import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

export function TooltipNavbar({ items }: { items: any[] }) {
// ... existing TooltipNavbar ...
  return (
    <header className="w-full border-b-[4px] border-ink bg-paper z-40 relative px-4 py-4 md:py-6">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="font-display font-black text-3xl md:text-5xl tracking-tighter hover:opacity-80 transition-opacity">
          ResumeAI.
        </Link>
        
        {/* Tooltip Nav Items */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="group relative flex items-center justify-center">
              
              {/* Note: In a real app we might wrap these in Link based on the label, but for now they are buttons */}
              <button className="h-10 w-10 md:h-12 md:w-12 border border-ink bg-white flex items-center justify-center transition-colors duration-200 hover:bg-ink hover:text-white relative">
                <div className="w-5 h-5 stroke-[1.5]">{item.icon}</div>
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center bg-news-red border border-ink" />
                )}
              </button>

              {/* Newsprint Tooltip */}
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="bg-ink text-paper text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 whitespace-nowrap relative border border-ink">
                  {/* Tooltip arrow */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-ink w-0 h-0" />
                  <span className="font-bold">{item.label}</span>
                  {item.labelHasKeyword && (
                    <span className="ml-2 text-neutral-400">[{item.labelHasKeyword.join('')}]</span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}

function ListStackItem({ item, onDelete }: { item: any, onDelete?: (id: string) => void }) {
  const Icon = item.icon;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (!menuOpen) return;
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownStyle({
          position: 'fixed',
          top: rect.bottom + 4,
          right: window.innerWidth - rect.right,
          zIndex: 9999
        });
      }
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [menuOpen]);

  return (
    <div className="group flex items-center gap-4 p-4 border-b border-ink last:border-b-0 hover:bg-neutral-100 transition-colors cursor-default relative overflow-visible">
      {/* Hover accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-news-red transform -translate-x-full group-hover:translate-x-0 transition-transform" />
      
      {/* Icon Box */}
      <div className="h-10 w-10 shrink-0 border border-ink flex items-center justify-center bg-paper group-hover:bg-white transition-colors">
        <Icon className="w-5 h-5 stroke-[1.5] text-ink" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-sans font-bold text-sm truncate">{item.title}</h4>
        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mt-1 truncate">
          {item.location}
        </p>
      </div>
      
      {/* Skills Popout & Actions */}
      <div className="shrink-0 flex items-center gap-4 relative">
        
        {item.skills && item.skills.length > 0 && (
          <>
            <button 
              ref={buttonRef}
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="flex items-center gap-2 border border-ink px-3 py-1 font-mono text-[10px] uppercase tracking-widest font-bold bg-white hover:bg-ink hover:text-white transition-colors"
            >
              Extracted Skills {menuOpen ? '^' : 'v'}
            </button>

            {menuOpen && createPortal(
              <div 
                ref={menuRef}
                style={dropdownStyle}
                className="bg-paper border-[4px] border-ink shadow-[4px_4px_0px_0px_#111111] w-[300px] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b-[4px] border-ink bg-ink text-white px-4 py-2">
                  <span className="font-mono text-xs uppercase tracking-widest font-bold">
                    Extracted Skills Matrix
                  </span>
                </div>
                
                <div className="overflow-y-auto max-h-[300px] bg-paper">
                  <div className="flex flex-col">
                    {item.skills.map((skill: any, sIdx: number) => (
                      <div key={sIdx} className="flex items-center justify-between p-3 border-b border-ink last:border-b-0 bg-white hover:bg-neutral-50 transition-colors">
                        <span className="font-sans font-bold text-sm">{skill.skillName}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 bg-neutral-100 px-2 py-1 border border-neutral-300">
                            {skill.proficiency || 'Unknown'}
                          </span>
                          {skill.yearsExp != null && (
                            <span className="font-mono text-[10px] uppercase tracking-widest text-news-red border border-news-red px-1 py-0.5 bg-white">
                              {skill.yearsExp}Y
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>,
              document.body
            )}
          </>
        )}

        <div className="font-mono text-[10px] font-bold uppercase text-right">
          {item.date}
        </div>
        
        {onDelete && item.id && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="p-1 text-neutral-400 hover:text-news-red transition-colors z-10"
            title="Delete Record"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function ListStack({ items, onDelete }: { items: any[], onDelete?: (id: string) => void }) {
  return (
    <div className="flex flex-col border border-ink bg-white">
      {items.length === 0 ? (
        <div className="p-8 text-center font-mono text-xs uppercase tracking-widest text-neutral-500">
          No records found.
        </div>
      ) : (
        items.map((item, idx) => (
          <ListStackItem key={item.id || idx} item={item} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}

export interface ProfileCardProps {
  name: string;
  website: string;
  visits: string;
  heatScore: number;
  location: string;
  categories: string[];
  employees: string;
  arr: string;
  founders: { name: string; avatar: string }[];
  extraFounders?: number;
}

export function ProfileCard({
  name, website, visits, heatScore, location, categories, employees, arr, founders, extraFounders
}: ProfileCardProps) {
  return (
    <div className="border border-ink bg-white p-6 hard-shadow-hover hover:bg-neutral-50 transition-colors relative overflow-hidden group">
      {/* Decorative Red Accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-news-red/10 rotate-45 transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Col: Main Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display font-black text-2xl lg:text-3xl leading-none">
              {name}
            </h3>
            <span className="font-mono text-xs uppercase tracking-widest font-bold text-news-red border-b border-news-red">
              {heatScore} Heat
            </span>
          </div>
          
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-4">
            <a href={`https://${website}`} target="_blank" rel="noreferrer" className="hover:text-ink hover:underline">
              {website}
            </a>
            <span>•</span>
            <span>{location}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat, idx) => (
              <span key={idx} className="border border-ink px-2 py-0.5 bg-neutral-100 font-sans text-xs font-semibold">
                {cat}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-ink pt-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Visits</p>
              <p className="font-sans font-bold">{visits}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Employees</p>
              <p className="font-sans font-bold">{employees}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">ARR</p>
              <p className="font-sans font-bold">{arr}</p>
            </div>
          </div>
        </div>

        {/* Right Col: Founders */}
        <div className="shrink-0 flex flex-col justify-start md:border-l border-ink md:pl-6 pt-6 md:pt-0 border-t md:border-t-0 mt-6 md:mt-0 relative">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3 absolute top-0 md:-top-2 bg-white px-1">
            Founders
          </p>
          <div className="flex items-center mt-4">
            {founders.map((founder, idx) => (
              <div 
                key={idx} 
                className="w-10 h-10 border border-ink rounded-full overflow-hidden bg-neutral-100 -ml-2 first:ml-0 shadow-[2px_2px_0px_0px_#111]"
                title={founder.name}
              >
                <img src={founder.avatar} alt={founder.name} className="w-full h-full object-cover" />
              </div>
            ))}
            {!!extraFounders && extraFounders > 0 && (
              <div className="w-10 h-10 border border-ink bg-ink text-white rounded-full flex items-center justify-center font-mono text-[10px] font-bold -ml-2 shadow-[2px_2px_0px_0px_#111]">
                +{extraFounders}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
