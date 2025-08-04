"use client";

import {
  useAccount,
  useChainId,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { CID } from "multiformats/cid";
import { crowdFundingAbi } from "@/constants/crowd-funding-constants";
import { z } from "zod";
import { isAddress, parseEther } from "viem";
import {
  GRACE_MS,
  ONE_DAY_IN_SECONDS,
  SEPOLIA_CONTRACT_ADDRESS,
} from "@/constants/global-constants";

export type Campaign = {
  owner: `0x${string}`;
  deadline: bigint;
  targetInEthWei: bigint;
  amountCollectedInEthWei: bigint;
  title: string;
  description: string;
  heroImageCID: string;
  donations: bigint[];
  donators: `0x${string}`[];
};
type DonationInfo = [donations: bigint[], donators: `0x${string}`[]];

export const createCampaignInfoSchemaClient = z.object({
  // 校验 owner 格式是否为钱包地址
  owner: z
    .string()
    .min(1, { message: "Please connect the wallet" })
    .refine((val) => isAddress(val), {
      message: "Owner must be a valid Ethereum address",
    }),

  // title必须小于 64 字节
  title: z
    .string()
    .min(1, "Title is required") // 虽然合同并没有要求标题是必要的
    .max(64, "Title must be 64 bytes or less")
    .refine((val) => new TextEncoder().encode(val).length <= 64, {
      message: "Title exceeds 64 bytes when encoded",
    }),

  // title必须小于 256 字节
  description: z
    .string()
    .min(1, "Description is required") // 虽然合同并没有要求描述是必要的
    .max(256, "Description must be 256 bytes or less")
    .refine((val) => new TextEncoder().encode(val).length <= 256, {
      message: "Description exceeds 256 bytes when encoded",
    }),

  // heroImage必须为标准 CID 格式
  heroImageCID: z.string().refine(
    (val) => {
      try {
        CID.parse(val);
        return true;
      } catch (error) {
        return false;
      }
    },
    {
      message: "Invalid IPFS CID (failed to parse)",
    }
  ),

  // deadline必须至少在 3 天后（合同本身约定是在未来即可）
  // deadline已经毫秒计
  deadline: z
    .number()
    .int()
    .min(Date.now() + 3 * ONE_DAY_IN_SECONDS + GRACE_MS, {
      message: "Deadline must be at least 3 days from now",
    }),
  // 筹集目标为整数，至少 1 eth，合同内做了灵活处理，但页面上暂且设置了 1 ether 的上限
  targetInEthWei: z.number().int().min(1, "Minimum target is 1 ETH"),
});
export type CreateCampaignInfoSchemaClient = z.infer<
  typeof createCampaignInfoSchemaClient
>;

/* -------------------------------------------------------------------------- */
/*                                   Setter                                   */
/* -------------------------------------------------------------------------- */

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
    const {
      owner,
      title,
      description,
      heroImageCID,
      deadline,
      targetInEthWei,
    } = info;

    // 检查钱包和链的状态
    if (!address) throw new Error("Wallet not connected");
    if (!chainId) throw new Error("ChainId not detected");

    try {
      writeContract({
        // address: ANVIL_CONTRACT_ADDRESS, // 本地合同地址，暂且硬编码
        address: SEPOLIA_CONTRACT_ADDRESS, // sepolia合同地址，暂且硬编码
        abi: crowdFundingAbi,
        functionName: "createCampaign",
        args: [
          owner,
          title,
          description,
          heroImageCID,
          deadline,
          parseEther(String(targetInEthWei)),
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
        address: SEPOLIA_CONTRACT_ADDRESS, // 合同地址，暂且硬编码
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
 * @notice 检查活动是否超过死线
 * @returns  未超过返回true， 否则false
 */
export const useGetIfCampaignDonatable = (id: number) => {
  const { data } = useReadContract({
    address: SEPOLIA_CONTRACT_ADDRESS, // 合同地址，暂且硬编码
    abi: crowdFundingAbi,
    functionName: "getCampaign",
    args: [BigInt(id)],
  });

  const campaign = data as Campaign | undefined;

  if (!campaign || new Date() >= new Date(Number(BigInt(campaign.deadline))))
    return false;
  return true;
};
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
    address: SEPOLIA_CONTRACT_ADDRESS, // 合同地址，暂且硬编码
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
    address: SEPOLIA_CONTRACT_ADDRESS, // 合同地址，暂且硬编码
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
    address: SEPOLIA_CONTRACT_ADDRESS, // 合同地址，暂且硬编码
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
    address: SEPOLIA_CONTRACT_ADDRESS, // 合同地址，暂且硬编码
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
