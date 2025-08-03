"use client";

import { ReactNode } from "react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface AuthorCardProps {
  className?: string;
  backgroundImage: string;
  author: {
    readTime?: string;
  };
  content: {
    title: string;
    description: string;
  };
  children?: ReactNode;
}

export const AuthorCard = ({
  className,
  backgroundImage,
  author,
  content,
  children,
}: AuthorCardProps) => {
  return (
    <div className='max-w-sm md:max-w-xs lg:max-w-sm w-full group/card mx-auto'>
      <div
        className={cn(
          "overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4 bg-cover",
          className
        )}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {" "}
        <div className='absolute top-4 right-4 flex flex-col items-end gap-2 z-10'>
          {children}
        </div>
        <div className='absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60' />
        <div className='flex flex-row items-center space-x-4 z-1'>
          <div className='flex flex-col'>
            {/* <p className='font-normal text-base text-gray-50 relative z-10'>
              {author.name}
            </p> */}
            {author.readTime && (
              // <p className='text-sm text-grey whitespace-pre-line'>
              //   {author.readTime}
              // </p>
              <Badge
                variant='default'
                className='whitespace-pre-line'
              >
                {author.readTime}
              </Badge>
            )}
          </div>
        </div>
        <div className='text content'>
          <h1 className='font-bold text-xl md:text-2xl text-gray-50 relative z-10'>
            {content.title}
          </h1>
          <p className='font-normal text-sm text-gray-50 relative z-10 my-4'>
            {content.description}
          </p>
        </div>
      </div>
    </div>
  );
};
