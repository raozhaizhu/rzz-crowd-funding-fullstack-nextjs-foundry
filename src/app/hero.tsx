// ANCHOR React & library
import { useEffect, useState } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// ANCHOR Components
import { HeroComponent } from "../components/ui/hero-with-image-text-and-two-buttons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../components/ui/calendar";
// ANCHOR Types & Interfaces
import {
  createCampaignInfoSchemaClient,
  CreateCampaignInfoSchemaClient,
  useCreateCampaign,
} from "@/hooks/use-crowd-funding-contract";
import { toast } from "sonner";

// ANCHOR Constants
const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const DEFAULT_VALUES = {
  owner: "",
  title: "",
  description: "",
  heroImageCID: "",
  deadline: Date.now() + 7 * ONE_DAY_IN_MILLISECONDS,
  targetInEthWei: 1,
};

// ANCHOR Component definition
const Hero = () => {
  return (
    <HeroComponent>
      <CreateCampaignForm />
    </HeroComponent>
  );
};
export default Hero;

// ANCHOR Component definition
const CreateCampaignForm = () => {
  // ANCHOR Hooks (state, ref, effect, etc.)
  const { address } = useAccount();
  const [open, setOpen] = useState(false);

  const { createCampaign, isPending, error, txHash } = useCreateCampaign();
  const receipt = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const form = useForm<CreateCampaignInfoSchemaClient>({
    resolver: zodResolver(createCampaignInfoSchemaClient),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (address) {
      reset({ ...DEFAULT_VALUES, owner: address });
    }
  }, [address]);

  useEffect(() => {
    if (error) {
      toast.error(`${error.message.slice(0, 128)}...`);
    }
    if (txHash && receipt.isSuccess) {
      form.reset();
      const topicHex = receipt.data?.logs?.[0]?.topics?.[1];
      const campaignId = topicHex && BigInt(topicHex).toString();

      toast.success("Creation Successful!", {
        description: (
          <div className='space-y-1'>
            <p className='font-semibold text-gray-800'>
              Campaign Id:
              <span className='text-blue-600'>{campaignId}</span>
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
  }, [error, txHash, receipt.isSuccess]);

  // useEffect(() => {
  //   // HACK It's a client console.log, it should be commented out before deployment.
  //   console.log("*** receipt:", receipt, "***");

  //   console.log("*** topics:", receipt.data?.logs[0].topics, "***");
  // }, [receipt]);

  // ANCHOR Derived values (memo, callback)
  const { reset } = form;
  // ANCHOR Event handlers
  const handleCreateCampaign = (data: CreateCampaignInfoSchemaClient) => {
    createCampaign(data);
  };

  // HACK It's a client console.log, it should be commented out before deployment.
  console.log("*** address:", address, "***");

  return (
    <Card className='p-4 w-full md:w-3/4 mx-4 md:mx-0'>
      <CardHeader className='border-b border-border p-4 [.border-b]:pb-4'>
        <CardTitle className='text-xl mb-2'>Create Campaign</CardTitle>
        <CardDescription>
          Fill in the details to set up your campaign
        </CardDescription>
      </CardHeader>
      <CardContent className='p-4'>
        <Form {...form}>
          <form
            className='flex flex-col gap-4'
            onSubmit={form.handleSubmit(handleCreateCampaign)}
          >
            <FormField
              control={form.control}
              name='owner'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Owner</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Your address'
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
              name='title'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Fill in your campaign title here...'
                      {...field}
                      className='col-span-3'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Fill in your campaign description here...'
                      {...field}
                      className='col-span-3'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='heroImageCID'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Hero Image CID</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Fill in your CID of hero image here...'
                      {...field}
                      className='col-span-3'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='deadline'
              render={({ field }) => {
                const dateValue = field.value
                  ? new Date(field.value)
                  : undefined;

                return (
                  <FormItem className='flex flex-col'>
                    <FormLabel>
                      Deadline
                      <span className='text-xs text-foreground/50 ml-1'>
                        must be 3 days later...
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Popover
                        open={open}
                        onOpenChange={setOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            id='date-picker'
                            className='w-32 justify-between font-normal'
                          >
                            {dateValue
                              ? dateValue.toLocaleDateString()
                              : "Select date"}
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className='w-auto overflow-hidden p-0'
                          align='start'
                        >
                          <Calendar
                            startMonth={new Date()}
                            endMonth={new Date(2045, 12)}
                            mode='single'
                            selected={dateValue}
                            captionLayout='dropdown'
                            onSelect={(selectedDate) => {
                              if (selectedDate) {
                                field.onChange(selectedDate.getTime());
                                setOpen(false);
                              }
                            }}
                            disabled={(date) => {
                              const minTimestamp =
                                Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 天后的时间戳（毫秒）

                              return date.getTime() < minTimestamp;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name='targetInEthWei'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Target In Ether</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Your address'
                      {...field}
                      className='col-span-3'
                      type='number'
                      onChange={(e) => {
                        const numValue = e.target.valueAsNumber;
                        field.onChange(numValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className='w-full md:w-1/2 md:mx-auto'
              type='submit'
              disabled={isPending}
            >
              {isPending ? "Now Creating..." : "Create Campaign"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
