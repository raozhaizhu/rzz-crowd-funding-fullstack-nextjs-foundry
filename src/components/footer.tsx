"use client";
import Link from "next/link";
// ANCHOR React & library

// ANCHOR Components
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

// ANCHOR Types & Interfaces

// ANCHOR Constants
const brandName = "Raozhaizhu";
const logo = (
  /* eslint-disable @next/next/no-img-element */
  <img
    src='/images/logo-840.png'
    alt='rzz-logo'
    className='w-5 h-5'
  />
);
const socialLinks = [
  {
    icon: (
      /* eslint-disable @next/next/no-img-element */
      <img
        src='/images/github.svg'
        alt='github-logo'
        className='h-5 w-5'
      />
    ),
    href: "https://github.com/raozhaizhu/rzz-crowd-funding-foundry",
    label: "Contract Source Code",
  },
  {
    icon: (
      /* eslint-disable @next/next/no-img-element */
      <img
        src='/images/github.svg'
        alt='github-logo'
        className='h-5 w-5'
      />
    ),
    href: "https://github.com/raozhaizhu/rzz-crowd-funding-fullstack-nextjs-foundry",
    label: "Website Source Code",
  },
  {
    icon: (
      /* eslint-disable @next/next/no-img-element */
      <img
        src='/images/etherscan.svg'
        alt='github-logo'
        className='h-5 w-5'
      />
    ),
    href: "https://sepolia.etherscan.io/address/0x6d21ab537862a8d0302cdb1fb4cfd1f76aee3b5c",
    label: "Etherscan Contract Address",
  },
];
const mainLinks = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];
const copyright = {
  text: "© 2025 Rzz Hub",
  license: "All rights reserved",
};
// ANCHOR Component definition
const Footer = () => {
  // ANCHOR Hooks (state, ref, effect, etc.)

  // ANCHOR Derived values (memo, callback)

  // ANCHOR Event handlers

  // ANCHOR Render helpers (optional functions returning JSX)

  // ANCHOR Render
  return (
    <footer className='pb-4 pt-4 lg:pb-8 lg:pt-8 bg-slate-900/10'>
      <div className='px-4 lg:px-8'>
        <div className='flex items-center justify-between'>
          <Link
            href='/'
            className='flex items-center gap-x-2'
            aria-label={brandName}
          >
            {logo}
            <span className='font-bold text-xl'>{brandName}</span>
          </Link>
          <ul className='flex list-none space-x-3'>
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='secondary'
                      size='icon'
                      className='h-10 w-10 rounded-full'
                      asChild
                    >
                      <Link
                        href={link.href}
                        target='_blank'
                        aria-label={link.label}
                      >
                        {link.icon}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
        <div className='border-t border-gray-300 mt-6 pt-6 md:mt-4 md:pt-8 md:grid md:grid-cols-10'>
          <nav className='md:mt-0 md:col-[4/11]'>
            <ul className='list-none flex flex-wrap -my-1 -mx-2 md:justify-end'>
              {mainLinks.map((link, i) => (
                <li
                  key={i}
                  className='my-1 mx-2 shrink-0'
                >
                  <Link
                    href={link.href}
                    className='text-sm text-primary underline-offset-4 hover:underline'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className='mt-6 md:mt-0 md:col-[4/11]'>
            <ul className='list-none flex flex-wrap -my-1 -mx-3 md:justify-end'>
              {legalLinks.map((link, i) => (
                <li
                  key={i}
                  className='my-1 mx-3 shrink-0'
                >
                  <Link
                    href={link.href}
                    className='text-sm text-muted-foreground underline-offset-4 hover:underline'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='mt-6 text-sm leading-6 text-muted-foreground whitespace-nowrap md:mt-0 md:row-[1/3] md:col-[1/4]'>
            <div>{copyright.text}</div>
            {copyright.license && <div>{copyright.license}</div>}
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
