// ANCHOR React & library

import ContractPageComponent from "./page-component";

// ANCHOR Components

// ANCHOR Types & Interfaces
type PageProps = {
  params: { slug: string };
};
// ANCHOR Constants

// ANCHOR Component definition
const ContractPage = ({ params }: PageProps) => {
  // ANCHOR Hooks (state, ref, effect, etc.)
  const { slug } = params;

  // ANCHOR Derived values (memo, callback)

  // ANCHOR Event handlers

  // ANCHOR Render helpers (optional functions returning JSX)

  // ANCHOR Render
  return <ContractPageComponent slug={slug} />;
};
export default ContractPage;
