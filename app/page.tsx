import { UtilityHub } from "./utility-hub";

type SearchParams = Promise<{ app?: string | string[] }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const parameters = await searchParams;
  const requestedApp = Array.isArray(parameters.app) ? parameters.app[0] : parameters.app;

  return <UtilityHub requestedApp={requestedApp} />;
}
