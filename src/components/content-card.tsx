"use client";

import { ReactNode } from "react";
import { Badge } from "./ui/badge";
import Image from "next/image";
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
          "overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4",
          className
        )}
      >
        {/* 背景图片层 */}
        <div className='absolute inset-0 -z-10'>
          <Image
            src={backgroundImage}
            alt={content.title}
            fill
            sizes='100%'
            className='object-cover'
            priority
          />
          {/* 下面的半透明遮罩层 */}
          <div className='absolute inset-0 bg-black opacity-60 transition duration-300 group-hover/card:opacity-70' />
        </div>

        {/* 右上角按钮等内容 */}
        <div className='absolute top-4 right-4 flex flex-col items-end gap-2 z-20'>
          {children}
        </div>

        {/* 底部信息区 */}
        <div className='flex flex-row items-center space-x-4 z-10'>
          <div className='flex flex-col'>
            {author.readTime && (
              <Badge
                variant='default'
                className='whitespace-pre-line'
              >
                {author.readTime}
              </Badge>
            )}
          </div>
        </div>

        {/* 文字内容 */}
        <div className='text content z-10'>
          <h1 className='font-bold text-xl md:text-2xl text-gray-50 relative'>
            {content.title}
          </h1>
          <p className='font-normal text-sm text-gray-50 my-4 relative'>
            {content.description}
          </p>
        </div>
      </div>
    </div>
  );
};
