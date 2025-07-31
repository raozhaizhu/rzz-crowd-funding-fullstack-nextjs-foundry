"use client";

// ANCHOR React & library

import { Button } from "@/components/ui/button";
import {
  CreateCampaignInfoSchemaClient,
  useCreateCampaign,
} from "@/hooks/use-crowd-funding-contract";
import { getCurrentTimeStamp } from "@/utils/getCurrentTimeStamp";
import { parseEther } from "viem";
import { useAccount } from "wagmi";

// ANCHOR Components

// ANCHOR Types & Interfaces

// ANCHOR Constants
const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

// ANCHOR Component definition
const HomePageComponent = () => {
  // ANCHOR Hooks (state, ref, effect, etc.)
  const { createCampaign, isPending, error, txHash } = useCreateCampaign();
  const { address } = useAccount();

  // ANCHOR Derived values (memo, callback)

  // ANCHOR Event handlers
  const handleCreateCampaign = () => {
    // HACK It's a client console.log, it should be commented out before deployment.
    console.log("*** address:", address, "***");
    if (!address) return;
    const INFO = {
      owner: address,
      title: "t",
      description: "d",
      deadline: getCurrentTimeStamp() + 7 * ONE_DAY_IN_SECONDS,
      targetInEther: 1,
    };
    // HACK It's a client console.log, it should be commented out before deployment.
    console.log("*** INFO:", INFO, "***");
    createCampaign(INFO);
  };
  // ANCHOR Render helpers (optional functions returning JSX)

  // ANCHOR Render
  return (
    <section className='container mx-auto'>
      <div className='flex justify-center'>HomePageComponent</div>
      <Button
        onClick={() => handleCreateCampaign()}
        disabled={isPending}
      >
        Test
      </Button>
      <div>
        <p>{error?.message}</p>
        <p>{txHash}</p>
      </div>
    </section>
  );
};
export default HomePageComponent;
