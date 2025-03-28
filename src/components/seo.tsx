import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}
export const SEO = (props: SEOProps) => {
  const title = props.title || "Vacuum Finder";
  const description =
    props.description ||
    "Find the best robot vacuum for your needs with our vacuum finder tool. Compare robot vacuums by features, price, and more";
  const image = props.image || "/images/refine-search-demo.png";
  const url = props.url || "https://vacuum-finder.com";

  return (
    <Helmet>
      <title data-react-helmet="true">{title}</title>
      <meta name="description" content={description} data-react-helmet="true" />
      <meta name="image" content={image} data-react-helmet="true" />
      <meta property="og:url" content={url} data-react-helmet="true" />
      <meta property="og:type" content="website" data-react-helmet="true" />
      <meta property="og:title" content={title} data-react-helmet="true" />
      <meta property="og:description" content={description} data-react-helmet="true" />
      <meta property="og:image" content={image} data-react-helmet="true" />
      <meta name="twitter:card" content="summary_large_image" data-react-helmet="true" />
      <meta name="twitter:title" content={title} data-react-helmet="true" />
      <meta name="twitter:description" content={description} data-react-helmet="true" />
      <meta name="twitter:image" content={image} data-react-helmet="true" />
    </Helmet>
  );
};
