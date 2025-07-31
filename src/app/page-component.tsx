"use client";

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
import { getCurrentTimeStamp } from "@/utils/getCurrentTimeStamp";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";

// ANCHOR Components

// ANCHOR Types & Interfaces

// ANCHOR Constants
const ONE_DAY_IN_SECONDS = 24 * 60 * 60;
const OFFSET = 1;
const LIMIT = 2;

// ANCHOR Component definition
const HomePageComponent = () => {
  // ANCHOR Hooks (state, ref, effect, etc.)
  const { address } = useAccount();
  const [campaignId, setCampaignId] = useState<number | null>(null);

  const {
    campaign,
    error: getCampaignError,
    isPending: getCampaignPending,
  } = useGetCampaign(campaignId ?? 0); // 默认 ID

  const { campaigns } = useGetCampaignsPaginated(OFFSET, LIMIT);
  const { allCampaigns } = useGetAllCampaigns();

  const { donatorsAndDonations } = useGetDonatorsAndDonations(campaignId ?? 0);

  const {
    createCampaign,
    isPending: creationPending,
    error: creationError,
    txHash: creationTxHash,
  } = useCreateCampaign();

  const {
    donateToCampaign,
    isPending: donationPending,
    error: donationError,
    txHash: donationTxHash,
  } = useDonateToCampaign();

  useEffect(() => {
    console.log("Current campaign data:", campaign);
    console.log("Current campaigns data:", campaigns);
    console.log("Current allCampaigns data:", allCampaigns);
    console.log("Current donatorsAndDonations data:", donatorsAndDonations);
  }, [campaign, campaigns, allCampaigns, donatorsAndDonations]);
  // ANCHOR Derived values (memo, callback)

  // ANCHOR Event handlers
  const handleCreateCampaign = () => {
    if (!address) return;
    const INFO = {
      owner: address,
      title: "t",
      description: "d",
      deadline: getCurrentTimeStamp() + 7 * ONE_DAY_IN_SECONDS,
      targetInEther: 1,
    };

    createCampaign(INFO); // HACK 硬编码，需要完善
  };

  const handleDonateToCampaign = () => {
    if (!address) return;
    donateToCampaign(0, 1); // HACK 硬编码，需要完善
  };

  const handleGetCampaign = () => {
    setCampaignId(0); // HACK 硬编码，需要完善
  };

  // ANCHOR Render helpers (optional functions returning JSX)

  // ANCHOR Render
  return (
    <section className='container mx-auto'>
      <div className='flex justify-center'>HomePageComponent</div>
      <Button
        onClick={() => handleCreateCampaign()}
        disabled={creationPending}
      >
        Create
      </Button>
      <Button
        onClick={() => handleDonateToCampaign()}
        disabled={donationPending}
      >
        Donate
      </Button>
      <Button onClick={() => handleGetCampaign()}>Get Campaign</Button>
      <div>
        <p>creationError:{creationError?.message || "none"}</p>
        <p>creationTxHash:{creationTxHash}</p>
        <p>donationError:{donationError?.message || "none"}</p>
        <p>donationTxHash:{donationTxHash}</p>
      </div>
      <div>getCampaignError:{getCampaignError?.message || "none"}</div>
      <div>campaignId:{campaignId ?? "none"}</div>
      <div>campaignTitle:{campaign?.title || "none"}</div>
    </section>
  );
};
export default HomePageComponent;
