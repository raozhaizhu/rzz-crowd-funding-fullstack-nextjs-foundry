// ANCHOR React & library
import ContractPageComponent from "./page-component";

// ANCHOR Components

// ANCHOR Types & Interfaces

// ANCHOR Constants

// ANCHOR Component definition
const ContractPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  // ANCHOR Hooks (state, ref, effect, etc.)

  // ANCHOR Derived values (memo, callback)
  const slug = (await params).slug;
  // ANCHOR Event handlers

  // ANCHOR Render helpers (optional functions returning JSX)

  // ANCHOR Render
  return <ContractPageComponent slug={slug} />;
};
export default ContractPage;
