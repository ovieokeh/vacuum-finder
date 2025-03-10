import { Locator, test } from "@playwright/test";
import { readFile, writeFile } from "fs/promises";

const mainSite = {
  name: "Amazon US",
  url: "https://www.amazon.com/s?k=robot+vacuums",
  region: "americas",
};
// const sites = [
//   {
//     name: "Amazon UK",
//     url: "https://www.amazon.co.uk/s?k=robot%20vacuums",
//     region: Region.Europe,
//   },
//   {
//     name: "Amazon DE",
//     url: "https://www.amazon.de/-/en/s?k=robot+vacuums&i=kitchen&rh=n%3A3167641%2Cp_123%3A168956%257C183681%257C213739%257C223008%257C316796%257C811979&dc&language=en&qid=1741341571&refresh=1&rnid=91049101031&ref=sr_nr_p_123_9&ds=v1%3AaJ9BAIv%2FP0eFKp64UtVFHu0Hk0CPKcWdJN%2F0Ozn%2BOiE",
//     region: Region.Europe,
//   },
//   {
//     name: "Amazon CA",
//     url: "https://www.amazon.ca/s?k=robot+vacuums&i=kitchen&rh=n%3A2206275011%2Cp_123%3A168956%257C183681%257C223008%257C240984%257C316796%257C811979&dc&qid=1741341654&rnid=119962390011&ref=sr_nr_p_123_8&ds=v1%3AvNXI4Bbj%2F20h9Oq0DWnwpBgxvBukFUJKgPgaqXo8hhI",
//     region: Region.Americas,
//   },
//   {
//     name: "Amazon JP",
//     url: "https://www.amazon.co.jp/s?k=robot+vacuums&i=kitchen&rh=n%3A3828871%2Cp_123%3A183681%257C223008%257C240984%257C316796%257C338933%257C811979&dc&language=en&ds=v1%3A58wayrCfiFMijmfOG1asSaq0z6AYIh8Ouut1zKgPbyA&qid=1741341700&rnid=23341432051&ref=sr_nr_p_123_8",
//     region: Region.Asia,
//   },
//   {
//     name: "Amazon AU",
//     url: "https://www.amazon.com.au/s?k=robot+vacuums&i=home&rh=n%3A4851975051%2Cp_123%3A168956%257C183681%257C811979&dc&qid=1741341747&rnid=23341319051&ref=sr_nr_p_123_5&ds=v1%3Ayvga6D%2B0gqsBjffyZq9jsI%2F9u2VGrgLLYywKWJbJOs8",
//     region: Region.Australia,
//   },
//   // {
//   //   name: "Amazon FR",
//   //   url: "https://amazon.fr",
//   //   region: Region.Europe,
//   // },
//   // {
//   //   name: "Amazon IT",
//   //   url: "https://amazon.it",
//   //   region: Region.Europe,
//   // },
//   // {
//   //   name: "Amazon ES",
//   //   url: "https://amazon.es",
//   //   region: Region.Europe,
//   // },
// ];

const brands = ["eufy"];

const getOutputFile = async () => {
  const previousProductDetailsString = await readFile("productDetails.json", "utf-8");
  const parsedProductDetails = previousProductDetailsString ? JSON.parse(previousProductDetailsString) : [];
  return parsedProductDetails;
};

test("amazon scraper", async ({ page }) => {
  const parsedProductDetails = await getOutputFile();

  const scrape = async () => {
    page.on("console", async (msg) => {
      const msgArgs = msg.args();
      const logValues = await Promise.all(msgArgs.map(async (arg) => await arg.jsonValue()));
      console.log(...logValues);
    });
    await page.goto(mainSite.url, { waitUntil: "load" });

    const matchingBrandLinks: Locator[] = [];

    const brandRefinementLinks = await page.locator("#brandsRefinements .a-list-item .s-navigation-item").all();
    for (const link of brandRefinementLinks) {
      if (!link) return;

      const ariaLabel = await link.getAttribute("aria-label");
      if (brands.some((brand) => ariaLabel?.toLowerCase().includes(brand))) {
        if (ariaLabel?.includes("Apply") && ariaLabel?.includes("filter")) matchingBrandLinks.push(link as Locator);
      }
    }

    const currentBrand = brands[0];

    const brandLink = matchingBrandLinks.find(async (link) => {
      const ariaLabel = await link.getAttribute("aria-label");
      return ariaLabel?.toLowerCase().includes(currentBrand);
    });
    if (!brandLink) {
      return;
    }

    await brandLink.click();
    await page.waitForURL(/s\?k=robot\+vacuums/);

    const searchResults = (await page.locator('.a-section div[data-cy="title-recipe"] .a-link-normal').all()) ?? [];
    const randomClampedCurrentIndex = Math.floor(searchResults.length * Math.random());
    const current = searchResults[randomClampedCurrentIndex];

    if (current) {
      await current.click();
      await page.waitForURL(/https:\/\/www.amazon.com/);
    }

    const productDetailsTables = await page.locator("#productDetails_detailBullets_sections1").all();
    const productDetailsTable = productDetailsTables[0].first();
    const productDetailsRows = await productDetailsTable.locator("tr").all();

    const productDetails: Record<string, string | string[]> = {};
    for (const row of productDetailsRows) {
      const [key] = await row.locator(".prodDetSectionEntry").all();
      const detailKey = await key?.innerText();

      const [value] = await row.locator(".prodDetAttrValue").all();

      if (!detailKey) continue;

      const detailValue = await value?.innerText();

      if (!detailValue) continue;

      if (parsedProductDetails.find((product) => product[detailKey.trim().toLowerCase()] === detailValue.trim())) {
        return scrape();
      }

      productDetails[detailKey.trim().toLowerCase()] = detailValue.trim();

      const extraInfo: string[] = [];
      const extraInfoRows = await page.locator("#feature-bullets .a-list-item").all();

      for (const row of extraInfoRows) {
        const text = await row.innerText();
        extraInfo.push(text);
      }

      productDetails["extraInfo"] = extraInfo;
      try {
        const joinedProductDetails = [...parsedProductDetails, productDetails];

        await writeFile("productDetails.json", JSON.stringify(joinedProductDetails, null, 2), "utf-8");
      } catch (e) {
        console.log("error", e);
      }
    }

    scrape();
  };

  await scrape();
});
