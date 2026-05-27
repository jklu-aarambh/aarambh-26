import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export interface ChromaItem {
  image?: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  borderColor?: string; // used for custom badge color
  gradient?: string;
  url?: string;
  socials?: {
    linkedin?: string;
    email?: string;
    github?: string;
    instagram?: string;
  };
}

export interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

type SetterFn = (v: number | string) => void;

// Sharp, neobrutalist inline SVG icons
const GitHubIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const EmailIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const getTagline = (location?: string, title?: string) => {
  const loc = location?.toLowerCase() || '';
  const t = title?.toLowerCase() || '';
  if (t.includes('vice chancellor') || t.includes('chellaboina')) {
    return "Leading the vision of academic and student excellence.";
  }
  if (loc.includes('student affairs') || t.includes('sogani')) {
    return "Fostering student life, leadership, and campus welfare.";
  }
  if (loc.includes('core organizing') || loc.includes('organizing head')) {
    return "Commanding the master plan of Aarambh'26.";
  }
  if (loc.includes('tech') || loc.includes('web') || loc.includes('app')) {
    return "Coding the digital canvas of Aarambh'26.";
  }
  if (loc.includes('design') || loc.includes('media') || loc.includes('photography') || loc.includes('social media')) {
    return "Bringing the spirit of Aarambh'26 to life visually.";
  }
  if (loc.includes('sponsorship') || loc.includes('finance')) {
    return "Fueling the engine of Aarambh'26.";
  }
  if (loc.includes('food') || loc.includes('accommodation') || loc.includes('hospitality')) {
    return "Ensuring comfort and hospitality for all guests.";
  }
  if (loc.includes('discipline') || loc.includes('logistics') || loc.includes('internal arrangements')) {
    return "Orchestrating ground operations with perfection.";
  }
  return "Part of the driving force behind Aarambh'26.";
};

const getCompetencies = (location?: string, title?: string): string[] => {
  const loc = location?.toLowerCase() || '';
  const t = title?.toLowerCase() || '';

  if (t.includes('vice chancellor') || t.includes('chellaboina')) {
    return ["Governance", "Academic Leadership", "Strategic Vision", "Institutional Growth"];
  }
  if (loc.includes('student affairs') || t.includes('sogani')) {
    return ["Student Welfare", "Mentorship", "Campus Operations", "Leadership Development"];
  }
  if (loc.includes('core organizing') || loc.includes('organizing head')) {
    return ["Strategic Planning", "Core Coordination", "Team Leadership", "Operations Execution"];
  }
  if (loc.includes('tech') || t.includes('technical')) {
    return ["React & Next.js", "TypeScript", "Tailwind CSS", "Interaction Engineering"];
  }
  if (loc.includes('design')) {
    return ["UI/UX Design", "Figma", "Typography", "Visual Identity"];
  }
  if (loc.includes('media') || loc.includes('social media') || loc.includes('photography')) {
    return ["Content Strategy", "Digital Media", "Photography", "Creative Writing"];
  }
  if (loc.includes('sponsorship') || loc.includes('finance')) {
    return ["Client Relations", "Budgeting", "Strategic Pitching", "Fundraising"];
  }
  if (loc.includes('food') || loc.includes('accommodation') || loc.includes('hospitality')) {
    return ["Logistics Management", "Hospitality Services", "Vendor Relations", "Coordination"];
  }
  if (loc.includes('discipline')) {
    return ["Crowd Management", "Safety Protocol", "Operations Oversight", "Event Discipline"];
  }
  if (loc.includes('arrangements') || loc.includes('internal arrangements')) {
    return ["Venue Decoration", "Stage Logistics", "Resource Operations", "Planning"];
  }
  if (loc.includes('cluster head')) {
    return ["Event Liaison", "Team Supervision", "Cross-functional Coordination", "Task Operations"];
  }
  return ["Team Operations", "Event Coordination", "Public Relations", "Execution"];
};

const getVerticalFontSize = (text: string) => {
  if (text.length > 25) return 'text-[11px]';
  if (text.length > 18) return 'text-[14px]';
  if (text.length > 12) return 'text-[18px]';
  return 'text-[22px]';
};

