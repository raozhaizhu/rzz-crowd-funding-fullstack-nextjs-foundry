// ANCHOR React & library
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// ANCHOR Components
import { HeroComponent } from "./ui/hero-with-image-text-and-two-buttons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
// ANCHOR Types & Interfaces
import {
  createCampaignInfoSchemaClient,
  CreateCampaignInfoSchemaClient,
  useCreateCampaign,
} from "@/hooks/use-crowd-funding-contract";
// ANCHOR Constants
const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const DEFAULT_VALUES = {
  owner: "0x1",
  title: "",
  description: "",
  deadline: Date.now() + 7 * ONE_DAY_IN_MILLISECONDS,
  targetInEther: 1,
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
  const form = useForm<CreateCampaignInfoSchemaClient>({
    resolver: zodResolver(createCampaignInfoSchemaClient),
    defaultValues: DEFAULT_VALUES,
  });
  useEffect(() => {
    if (address) {
      reset({ ...DEFAULT_VALUES, owner: address });
    }
  }, [address]);
  // ANCHOR Derived values (memo, callback)
  const { reset } = form;
  // ANCHOR Event handlers
  const handleCreateCampaign = (data: CreateCampaignInfoSchemaClient) => {
    if (!address) return;

    createCampaign(data);
  };

  return (
    <Card className='p-0 md:w-3/4 shadow-none border-none'>
      <CardHeader className='border-b border-border p-4 [.border-b]:pb-4'>
        <CardTitle className='text-xl mb-2'>Create Campaign</CardTitle>
        <CardDescription>
          Enter your information to create the campaign
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
                      placeholder='Enter your campaign title here...'
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
                      placeholder='Enter your campaign description here...'
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
              name='targetInEther'
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
            <CardFooter className='p-4 border-t border-border [.border-t]:pt-4'>
              <Button
                className='w-full'
                type='submit'
                disabled={isPending}
              >
                {isPending ? "Now Creating..." : "Create Campaign"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
