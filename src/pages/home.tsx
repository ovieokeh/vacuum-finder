import { Link } from "react-router";

import { Footer } from "../components/footer";
import { PageHeader } from "../components/page-header";

const copy = {
  hero: {
    title: "Robot Vacuum Finder: Your Shortcut to a Cleaner Home",
    subtitle:
      "Tired of scrolling through endless options? Share a few details about your space, and we'll do the heavy lifting to match you with the perfect robot vacuum.",
  },
  whyThisTool: {
    heading: "Why This Tool?",
    items: [
      {
        title: "Personalized Results",
        text: "Tell us about your home layout, floor types, and whether you have pets. We’ll pinpoint vacuums that match your exact situation.",
      },
      {
        title: "Quick & Confident Decisions",
        text: "No more reading through countless reviews. Our system filters through top-rated models, so you can make a smart choice faster.",
      },
      {
        title: "Straightforward Explanations",
        text: "Wondering about suction power, battery life, or noise levels? We break down each feature in plain language, so you know exactly what you're getting.",
      },
    ],
  },
  howItWorks: {
    heading: "How It Works",
    steps: [
      {
        step: 1,
        title: "Answer a Few Questions",
        text: "Fill us in on your home size, floor types, number of rooms, and any special considerations—like pets or a preference for mopping.",
      },
      {
        step: 2,
        title: "We Analyze & Suggest",
        text: "Our tool compares popular models, assessing everything from dustbin capacity to noise levels, to create your custom shortlist.",
      },
      {
        step: 3,
        title: "Choose & Purchase",
        text: "Review the recommendations, compare their features, and pick the one you like best. You’ll have a reliable robot vacuum in no time.",
      },
    ],
  },
};

const tryLink = (
  <Link
    to="/vacuums"
    className="px-6 py-3 rounded border border-accent! text-background dark:text-black bg-accent! hover:bg-accent/50! font-semibold"
  >
    Try it Now
  </Link>
);

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        containerClassName="border-b-0"
        className="items-center text-center"
        title={copy.hero.title}
        subtitle={copy.hero.subtitle}
      >
        <div className="mt-8 flex gap-4">{tryLink}</div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">{copy.whyThisTool.heading}</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {copy.whyThisTool.items.map((item, index) => (
            <div key={index} className="p-6 border border-border rounded hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-text/90">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background-alt w-full py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">{copy.howItWorks.heading}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {copy.howItWorks.steps.map((stepData) => (
              <div key={stepData.step} className="flex flex-col items-center text-center">
                <div className="mb-4 h-14 w-14 flex items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-xl">
                  {stepData.step}
                </div>
                <h3 className="font-semibold mb-2">{stepData.title}</h3>
                <p className="text-sm text-text/90">{stepData.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">{tryLink}</div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
