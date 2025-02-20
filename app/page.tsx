import { unstable_cache } from "next/cache";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const data = await fetchData(searchParams?.key as string);

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

interface IpData {
  as: string;
  city: string;
  country: string;
  countryCode: string;
  isp: string;
  lat: number;
  lon: number;
  org: string;
  query: string;
  region: string;
  regionName: string;
  status: string;
  timezone: string;
  zip: string;
}

interface Data extends IpData {
  utcTime: string;
  key: string;
}

// fetchData will go fetch some actual data from an API, but in theory it
// should do it only once per provided key.
//
// In practice the callback (fcb) will be invoked multiple times for the same
// key, when additional non english characters are present in completely unrelated
// query parameters.
async function fetchData(key: string): Promise<Data> {
  const fcb = async () => {
    const res = await fetch("http://ip-api.com/json/", { cache: "no-cache" });
    const data = await res.json();
    return {
      ...data,
      utcTime: new Date().toUTCString(),
      key,
    };
  };

  const uc = unstable_cache(fcb, [key], {});
  return uc();
}
