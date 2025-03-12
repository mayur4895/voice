"use client"

export default function LayoutPage({ children }: { children: React.ReactNode }) {
 

  return (
    <div>
      <div className="relative"> 
        {children}
      </div>
    </div>
  );
}
