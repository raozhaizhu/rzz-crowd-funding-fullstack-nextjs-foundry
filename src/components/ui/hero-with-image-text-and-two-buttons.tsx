import { Badge } from "@/components/ui/badge";
import { type ReactNode } from "react";
import ExploreCampaignById from "../explore-campaign-by-id";

function HeroComponent({ children }: { children: ReactNode }) {
  return (
    <div className='w-full h-dvh'>
      <div className='h-full grid grid-cols-1 gap-8 items-center lg:grid-cols-2'>
        <div className='flex gap-4 flex-col items-center mx-4 md:mx-0'>
          <div className='flex gap-4 flex-col'>
            <div>
              <Badge variant='secondary'>We&apos;re live!</Badge>
            </div>
            <h1 className='text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-regular text-white'>
              This is the start of something!
            </h1>
            <p className='text-xl leading-relaxed tracking-tight max-w-lg text-left text-white/90'>
              Running a crowdfunding campaign can be challenging. Avoid extra
              hurdles by using our platform to simplify fundraising. Our mission
              is to make collecting funds easier, faster, and more reliable for
              everyone.
            </p>
          </div>
          <div className='flex flex-row gap-4'>
            <ExploreCampaignById />
          </div>
        </div>
        <div className='flex justify-center items-center'>{children}</div>
      </div>
    </div>
  );
}

export { HeroComponent };
