interface CardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
  index?: number; // For stagger animation
  noPadding?: boolean;
}

export default function Card({ title, icon, children, className = "", headerRight, index = 0, noPadding = false }: CardProps) {
  return (
    <div
      className={`bg-[#131820] border border-[#2A3441] rounded-lg overflow-hidden hover-glow hover-lift stagger-in ${className}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      {title && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A3441]">
          <div className="flex items-center gap-2">
            {icon && <span className="text-[#6B7280]">{icon}</span>}
            <h3 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider font-[family-name:var(--font-display)]">{title}</h3>
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-3"}>{children}</div>
    </div>
  );
}
