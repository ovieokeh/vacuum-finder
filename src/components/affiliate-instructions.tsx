import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { LuInfo } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa";

import { Region } from "../types";

export const AffiliateLinkInstructions = () => {
  const sites = [
    {
      name: "Amazon US",
      url: "https://amazon.com",
      region: Region.Global,
    },
    {
      name: "Amazon UK",
      url: "https://amazon.co.uk",
      region: Region.Europe,
    },
    {
      name: "Amazon DE",
      url: "https://amazon.de",
      region: Region.Europe,
    },
    {
      name: "Amazon CA",
      url: "https://amazon.ca",
      region: Region.America,
    },
    {
      name: "Amazon JP",
      url: "https://amazon.co.jp",
      region: Region.Asia,
    },
    {
      name: "Amazon AU",
      url: "https://amazon.com.au",
      region: Region.Australia,
    },
    // {
    //   name: "Amazon FR",
    //   url: "https://amazon.fr",
    //   region: Region.Europe,
    // },
    // {
    //   name: "Amazon IT",
    //   url: "https://amazon.it",
    //   region: Region.Europe,
    // },
    // {
    //   name: "Amazon ES",
    //   url: "https://amazon.es",
    //   region: Region.Europe,
    // },
  ];

  return (
    <Disclosure as="div" className="bg-background p-4 rounded-lg border border-border">
      <DisclosureButton className="flex justify-between items-center gap-2 px-2! grow w-full bg-background-alt">
        <span className="flex items-center gap-2">
          <LuInfo className="w-6 h-6" />
          Affiliate Link Instructions
        </span>
        <FaChevronDown className="w-4 h-4" />
      </DisclosureButton>

      <DisclosurePanel className="p-4 bg-background">
        <p className="mb-4">
          Visit the following sites to get your affiliate links. Make sure to use the search bar to find the product you
          want to link to.
        </p>
        {sites.map((site) => (
          <div key={site.url} className="flex gap-2">
            <div>
              <a href={site.url} target="_blank" rel="noreferrer" className="underline">
                {site.name}
              </a>
            </div>
            <div>
              <span>Region: {site.region}</span>
            </div>
          </div>
        ))}
      </DisclosurePanel>
    </Disclosure>
  );
};
