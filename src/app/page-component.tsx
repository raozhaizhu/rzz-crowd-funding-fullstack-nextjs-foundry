"use client";

import Hero from "@/components/hero";
import { MagicCard } from "@/components/magicui/magic-card";
import { Meteors } from "@/components/magicui/meteors";
// ANCHOR React & library

import { Button } from "@/components/ui/button";
import {
  CreateCampaignInfoSchemaClient,
  useCreateCampaign,
  useDonateToCampaign,
  useGetCampaign,
  useGetCampaignsPaginated,
  useGetAllCampaigns,
  useGetDonatorsAndDonations,
} from "@/hooks/use-crowd-funding-contract";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";

// ANCHOR Components

// ANCHOR Types & Interfaces

// ANCHOR Constants
const OFFSET = 1;
const LIMIT = 2;

// ANCHOR Component definition
const HomePageComponent = () => {
  // ANCHOR Hooks (state, ref, effect, etc.)
  const { address } = useAccount();

  // const {
  //   campaign,
  //   error: getCampaignError,
  //   isPending: getCampaignPending,
  // } = useGetCampaign(campaignId ?? 0); // 默认 ID

  const { campaigns } = useGetCampaignsPaginated(OFFSET, LIMIT);
  const { allCampaigns } = useGetAllCampaigns();

  // const { donatorsAndDonations } = useGetDonatorsAndDonations(campaignId ?? 0);

  const {
    donateToCampaign,
    isPending: donationPending,
    error: donationError,
    txHash: donationTxHash,
  } = useDonateToCampaign();

  useEffect(() => {
    // console.log("Current campaign data:", campaign);
    console.log("Current campaigns data:", campaigns);
    console.log("Current allCampaigns data:", allCampaigns);
    // console.log("Current donatorsAndDonations data:", donatorsAndDonations);
  }, [campaigns, allCampaigns]);
  // ANCHOR Derived values (memo, callback)

  // ANCHOR Event handlers

  const handleDonateToCampaign = () => {
    if (!address) return;
    donateToCampaign(0, 1); // HACK 硬编码，需要完善
  };

  // const handleGetCampaign = () => {
  //   setCampaignId(0); // HACK 硬编码，需要完善
  // };

  // ANCHOR Render helpers (optional functions returning JSX)

  // ANCHOR Render
  return (
    <section className='container mx-auto'>
      <Hero />
    </section>
  );
};
export default HomePageComponent;

// <Button
//   onClick={() => handleCreateCampaign()}
//   disabled={creationPending}
// >
//   Create
// </Button>
// <Button
//   onClick={() => handleDonateToCampaign()}
//   disabled={donationPending}
// >
//   Donate
// </Button>
// <Button onClick={() => handleGetCampaign()}>Get Campaign</Button>
// <div>
//   <p>creationError:{creationError?.message || "none"}</p>
//   <p>creationTxHash:{creationTxHash}</p>
//   <p>donationError:{donationError?.message || "none"}</p>
//   <p>donationTxHash:{donationTxHash}</p>
// </div>
// <div>
//   <p>getCampaignError:{getCampaignError?.message || "none"}</p>
//   <p>campaignId:{campaignId ?? "none"}</p>
//   <p>campaignTitle:{campaign?.title || "none"}</p>
// </div>
