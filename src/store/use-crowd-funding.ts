// import { create } from "zustand";
// import { crowdFundingAbi } from "@/constants/crowd-funding-constants";
// type Campaign = {
//   owner: number;
//   deadline: number;
//   targetInEther: number;
//   amountCollectedInEther: number;
//   title: string;
//   description: string;
//   donations: number[];
//   donators: number[];
// };

// type CreateCampaignInfo = Pick<
//   Campaign,
//   "owner" | "title" | "description" | "deadline" | "targetInEther"
// >;

// type DonationInfo = Pick<Campaign, "donations" | "donators">;

// type Actions = {
//   createCampaign: (info: CreateCampaignInfo) => Promise<void>;
//   donateToCampaign: (id: number) => Promise<void>;
//   // getter
//   getDonatorsAndDonations: (id: number) => Promise<DonationInfo>;
//   getCampaign: (id: number) => Promise<Campaign>;
//   getCampaignsPaginated: (offset: number, limit: number) => Promise<Campaign[]>;
//   getAllCampaigns: () => Promise<Campaign[]>;
// };

// const useCrowdFunding = create<Actions>()((set, get) => ({
//   //   createCampaign: async (info) => {
//   //     const { owner, title, description, deadline, targetInEther } = info;
//   //     try {
//   //       const transaction = await contract.createCampaign(
//   //         owner,
//   //         title,
//   //         description,
//   //         deadline,
//   //         targetInEther
//   //       );
//   //     } catch (error) {
//   //       // HACK It's a client console.log, it should be commented out before deployment.
//   //       console.log("*** error:", error, "***");
//   //     }
//   //   },
// }));

// export default useCrowdFunding;