const ChromaGrid: React.FC<ChromaGridProps> = ({
  items,
  className = '',
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}) => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const toggleFlip = (title: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const demo: ChromaItem[] = [
    {
      title: 'Alex Rivera',
      subtitle: 'Full Stack Developer',
      handle: '@alexrivera',
      borderColor: '#FF9A00',
      location: 'Technical'
    },
    {
      title: 'Jordan Chen',
      subtitle: 'DevOps Engineer',
      handle: '@jordanchen',
      borderColor: '#10B981',
      location: 'Sponsorship'
    },
    {
      title: 'Morgan Blake',
      subtitle: 'UI/UX Designer',
      handle: '@morganblake',
      borderColor: '#FF188C',
      location: 'Design'
    }
  ];

  const data = items !== undefined ? items : demo;

  const gridColsClass = data.length === 1 
    ? 'grid-cols-1 w-full max-w-[320px]' 
    : data.length === 2 
      ? 'grid-cols-1 sm:grid-cols-2 w-full max-w-[680px]' 
      : data.length === 3 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-[1000px]'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full';

  return (
    <div
      className={`relative h-full grid justify-items-center gap-8 py-6 mx-auto ${gridColsClass} ${className}`}
    >
      {/* SVG displacement filter for torn paper edges */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <filter id="torn-card-filter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {data.map((c, i) => {
        // Extract initials for the profile fallback
        const initials = c.title
          .split(' ')
          .filter(n => !n.startsWith('(') && !n.endsWith(')'))
          .map(n => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        // Determine alternate rotation for hand-made comic zine feel
        const rotationClass = i % 3 === 0 
          ? 'hover:rotate-1' 
          : i % 3 === 1 
            ? 'hover:-rotate-1' 
            : 'hover:rotate-[0.5deg]';

        const isFlipped = !!flippedCards[c.title];
        
        return (
          <div
            key={i}
            onClick={() => toggleFlip(c.title)}
            className={`relative w-full max-w-[310px] sm:max-w-[320px] h-[400px] [perspective:1000px] cursor-pointer select-none transition-all duration-300 hover:scale-[1.01] ${rotationClass} group`}
          >
            <div
              className={`relative w-full h-full duration-700 [transform-style:preserve-3d] transition-transform ${
                isFlipped ? '[transform:rotateY(180deg)]' : ''
              }`}
            >
              {/* FRONT SIDE */}
              {/* FRONT SIDE */}
              <div
                className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col p-6 bg-transparent justify-between select-none transition-all duration-300"
                style={{
                  opacity: isFlipped ? 0 : 1,
                  pointerEvents: isFlipped ? 'none' : 'auto'
                }}
              >
                {/* 1. Solid drop shadow layer (Torn shape) */}
                <div 
                  className="absolute inset-2 -z-20 translate-x-2 translate-y-2 group-hover:translate-x-2.5 group-hover:translate-y-2.5 transition-transform duration-300"
                  style={{
                    backgroundColor: c.borderColor || '#FF188C',
                    filter: 'url(#torn-card-filter)'
                  }}
                />
                {/* 2. White fibrous paper core layer */}
                <div 
                  className="absolute inset-1.5 bg-[#FEFEFC] -z-10"
                  style={{
                    filter: 'url(#torn-card-filter)'
                  }}
                />
                {/* 3. Black top paper layer */}
                <div 
                  className="absolute inset-2 bg-[#030404] -z-10"
                  style={{
                    filter: 'url(#torn-card-filter)'
                  }}
                />
                
                {/* Subtle paper halftone texture on black paper */}
                <div className="absolute inset-2 bg-halftone-cloud opacity-10 mix-blend-screen pointer-events-none -z-5" style={{ filter: 'url(#torn-card-filter)' }} />

                {/* Photo Frame */}
                <div className="flex justify-center w-full mt-2 shrink-0 z-10">
                  <div 
                    className="relative w-36 h-[180px] shrink-0 rounded-lg overflow-hidden border-2 bg-[#0e0e0e] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)]"
                    style={{ borderColor: c.borderColor || '#FF188C' }}
                  >
                    {c.image ? (
                      <img 
                        src={c.image} 
                        alt={c.title} 
                        referrerPolicy="no-referrer"
                        loading="lazy" 
                        className="w-full h-full object-cover p-0 hover:scale-105 transition-all duration-300" 
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center font-display font-black text-3xl select-none"
                        style={{ backgroundColor: c.borderColor || '#FF188C', color: '#030404' }}
                      >
                        {initials}
                      </div>
                    )}
                  </div>
                </div>

                {/* Identity Section */}
                <div className="flex flex-col items-center text-center mt-4 space-y-2 flex-grow justify-start z-10">
                  {/* Name */}
                  <h2 className="text-lg md:text-xl font-display font-black uppercase text-white tracking-tight leading-tight line-clamp-2 px-1 mt-1">
                    {c.title}
                  </h2>

                  {/* Designation/Role */}
                  <p 
                    className="font-bold text-xs uppercase tracking-wider line-clamp-2 px-1"
                    style={{ color: c.borderColor || '#FF188C' }}
                  >
                    {c.subtitle}
                  </p>
                </div>

                {/* Flip Hint */}
                <div className="border-t border-white/10 pt-3 w-full text-center mt-auto shrink-0 flex items-center justify-center gap-1.5 text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider z-10">
                  <span className="inline-block w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: c.borderColor || '#FF188C' }} />
                  <span>Click to flip</span>
                </div>
              </div>

              {/* BACK SIDE */}
              <div
                className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col p-5 bg-transparent justify-between select-none transition-all duration-300"
                style={{
                  opacity: isFlipped ? 1 : 0,
                  pointerEvents: isFlipped ? 'auto' : 'none'
                }}
              >
                {/* 1. Solid drop shadow layer (Torn shape - flipped direction) */}
                <div 
                  className="absolute inset-2 -z-20 -translate-x-2 translate-y-2 group-hover:-translate-x-2.5 group-hover:translate-y-2.5 transition-transform duration-300"
                  style={{
                    backgroundColor: c.borderColor || '#FF188C',
                    filter: 'url(#torn-card-filter)'
                  }}
                />
                {/* 2. White fibrous paper core layer */}
                <div 
                  className="absolute inset-1.5 bg-[#FEFEFC] -z-10"
                  style={{
                    filter: 'url(#torn-card-filter)'
                  }}
                />
                {/* 3. Black top paper layer */}
                <div 
                  className="absolute inset-2 bg-[#030404] -z-10"
                  style={{
                    filter: 'url(#torn-card-filter)'
                  }}
                />
                
                {/* Subtle paper halftone texture on black paper */}
                <div className="absolute inset-2 bg-halftone-cloud opacity-10 mix-blend-screen pointer-events-none -z-5" style={{ filter: 'url(#torn-card-filter)' }} />

                {/* Top Info Banner (Compact) */}
                <div className="flex flex-col text-left shrink-0 z-10">
                  <h3 className="text-base font-display font-black uppercase text-white tracking-tight leading-tight line-clamp-1">
                    {c.title}
                  </h3>
                  <p 
                    className="font-bold text-[10px] uppercase tracking-wider truncate mt-0.5"
                    style={{ color: c.borderColor || '#FF188C' }}
                  >
                    {c.subtitle}
                  </p>
                </div>

                {/* Thin Divider */}
                <div className="border-t border-white/10 my-2.5 shrink-0 z-10" />

                {/* Description/Bio (tagline) */}
                <div className="flex-1 min-h-0 flex flex-col justify-start z-10 relative">
                  <p className="text-white/80 text-[11px] font-mono font-bold leading-relaxed line-clamp-6">
                    {getTagline(c.location, c.title)}
                  </p>
                  
                  {/* Decorative Hindi watermark 'सफ़र' */}
                  <span 
                    className="absolute right-1 bottom-1 text-3xl font-black font-display select-none pointer-events-none transform rotate-[-8deg] font-hindi opacity-10"
                    style={{ color: c.borderColor || '#FF188C' }}
                  >
                    सफ़र
                  </span>
                </div>

                {/* Social Actions Block */}
                <div className="border-t border-white/10 pt-3 mt-3 flex justify-start gap-2.5 shrink-0 z-10">
                  {c.socials?.github && (
                    <a
                      href={c.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 bg-[#0e0e0e] border-2 border-white/10 text-white/80 hover:text-[var(--hover-color)] hover:border-[var(--hover-color)] hover:shadow-[2px_2px_0px_0px_var(--hover-color)] active:translate-y-[2px] transition-all rounded-md flex justify-center items-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)] cursor-pointer"
                      style={{ '--hover-color': c.borderColor || '#FF188C' } as React.CSSProperties}
                      aria-label="GitHub Profile"
                    >
                      <GitHubIcon size={14} />
                    </a>
                  )}
                  {c.socials?.linkedin && (
                    <a
                      href={c.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 bg-[#0e0e0e] border-2 border-white/10 text-white/80 hover:text-[var(--hover-color)] hover:border-[var(--hover-color)] hover:shadow-[2px_2px_0px_0px_var(--hover-color)] active:translate-y-[2px] transition-all rounded-md flex justify-center items-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)] cursor-pointer"
                      style={{ '--hover-color': c.borderColor || '#FF188C' } as React.CSSProperties}
                      aria-label="LinkedIn Profile"
                    >
                      <LinkedInIcon size={14} />
                    </a>
                  )}
                  {c.socials?.email && (
                    <a
                      href={c.socials.email.startsWith('mailto:') ? c.socials.email : `mailto:${c.socials.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 bg-[#0e0e0e] border-2 border-white/10 text-white/80 hover:text-[var(--hover-color)] hover:border-[var(--hover-color)] hover:shadow-[2px_2px_0px_0px_var(--hover-color)] active:translate-y-[2px] transition-all rounded-md flex justify-center items-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)] cursor-pointer"
                      style={{ '--hover-color': c.borderColor || '#FF188C' } as React.CSSProperties}
                      aria-label="Send Email"
                    >
                      <EmailIcon size={14} />
                    </a>
                  )}
                  {c.socials?.instagram && (
                    <a
                      href={c.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 bg-[#0e0e0e] border-2 border-white/10 text-white/80 hover:text-[var(--hover-color)] hover:border-[var(--hover-color)] hover:shadow-[2px_2px_0px_0px_var(--hover-color)] active:translate-y-[2px] transition-all rounded-md flex justify-center items-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)] cursor-pointer"
                      style={{ '--hover-color': c.borderColor || '#FF188C' } as React.CSSProperties}
                      aria-label="Instagram Profile"
                    >
                      <InstagramIcon size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChromaGrid;
