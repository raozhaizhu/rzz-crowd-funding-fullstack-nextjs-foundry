import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { ReactNode } from "react";

export function FlickeringGridDemo({ children }: { children: ReactNode }) {
  return (
    <div className='relative h-auto w-full overflow-hidden rounded-lg border bg-background'>
      <FlickeringGrid
        className='absolute inset-0 z-0 size-full'
        squareSize={4}
        gridGap={6}
        color='#6B7280'
        maxOpacity={0.5}
        flickerChance={0.1}
        height={4000}
        width={4000}
      />
      {children}
    </div>
  );
}
