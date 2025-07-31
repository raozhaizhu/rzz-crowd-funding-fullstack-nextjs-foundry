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
import { bigint, z } from "zod";
import { isAddress, parseEther } from "viem";

type Campaign = {
  owner: `0x${string}`;
  deadline: bigint;
  targetInEther: bigint;
  amountCollectedInEther: bigint;
  title: string;
  description: string;
  donations: bigint[];
  donators: `0x${string}`[];
};

type DonationInfo = Pick<Campaign, "donations" | "donators">;

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ONE_DAY_IN_SECONDS = 24 * 60 * 60 * 1000; // 一天时间，以毫秒计
const GRACE_MS = 300 * 1000; // 允许延迟 300 秒

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
  // deadline已经毫秒计
  deadline: z
    .number()
    .int()
    .min(Date.now() + 3 * ONE_DAY_IN_SECONDS + GRACE_MS, {
      message: "Deadline must be at least 3 days from now",
    }),
  // 筹集目标为整数，至少 1 eth
  // TODO foundry 里好像忘记校验 ether 了，要回去修改下合同
  targetInEther: z.number().int().min(1, "Minimum target is 1 ETH"),
});

/* -------------------------------------------------------------------------- */
/*                                   Setter                                   */
/* -------------------------------------------------------------------------- */

export type CreateCampaignInfoSchemaClient = z.infer<
  typeof createCampaignInfoSchemaClient
>;
/**
 * @notice 该函数用于调用创建活动函数，并获得对应状态/数据
 * @param info 用于创建合同的表格信息
 * @returns createCampaign 主要函数，用于创建合同
 * @returns tsHash  交易哈希值，用于查询交易信息
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
      writeContract({
        address: CONTRACT_ADDRESS, // 合同地址，暂且硬编码
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
/**
 * @notice 该函数用于调用捐献活动函数，并获得对应状态/数据
 * @param id 目标合同的 id
 * @returns donateToCampaign 主要函数，用于创建合同
 * @returns tsHash  交易哈希值，用于查询交易信息
 */
export const useDonateToCampaign = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  // 解构合同函数和状态
  const { writeContract, isPending, error, data: txHash } = useWriteContract();

  const donateToCampaign = (id: number, value: number) => {
    // 检查钱包和链的状态
    if (!address) throw new Error("Wallet not connected");
    if (!chainId) throw new Error("ChainId not detected");

    try {
      writeContract({
        address: CONTRACT_ADDRESS, // 合同地址，暂且硬编码
        abi: crowdFundingAbi,
        functionName: "donateToCampaign",
        args: [id],
        value: parseEther(String(value)),
      });
    } catch (error) {
      console.log("*** Error creating campaign:", error, "***");
    }
  };

  return {
    donateToCampaign,
    isPending,
    error,
    txHash,
  };
};

/* -------------------------------------------------------------------------- */
/*                                   Getter                                   */
/* -------------------------------------------------------------------------- */

/**
 * @notice 该函数用于查询活动，并获得对应状态/数据
 * @param id 目标合同的 id
 * @returns campaign 活动信息
 */
export const useGetCampaign = (id: number) => {
  const {
    data: campaign,
    error,
    isPending,
  } = useReadContract({
    address: CONTRACT_ADDRESS, // 合同地址，暂且硬编码
    abi: crowdFundingAbi,
    functionName: "getCampaign",
    args: [BigInt(id)],
  });

  return {
    campaign: campaign as Campaign | undefined, // 类型断言
    error,
    isPending,
  };
};
/**
 * @notice 该函数用于查询多个活动，并获得对应状态/数据
 * @param offset 跳过多少合同
 * @param limit 想要获得多少合同
 *
 * @returns campaigns 多个活动信息
 */
export const useGetCampaignsPaginated = (offset: number, limit: number) => {
  const {
    data: campaigns,
    error,
    isPending,
  } = useReadContract({
    address: CONTRACT_ADDRESS, // 合同地址，暂且硬编码
    abi: crowdFundingAbi,
    functionName: "getCampaignsPaginated",
    args: [BigInt(offset), BigInt(limit)],
  });

  return {
    campaigns: campaigns as Campaign[] | undefined, // 类型断言
    error,
    isPending,
  };
};
/**
 * @notice 该函数用于查询合同内所有活动，并获得对应状态/数据
 *
 * @returns allCampaigns 所有活动信息
 */
export const useGetAllCampaigns = () => {
  const {
    data: allCampaigns,
    error,
    isPending,
  } = useReadContract({
    address: CONTRACT_ADDRESS, // 合同地址，暂且硬编码
    abi: crowdFundingAbi,
    functionName: "getAllCampaigns",
    args: [],
  });

  return {
    allCampaigns: allCampaigns as Campaign[] | undefined, // 类型断言
    error,
    isPending,
  };
};
/**
 * @notice 该函数用于查询合同内所有捐献信息
 * @param id 目标合同的 id
 * @returns allCampaigns 所有活动信息
 */
export const useGetDonatorsAndDonations = (id: number) => {
  const {
    data: donatorsAndDonations,
    error,
    isPending,
  } = useReadContract({
    address: CONTRACT_ADDRESS, // 合同地址，暂且硬编码
    abi: crowdFundingAbi,
    functionName: "getDonatorsAndDonations",
    args: [BigInt(id)],
  });

  return {
    donatorsAndDonations: donatorsAndDonations as DonationInfo[] | undefined, // 类型断言
    error,
    isPending,
  };
};
