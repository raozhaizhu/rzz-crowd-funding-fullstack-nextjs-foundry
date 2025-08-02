"use effect";
// ANCHOR React & library
import z from "zod";

// ANCHOR Components
import { AuthorCard } from "./content-card";
import { Button } from "./ui/button";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetAllCampaigns,
  useGetCampaignsPaginated,
  useDonateToCampaign,
} from "@/hooks/use-crowd-funding-contract";
import { Input } from "@/components/ui/input";
// ANCHOR Types & Interfaces
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
const donateSchema = z.object({
  id: z.number().int().min(0),
  value: z.number().min(0.001, {
    message: "The minimum number is 0.001ether",
  }),
});
type DonateSchema = z.infer<typeof donateSchema>;
// ANCHOR Constants
const OFFSET = 0;
const LIMIT = 6;
// ANCHOR Component definition
const Cards = () => {
  // ANCHOR Hooks (state, ref, effect, etc.)
  const { campaigns } = useGetCampaignsPaginated(OFFSET, LIMIT);
  const { address } = useAccount();

  const { donateToCampaign, isPending, error, txHash } = useDonateToCampaign();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const form = useForm<DonateSchema>({
    resolver: zodResolver(donateSchema),
    defaultValues: {
      id: 0,
      value: 0.001,
    },
  });

  useEffect(() => {
    if (error) toast.error(error.message);
    if (txHash && isSuccess)
      toast.success("Donation Successful!", {
        description: (
          <div className='space-y-1'>
            <p className='font-semibold text-gray-800'>
              Date:
              <span className='text-blue-600'>
                {new Date().toLocaleDateString()}
              </span>
            </p>
            <p className='font-semibold text-gray-800'>
              Tx Hash:
              <span className='text-green-600'>{txHash.slice(0, 10)}...</span>
            </p>
          </div>
        ),
        action: {
          label: "View on Etherscan",
          onClick: () => window.open(`https://etherscan.io/tx/${txHash}`),
        },
      });
  }, [error, txHash]);

  // ANCHOR Derived values (memo, callback)
  // ANCHOR Event handlers
  const handleDonateToCampaign = (data: { id: number; value: number }) => {
    if (!address) return;
    donateToCampaign(data.id, data.value);
  };
  // ANCHOR Render helpers (optional functions returning JSX)
  const cards =
    campaigns &&
    campaigns.map((campaign, index) => (
      <AuthorCard
        key={index}
        author={{
          //   name: campaign.owner,
          readTime: `Ends at:\n${new Date(
            Number(campaign.deadline)
          ).toLocaleString()}`,
        }}
        content={{
          title: campaign.title,
          description: campaign.description,
        }}
        backgroundImage={`https://ipfs.io/ipfs/${campaign.heroImageCID}`}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button size='sm'>Donation</Button>
          </DialogTrigger>

          <DialogContent className='sm:max-w-sm'>
            <DialogHeader>
              <DialogTitle>Donate Campaign</DialogTitle>
              <DialogDescription className='whitespace-pre-wrap'>
                Please make sure you are donating the correct campaign.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                className='flex flex-col gap-4'
                onSubmit={form.handleSubmit(handleDonateToCampaign)}
              >
                <FormItem className='flex flex-col'>
                  <FormLabel>Campaign Title</FormLabel>
                  <FormControl>
                    <Input
                      className='col-span-3'
                      value={campaign.title}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormField
                  control={form.control}
                  name='id'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Campaign Id</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className='col-span-3'
                          value={index}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='value'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Donation Value In Ether</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          className='col-span-3'
                          onChange={(e) => {
                            const numValue = parseFloat(e.target.value);
                            field.onChange(numValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className='mt-4'>
                  <DialogClose asChild>
                    <Button variant='outline'>Cancel</Button>
                  </DialogClose>
                  <Button
                    type='submit'
                    disabled={isPending}
                  >
                    Donate
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Link href={`/contract/${index}`}>
          <Button size='sm'>Explore</Button>
        </Link>
      </AuthorCard>
    ));

  // ANCHOR Render
  return (
    <>
      <section className='flex flex-wrap gap-4 justify-center'>{cards}</section>
    </>
  );
};
export default Cards;
