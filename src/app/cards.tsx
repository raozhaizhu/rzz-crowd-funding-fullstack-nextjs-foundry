"use effect";
// ANCHOR React & library
import z from "zod";
// ANCHOR Components
import { AuthorCard } from "../components/content-card";
import { Button } from "../components/ui/button";
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
  useGetIfCampaignDonatable,
  useGetCampaignsPaginated,
  useDonateToCampaign,
  Campaign,
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
} from "../components/ui/form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { gatewayDomain } from "@/constants/global-constants";
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
  const { campaigns, isPending, error } = useGetCampaignsPaginated(
    OFFSET,
    LIMIT
  );
  // ANCHOR Render helpers (optional functions returning JSX)
  if (isPending || !campaigns || !campaigns[0].heroImageCID || error)
    return <div>Loading...</div>;

  // ANCHOR Render
  return (
    <section className='mx-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {campaigns.map((campaign, index) => (
        <CustomCard
          key={index}
          campaign={campaign}
          index={index}
        />
      ))}
    </section>
  );
};
export default Cards;

const CustomCard = ({
  campaign,
  index,
}: {
  campaign: Campaign;
  index: number;
}) => {
  const { address } = useAccount();
  const { donateToCampaign, isPending, error, txHash } = useDonateToCampaign();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const [open, setOpen] = useState<boolean>(false);
  const donatable = useGetIfCampaignDonatable(index + OFFSET);

  const form = useForm<DonateSchema>({
    resolver: zodResolver(donateSchema),
    defaultValues: {
      id: 0,
      value: 0.001,
    },
  });
  useEffect(() => {
    if (error) toast.error(error.message);
    if (txHash) setOpen(false);
    if (txHash && isSuccess) {
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
          onClick: () =>
            window.open(`https://sepolia.etherscan.io/tx/${txHash}`),
        },
      });
    }
  }, [error, txHash, isSuccess]);
  // ANCHOR Derived values (memo, callback)
  const id = index + OFFSET;
  // ANCHOR Event handlers
  const handleDonateToCampaign = (data: { id: number; value: number }) => {
    if (!donatable) toast.error("Can't donate this campaign, it's ended.");
    if (address && donatable) donateToCampaign(data.id, data.value);
  };

  return (
    <AuthorCard
      key={id}
      author={{
        readTime: `Ends at:\n${new Date(
          Number(campaign.deadline)
        ).toLocaleString()}`,
      }}
      content={{
        title: campaign.title,
        description: campaign.description,
      }}
      backgroundImage={`https://${gatewayDomain}/ipfs/${campaign.heroImageCID}`}
    >
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (isOpen) {
            form.setValue("id", id);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            size='sm'
            variant='secondary'
            className='w-20'
          >
            Donate
          </Button>
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
      <Link href={`/campaigns/${id}`}>
        <Button
          size='sm'
          variant='secondary'
          className='w-20'
        >
          Explore
        </Button>
      </Link>
    </AuthorCard>
  );
};
