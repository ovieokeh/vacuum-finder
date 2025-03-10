import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { LuInfo } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa";

export const AffiliateLinkInstructions = () => {
  const sites = [
    {
      name: "Amazon US",
      url: "https://www.amazon.com/s?k=robot+vacuums&i=garden&rh=n:1055398,p_123:183681%257C213739%257C223008%257C240984%257C316796%257C811979&dc&ds=v1:ZlmI2tgeBVtG1F2c35hK91TettptwhgeP2roXaX9NU8",
      region: "americas",
    },
    {
      name: "Amazon UK",
      url: "https://www.amazon.co.uk/s?k=robot%20vacuums",
      region: "europe",
    },
    {
      name: "Amazon DE",
      url: "https://www.amazon.de/-/en/s?k=robot+vacuums&i=kitchen&rh=n%3A3167641%2Cp_123%3A168956%257C183681%257C213739%257C223008%257C316796%257C811979&dc&language=en&qid=1741341571&refresh=1&rnid=91049101031&ref=sr_nr_p_123_9&ds=v1%3AaJ9BAIv%2FP0eFKp64UtVFHu0Hk0CPKcWdJN%2F0Ozn%2BOiE",
      region: "europe",
    },
    {
      name: "Amazon JP",
      url: "https://www.amazon.co.jp/s?k=robot+vacuums&i=kitchen&rh=n%3A3828871%2Cp_123%3A183681%257C223008%257C240984%257C316796%257C338933%257C811979&dc&language=en&ds=v1%3A58wayrCfiFMijmfOG1asSaq0z6AYIh8Ouut1zKgPbyA&qid=1741341700&rnid=23341432051&ref=sr_nr_p_123_8",
      region: "asia",
    },
    {
      name: "Amazon AU",
      url: "https://www.amazon.com.au/s?k=robot+vacuums&i=home&rh=n%3A4851975051%2Cp_123%3A168956%257C183681%257C811979&dc&qid=1741341747&rnid=23341319051&ref=sr_nr_p_123_5&ds=v1%3Ayvga6D%2B0gqsBjffyZq9jsI%2F9u2VGrgLLYywKWJbJOs8",
      region: "australia",
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
        <p className="mb-2">
          Sstart with "Amazon US" to get a product. Once you find one, search for the same product on the other Amazon
          sites (UK, DE, CA, JP, AU). If you find the same product, add the link to the list below.
        </p>

        <p className="flex flex-col gap-2 mb-4">
          Important: Links should not contain any tracking parameters. They should be clean URLs. e.g
          <span className="block font-semibold text-xs">
            https://www.amazon.com/eufy-robot-vacuum-Replacement-Accessories/dp/B0CTTFY9TK
          </span>
          not
          <span className="block font-semibold text-xs">
            https://www.amazon.com/eufy-robot-vacuum-Replacement-Accessories/dp/B0CTTFY9TK?dib=eyJ2IjoiMSJ9.S_sx_m7R7Q2I-ZkjYJBxC3rkqZL3nv14PE-PojxrxVdCyXQDTusqs0l-lucvqhKqvX9NzBmD6CILP9Gfoz_X-WAN6o62CSjMLidUD
          </span>
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
