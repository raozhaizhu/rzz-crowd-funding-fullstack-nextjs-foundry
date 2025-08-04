# RZZ Crowd Funding Fullstack dApp

\[中文版本在下方 | Chinese version below ⬇️]

---

## 🌍 Overview

**Why Blockchain Crowdfunding?**

Traditional crowdfunding platforms suffer from two major problems: **trust** and **operating cost**. Centralized platforms must invest heavily in operations and security, while donors must blindly trust platform integrity.

**Blockchain solves both.**

With immutable smart contracts and transparent public ledgers, every transaction and every rule becomes **verifiable**, **open**, and **automated**. This greatly reduces the need for intermediaries, making fraud nearly impossible and operational overhead minimal.

> This makes blockchain the ideal solution for crowdfunding.

---

**RZZ Crowd Funding** is a fullstack decentralized crowdfunding application built with **Next.js**, **Tailwind CSS**, **TypeScript**, and integrated with a **Foundry-based Solidity smart contract**. It allows users to:

- Launch new crowdfunding campaigns with IPFS-hosted images
- Donate ETH to ongoing campaigns
- View campaign details, all donations, and campaign history
- Interact directly with the Ethereum Sepolia network via `wagmi` and `viem`

> **Smart contract is hosted separately**, but the frontend provides full functionality to interact with it.

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS 4, TypeScript 5
- **Web3**: `wagmi` v2 + `viem` v2, `rainbowkit`
- **Validation**: Zod
- **Forms**: React Hook Form + @hookform/resolvers
- **Data Fetching**: React Query
- **Media Hosting**: IPFS (via `pinata` & `multiformats`)

---

## 🔗 Key Features

### 🧠 Smart Contract Interactions

These hooks abstract the Web3 logic:

| Hook                         | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `useCreateCampaign`          | Create a new campaign on-chain              |
| `useDonateToCampaign`        | Donate ETH to a campaign                    |
| `useGetCampaign`             | Get a single campaign's details             |
| `useGetAllCampaigns`         | Fetch all campaigns                         |
| `useGetCampaignsPaginated`   | Paginate campaign fetching (offset/limit)   |
| `useGetDonatorsAndDonations` | Retrieve donators & donations of a campaign |
| `useGetIfCampaignDonatable`  | Check if a campaign is still open to donate |

### ✅ Client Validation Schema

The campaign creation form is strictly validated with Zod:

- Valid Ethereum address for `owner`
- Title max: 64 bytes
- Description max: 256 bytes
- Valid CID for image
- Deadline at least 3 days ahead
- Target ≥ 1 ETH

---

## 🛠️ Dev Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Lint project
```

---

## 📄 License

MIT License. See smart contract repo for on-chain details.

---

# 🌍 RZZ 众筹平台（全栈 dApp）

## 项目背景与意义

传统众筹平台一直面临两个核心问题：**信任成本高** 与 **运营成本大**。

用户必须相信平台不会舞弊，平台则需要投入大量精力保障安全、运营和资金流动。

**区块链技术可以同时解决这两者：**

- 智能合约代码公开透明，合约逻辑可验证
- 捐款记录、受益人、时间、金额全都链上可查
- 无需信任中介，自动执行逻辑，极大降低运维成本

> 因此，众筹是最适合使用区块链的真实场景之一。

---

本项目是基于 **Next.js + Tailwind + TypeScript + Foundry 合约** 的去中心化众筹应用：

- 用户可以发起新的众筹活动（含 IPFS 图像）
- 支持 ETH 捐献给指定活动
- 展示活动详情、捐献历史、全部活动
- 使用 wagmi + viem 连接以太坊 Sepolia 网络

> 智能合约托管在单独的 GitHub 项目中，本仓库专注于前端交互。

---

## ⚙️ 技术栈

- **前端框架**：Next.js 15，Tailwind CSS 4，TypeScript 5
- **Web3 连接**：wagmi v2 + viem v2，配合 rainbowkit 钱包工具
- **表单与校验**：React Hook Form + Zod
- **数据查询**：React Query
- **图片存储**：IPFS（配合 pinata 和 multiformats 库）

---

## 🔗 主要功能模块

### 🧠 合约交互封装 Hook

| Hook 名称                    | 功能说明                     |
| ---------------------------- | ---------------------------- |
| `useCreateCampaign`          | 创建新活动（发起众筹）       |
| `useDonateToCampaign`        | 向指定活动捐款               |
| `useGetCampaign`             | 查询某个活动的详细信息       |
| `useGetAllCampaigns`         | 查询所有活动信息             |
| `useGetCampaignsPaginated`   | 分页查询活动列表             |
| `useGetDonatorsAndDonations` | 查询某活动的所有捐献人及金额 |
| `useGetIfCampaignDonatable`  | 判断是否还能捐赠（死线检测） |

### ✅ 表单校验逻辑（Zod）

- 必须是合法钱包地址
- 标题最多 64 字节
- 描述最多 256 字节
- IPFS CID 格式正确
- 死线必须在当前时间 3 天后
- 募资目标最少 1 ETH（单位为 Wei）

---

## 🛠️ 开发脚本

```bash
pnpm dev        # 启动开发服务器
pnpm build      # 编译生产版本
pnpm start      # 启动生产版本服务器
pnpm lint       # 执行 ESLint 代码检查
```

---

## 📄 开源协议

本仓库遵循 MIT License。智能合约部分另有仓库，请见相关链接。
