import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { LuInfo } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa";

import { Region } from "../types";

export const AffiliateLinkInstructions = () => {
  const sites = [
    {
      name: "Amazon US",
      url: "https://www.amazon.com/s?k=robot+vacuums&i=garden&rh=n:1055398,p_123:183681%257C213739%257C223008%257C240984%257C316796%257C811979&dc&ds=v1:ZlmI2tgeBVtG1F2c35hK91TettptwhgeP2roXaX9NU8",
      region: Region.Global,
    },
    {
      name: "Amazon UK",
      url: "https://www.amazon.co.uk/s?k=robot%20vacuums",
      region: Region.Europe,
    },
    {
      name: "Amazon DE",
      url: "https://www.amazon.de/-/en/s?k=robot+vacuums&i=kitchen&rh=n%3A3167641%2Cp_123%3A168956%257C183681%257C213739%257C223008%257C316796%257C811979&dc&language=en&qid=1741341571&refresh=1&rnid=91049101031&ref=sr_nr_p_123_9&ds=v1%3AaJ9BAIv%2FP0eFKp64UtVFHu0Hk0CPKcWdJN%2F0Ozn%2BOiE",
      region: Region.Europe,
    },
    {
      name: "Amazon CA",
      url: "https://www.amazon.ca/s?k=robot+vacuums&i=kitchen&rh=n%3A2206275011%2Cp_123%3A168956%257C183681%257C223008%257C240984%257C316796%257C811979&dc&qid=1741341654&rnid=119962390011&ref=sr_nr_p_123_8&ds=v1%3AvNXI4Bbj%2F20h9Oq0DWnwpBgxvBukFUJKgPgaqXo8hhI",
      region: Region.America,
    },
    {
      name: "Amazon JP",
      url: "https://www.amazon.co.jp/s?k=robot+vacuums&i=kitchen&rh=n%3A3828871%2Cp_123%3A183681%257C223008%257C240984%257C316796%257C338933%257C811979&dc&language=en&ds=v1%3A58wayrCfiFMijmfOG1asSaq0z6AYIh8Ouut1zKgPbyA&qid=1741341700&rnid=23341432051&ref=sr_nr_p_123_8",
      region: Region.Asia,
    },
    {
      name: "Amazon AU",
      url: "https://www.amazon.com.au/s?k=robot+vacuums&i=home&rh=n%3A4851975051%2Cp_123%3A168956%257C183681%257C811979&dc&qid=1741341747&rnid=23341319051&ref=sr_nr_p_123_5&ds=v1%3Ayvga6D%2B0gqsBjffyZq9jsI%2F9u2VGrgLLYywKWJbJOs8",
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
          Visit the following sites to get your affiliate links. Make sure to only use the links from the region you are
          targeting.
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
