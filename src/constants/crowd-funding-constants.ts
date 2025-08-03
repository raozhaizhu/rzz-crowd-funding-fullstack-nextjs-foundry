import { z } from "zod";
import { isAddress } from "viem";

// 基础地址验证 schema
export const addressSchema = z.string().refine((val) => isAddress(val), {
  message: "Must be a valid Ethereum address",
});

// 单个链的合约配置 schema
export const chainContractSchema = z.object({
  crowdFundingContractAddress: addressSchema,
});
// 类型定义
export type ChainContractConfig = z.infer<typeof chainContractSchema>;
export type ContractsConfig = Record<number, ChainContractConfig>;

export const chainsToContracts: ContractsConfig = {
  31337: {
    crowdFundingContractAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  },
  11155111: {
    crowdFundingContractAddress: "0x6d21ab537862a8d0302cdb1fb4cfd1f76aee3b5c",
  },
};

export const crowdFundingAbi = [
  {
    type: "function",
    name: "createCampaign",
    inputs: [
      { name: "_owner", type: "address", internalType: "address" },
      { name: "_title", type: "string", internalType: "string" },
      { name: "_description", type: "string", internalType: "string" },
      { name: "_heroImageCID", type: "string", internalType: "string" },
      { name: "_deadline", type: "uint256", internalType: "uint256" },
      {
        name: "_targetInEthWei",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "donateToCampaign",
    inputs: [{ name: "_id", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getAllCampaigns",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct CrowdFunding.Campaign[]",
        components: [
          { name: "owner", type: "address", internalType: "address" },
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "targetInEthWei",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountCollectedInEthWei",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "title", type: "string", internalType: "string" },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
          {
            name: "heroImageCID",
            type: "string",
            internalType: "string",
          },
          {
            name: "donations",
            type: "uint256[]",
            internalType: "uint256[]",
          },
          {
            name: "donators",
            type: "address[]",
            internalType: "address[]",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCampaign",
    inputs: [{ name: "_id", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct CrowdFunding.Campaign",
        components: [
          { name: "owner", type: "address", internalType: "address" },
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "targetInEthWei",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountCollectedInEthWei",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "title", type: "string", internalType: "string" },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
          {
            name: "heroImageCID",
            type: "string",
            internalType: "string",
          },
          {
            name: "donations",
            type: "uint256[]",
            internalType: "uint256[]",
          },
          {
            name: "donators",
            type: "address[]",
            internalType: "address[]",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCampaignsPaginated",
    inputs: [
      { name: "offset", type: "uint256", internalType: "uint256" },
      { name: "limit", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct CrowdFunding.Campaign[]",
        components: [
          { name: "owner", type: "address", internalType: "address" },
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "targetInEthWei",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountCollectedInEthWei",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "title", type: "string", internalType: "string" },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
          {
            name: "heroImageCID",
            type: "string",
            internalType: "string",
          },
          {
            name: "donations",
            type: "uint256[]",
            internalType: "uint256[]",
          },
          {
            name: "donators",
            type: "address[]",
            internalType: "address[]",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDonatorsAndDonations",
    inputs: [{ name: "_id", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "", type: "address[]", internalType: "address[]" },
      { name: "", type: "uint256[]", internalType: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "sIdOfCampaign",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CrowdFundingCreated",
    inputs: [
      {
        name: "idOfCampaign",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "CrowdFunding__CampaignExceededDeadLine",
    inputs: [],
  },
  {
    type: "error",
    name: "CrowdFunding__DeadlineShouldBeInFuture",
    inputs: [],
  },
  {
    type: "error",
    name: "CrowdFunding__DescriptionExceeded256Bytes",
    inputs: [],
  },
  {
    type: "error",
    name: "CrowdFunding__TitleLengthExceeded64Bytes",
    inputs: [],
  },
  { type: "error", name: "CrowdFunding__TransferFailed", inputs: [] },
  {
    type: "error",
    name: "CrowdFunding__idShouldNotBeGreaterOrEqualToMaxId",
    inputs: [],
  },
  { type: "error", name: "CrowdFunding__offsetOutOfBounds", inputs: [] },
];
