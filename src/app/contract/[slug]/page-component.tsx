"use client";
// ANCHOR React & library
import Image from "next/image";
import { formatEther, formatUnits } from "viem";
import { cn } from "@/lib/utils";
// ANCHOR Components
import {
  useGetCampaign,
  useGetDonatorsAndDonations,
} from "@/hooks/use-crowd-funding-contract";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";
import { Marquee } from "@/components/magicui/marquee";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ReactNode, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
// ANCHOR Types & Interfaces

// ANCHOR Constants
const PRECISION = 100;
const GRADIENT_AVATAR_CLASSNAME = [
  "bg-gradient-to-tr from-indigo-500 to-pink-600",
  "bg-gradient-to-bl from-blue-600 to-green-500",
  "bg-gradient-to-r from-purple-400 to-red-700",
  "bg-gradient-to-tl from-teal-500 to-yellow-400",
  "bg-gradient-to-b from-orange-600 to-cyan-500",
  "bg-gradient-to-br from-pink-700 to-blue-500",
  "bg-gradient-to-l from-green-400 to-purple-600",
  "bg-gradient-to-t from-red-500 to-indigo-700",
  "bg-gradient-to-tr from-yellow-600 to-teal-500",
  "bg-gradient-to-r from-cyan-400 to-orange-700",
];

// ANCHOR Component definition
const ContractPageComponent = ({ slug }: { slug: string }) => {
  // ANCHOR Hooks (state, ref, effect, etc.)
  const { campaign, error, isPending } = useGetCampaign(Number(slug)); // 默认 ID
  const {
    donatorsAndDonations,
    error: donationInfoError,
    isPending: donationInfoPending,
  } = useGetDonatorsAndDonations(Number(slug)); // 默认 ID
  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);
  // ANCHOR Derived values (memo, callback)
  const collected =
    campaign && formatUnits(campaign.amountCollectedInEthWei, 18);
  const target = campaign && formatUnits(campaign.targetInEthWei, 18);
  const donationProgress =
    (Number(campaign?.amountCollectedInEthWei) * PRECISION) /
    Number(campaign?.targetInEthWei);

  let combined: { donator: string; donation: number }[] = [];

  if (donatorsAndDonations) {
    const [donators, donations] = donatorsAndDonations;
    combined = donators.map((donator, index) => ({
      donator: String(donator),
      donation: Number(donations[index]),
    }));
  }
  // ANCHOR Event handlers

  // ANCHOR Render helpers (optional functions returning JSX)

  // ANCHOR Render
  return (
    <section className='container mx-auto flex flex-col items-center gap-4 md:gap-8 lg:gap-12'>
      {/* title & description */}
      <article className='space-y-1 whitespace-pre-wrap'>
        <h1 className='text-center h1-res mb-10'>{campaign?.title}</h1>
        <p className='text-center text-foreground/70 text-res font-mono'>
          {campaign?.description}
        </p>
      </article>
      {/* badges */}
      <Badge
        className='text-res'
        variant='outline'
      >
        Owner: {campaign && campaign.owner}
      </Badge>
      <Badge
        className='text-res'
        variant={
          new Date() > new Date(Number(campaign?.deadline))
            ? "destructive"
            : "outline"
        }
      >
        Ends at:{" "}
        {campaign && new Date(Number(campaign?.deadline)).toLocaleString()}
      </Badge>
      {/* hero img */}
      <div className='w-3/4'>
        <AspectRatio
          ratio={16 / 9}
          className='bg-muted rounded-lg'
        >
          <Image
            src='/images/city.avif'
            alt='City'
            fill
            className='w-full h-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale'
          />
        </AspectRatio>
      </div>

      <MarqueeDonations combined={combined}>
        {/* donation info */}
        <div className='my-4 md:my-8 lg:my-12 flex justify-between items-center gap-4 md:gap-8 lg:gap-12'>
          <article className='space-y-2 text-center text-res font-mono'>
            <p>Collected: {collected} ETH</p>
            <p>Target: {target} ETH</p>
            <p>Count: {combined.length} Times</p>
          </article>

          {!isPending && (
            <AnimatedCircularProgressBar
              max={100}
              min={0}
              value={donationProgress}
              gaugePrimaryColor='rgb(79 70 229)'
              gaugeSecondaryColor='rgba(0, 0, 0, 0.1)'
            />
          )}
        </div>
      </MarqueeDonations>
    </section>
  );
};
export default ContractPageComponent;

const ReviewCard = ({
  donator,
  donation,
}: {
  donator: string;
  donation: number;
}) => {
  const randomIndex = Math.floor(
    Math.random() * GRADIENT_AVATAR_CLASSNAME.length
  );
  const gradientClassname = GRADIENT_AVATAR_CLASSNAME[randomIndex];
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className='flex flex-row items-center gap-2'>
        <div className={`w-12 h-12 rounded-full ${gradientClassname}`}></div>

        <div className='flex flex-col'>
          <figcaption className='text-sm font-medium dark:text-white'>
            address: {donator.slice(0, 4)}...{donator.slice(-4)}
          </figcaption>
        </div>
      </div>
      <blockquote className='mt-2 text-sm'>
        Donated: {formatEther(BigInt(donation))} ETH
      </blockquote>
    </figure>
  );
};

export const MarqueeDonations = ({
  combined,
  children,
}: {
  combined: { donator: string; donation: number }[];
  children: ReactNode;
}) => {
  const firstRow = combined.slice(0, combined.length / 2);
  const secondRow = combined.slice(combined.length / 2);
  return (
    <div className='relative flex w-full flex-col items-center justify-center overflow-hidden'>
      <Marquee
        pauseOnHover
        className='[--duration:20s]'
      >
        {firstRow.map((review, index) => (
          <ReviewCard
            key={index}
            {...review}
          />
        ))}
      </Marquee>
      {children}
      <Marquee
        reverse
        pauseOnHover
        className='[--duration:20s]'
      >
        {secondRow.map((review, index) => (
          <ReviewCard
            key={index}
            {...review}
          />
        ))}
      </Marquee>
      <div className='pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background'></div>
      <div className='pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background'></div>
    </div>
  );
};
