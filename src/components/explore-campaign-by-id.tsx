// ANCHOR React & library
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ANCHOR Components

// ANCHOR Types & Interfaces

// ANCHOR Constants

// ANCHOR Component definition

const ExploreCampaignById = () => {
  const [id, setId] = useState<string>("");
  const router = useRouter();

  return (
    <>
      <Input
        className='w-40 placeholder:text-white/90 text-white/90'
        placeholder='View campaign by id'
        value={id}
        onChange={(e) => {
          const val = e.target.value;
          if (/^\d*$/.test(val)) setId(val);
        }}
      />
      <Button
        type='submit'
        variant='outline'
        onClick={() => router.push(`/campaigns/${id}`)}
      >
        Explore
      </Button>
    </>
  );
};

export default ExploreCampaignById;
