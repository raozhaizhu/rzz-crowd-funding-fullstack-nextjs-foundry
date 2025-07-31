"use client";

import {
  useAccount,
  useChainId,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  chainsToContracts,
  crowdFundingAbi,
} from "@/constants/crowd-funding-constants";
import { useState } from "react";
import { z } from "zod";
import { isAddress, parseEther } from "viem";
import { getCurrentTimeStamp } from "@/utils/getCurrentTimeStamp";

type Campaign = {
  owner: number;
  deadline: number;
  targetInEther: number;
  amountCollectedInEther: number;
  title: string;
  description: string;
  donations: number[];
  donators: number[];
};

type DonationInfo = Pick<Campaign, "donations" | "donators">;

// type Functions = {
//   createCampaign: (info: CreateCampaignInfo) => Promise<void>;
//   donateToCampaign: (id: number) => Promise<void>;
//   // getter
//   getDonatorsAndDonations: (id: number) => Promise<DonationInfo>;
//   getCampaign: (id: number) => Promise<Campaign>;
//   getCampaignsPaginated: (offset: number, limit: number) => Promise<Campaign[]>;
//   getAllCampaigns: () => Promise<Campaign[]>;
// };

const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

export const createCampaignInfoSchemaClient = z.object({
  // 校验 owner 格式是否为钱包地址
  owner: z.string().refine((val) => isAddress(val), {
    message: "Owner must be a valid Ethereum address",
  }),

  // title必须小于 64 字节
  title: z
    .string()
    .max(64, "Title must be 64 bytes or less")
    .refine((val) => new TextEncoder().encode(val).length <= 64, {
      message: "Title exceeds 64 bytes when encoded",
    }),

  // title必须小于 256 字节
  description: z
    .string()
    .max(256, "Description must be 256 bytes or less")
    .refine((val) => new TextEncoder().encode(val).length <= 256, {
      message: "Description exceeds 256 bytes when encoded",
    }),

  // deadline必须至少在 3 天后（合同本身约定是在未来即可）
  deadline: z
    .number()
    .int()
    .min(getCurrentTimeStamp() + 3 * ONE_DAY_IN_SECONDS, {
      message: "Deadline must be at least 3 days from now",
    }),
  // 筹集目标为整数，至少 1 eth
  // TODO foundry 里好像忘记校验 ether 了，要回去修改下合同
  targetInEther: z.number().int().min(1, "Minimum target is 1 ETH"),
});

export type CreateCampaignInfoSchemaClient = z.infer<
  typeof createCampaignInfoSchemaClient
>;
/**
 * 该函数用于创建活动
 * @param info 表格信息
 * @returns
 */
export const useCreateCampaign = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  // 解构合同函数和状态
  const { writeContract, isPending, error, data: txHash } = useWriteContract();

  const createCampaign = (info: CreateCampaignInfoSchemaClient) => {
    const { owner, title, description, deadline, targetInEther } = info;

    // 检查钱包和链的状态
    if (!address) throw new Error("Wallet not connected");
    if (!chainId) throw new Error("ChainId not detected");

    try {
      const tx = writeContract({
        address: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
        abi: crowdFundingAbi,
        functionName: "createCampaign",
        args: [
          owner,
          title,
          description,
          deadline,
          parseEther(String(targetInEther)),
        ],
      });

      return tx;
    } catch (error) {
      console.log("*** Error creating campaign:", error, "***");
    }
  };

  return {
    createCampaign,
    isPending,
    error,
    txHash,
  };
};
