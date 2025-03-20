import { Link } from "react-router";
import { Footer } from "../components/footer";
import { PageHeader } from "../components/page-header";
import { FaRobot, FaQuestionCircle, FaMagic, FaCheckCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const copy = {
  hero: {
    title: "Robot Vacuum Finder: Your Shortcut to a Cleaner Home",
    subtitle:
      "Ditch the endless scrolling and cryptic specs. Share a bit about your space, and we'll find your perfect robot vacuum match—effortlessly.",
  },
  whyThisTool: {
    heading: "Why Thousands Trust Our Tool",
    items: [
      {
        icon: <FaQuestionCircle size={32} className="text-accent" />,
        title: "Complex Tech, Simplified",
        text: (
          <>
            Confused about LiDAR sensors, suction power (seriously, what's a Pascal?), or battery cycles? We make it
            clear and simple. Need more help? Visit our{" "}
            <Link to="/guide" className="underline font-medium hover:text-accent">
              full guide
            </Link>
            .
          </>
        ),
      },
      {
        icon: <FaMagic size={32} className="text-accent" />,
        title: "Made Just For You",
        text: "From pet hair jungles to tricky floor layouts, our recommendations fit your exact needs. No guesswork, just great matches.",
      },
      {
        icon: <FaRobot size={32} className="text-accent" />,
        title: "Data You Can Trust",
        text: "Our picks come from carefully vetted, staff-verified data-saving you from having to sift through hundreds of confusing options.",
      },
    ],
  },
  howItWorks: {
    heading: "Getting Your Robot Vacuum in 3 Easy Steps",
    steps: [
      {
        step: 1,
        title: "Tell us about your space",
        text: "Give us the quick facts about your floors, pets, and cleaning style. Sit back—we got you.",
        imageUrl: "take-quiz.png",
      },
      {
        step: 2,
        title: "Our Magic Happens",
        text: "We instantly analyze your answers against our verified database of robot vacuums to create your perfect shortlist.",
        imageUrl: "refine-search-demo.png",
      },
      {
        step: 3,
        title: "Pick & Celebrate",
        text: "Check out your personalized recommendations, choose your winner, and say hello to effortless cleaning.",
        imageUrl: "view-product-demo.png",
      },
    ],
  },
};

const tryLink = (
  <Link
    to="/quiz"
    className="px-6 py-3 rounded border border-accent! text-background dark:text-black bg-accent! hover:bg-accent/50! font-semibold flex items-center gap-2"
  >
    Take a short skippable quiz <IoIosArrowForward />
  </Link>
);

export const HomePage = () => {
  return (
    <>
      <PageHeader
        containerClassName="border-b-0"
        className="items-center text-center"
        title={copy.hero.title}
        subtitle={copy.hero.subtitle}
      >
        <div className="mt-8 flex justify-center gap-4">{tryLink}</div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">{copy.whyThisTool.heading}</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {copy.whyThisTool.items.map((item, index) => (
            <div key={index} className="p-6 border border-border rounded hover:shadow-lg transition-shadow text-center">
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-text/90">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background-alt w-full py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">{copy.howItWorks.heading}</h2>
          <div className="flex flex-col gap-8 md:gap-28">
            {copy.howItWorks.steps.map((stepData) => (
              <div key={stepData.step} className="flex flex-col items-center text-center gap-4">
                <div className="mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-accent text-background font-bold text-xl">
                  {stepData.step}
                </div>
                <img src={`/images/${stepData.imageUrl}`} alt="" className="w-full h-[300px] object-contain" />

                <div className="flex flex-col items-center">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FaCheckCircle className="text-accent" /> {stepData.title}
                  </h3>
                  <p className="text-sm text-text/90 text-center">{stepData.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">{tryLink}</div>
        </div>
      </section>

      <Footer />
    </>
  );
};
