"use client";

// ANCHOR React & library

// ANCHOR Components
import Cards from "@/app/cards";
import Hero from "@/app/hero";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// ANCHOR Types & Interfaces

// ANCHOR Constants

// ANCHOR Component definition
const HomePageComponent = () => {
  // ANCHOR Hooks (state, ref, effect, etc.)

  // ANCHOR Derived values (memo, callback)

  // ANCHOR Event handlers

  // ANCHOR Render helpers (optional functions returning JSX)

  // ANCHOR Render
  return (
    <>
      {/* hero 界面，分为左右两侧，左侧为文字+查询活动，右侧为创建活动表格 */}
      <section className='w-full relative overflow-hidden'>
        <video
          autoPlay
          muted
          playsInline
          className='absolute top-0 left-0 w-full h-full object-cover z-[-1]'
          loop
        >
          <source
            src='/videos/sea.mp4'
            type='video/mp4'
          />
          Your browser does not support the video tag.
        </video>

        <div className='container mx-auto relative'>
          <div className='absolute top-4 md:top-20 lg:top-4 right-48 w-24'>
            <ConnectButton />
          </div>
          <Hero />
        </div>
      </section>
      {/* 卡片组界面 */}
      <section
        className={`py-20 w-full bg-cover bg-no-repeat bg-center min-h-[50vh]
          bg-[url("/images/texture.avif")]`}
      >
        <div className='container mx-auto'>
          <Cards />
        </div>
      </section>
    </>
  );
};
export default HomePageComponent;
