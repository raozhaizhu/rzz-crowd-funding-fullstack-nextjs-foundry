"use client";

// ANCHOR React & library
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GITHUB_CONTRACT_URL } from "@/constants/global-constants";
import ExploreCampaignById from "@/components/explore-campaign-by-id";

// ANCHOR Components

// ANCHOR Types & Interfaces

// ANCHOR Constants

// ANCHOR Component definition
const AnimatedHero = () => {
  const [titleNumber, setTitleNumber] = useState(0);

  const titles = ["amazing", "new", "wonderful", "beautiful"];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber]);

  return (
    <div className='w-full'>
      <div className='container mx-auto'>
        <div className='flex gap-8 py-20 lg:py-40 items-center justify-center flex-col'>
          <div>
            <Link href={GITHUB_CONTRACT_URL}>
              <Button
                variant='secondary'
                size='sm'
                className='gap-4'
              >
                View source code in github <MoveRight className='w-4 h-4' />
              </Button>
            </Link>
          </div>
          <div className='flex gap-4 flex-col'>
            <h1 className='text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular'>
              <span className='text-spektr-cyan-50'>
                Let&apos;s build something
              </span>
              <span className='relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1'>
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className='absolute font-semibold'
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className='text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center'>
              Running a crowdfunding campaign can be challenging. Avoid extra
              hurdles by using our platform to simplify fundraising. Our mission
              is to make collecting funds easier, faster, and more reliable for
              everyone.
            </p>
          </div>
          <div className='flex flex-row gap-3'>
            <ExploreCampaignById />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnimatedHero;
