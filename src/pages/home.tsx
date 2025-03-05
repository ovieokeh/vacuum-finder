import { Link } from "react-router-dom";

import { Footer } from "../components/footer";
import { PageHeader } from "../components/page-header";

const tryLink = (
  <Link
    to="/vacuum-search"
    className="px-6 py-3 rounded border border-accent! text-white! bg-accent! hover:bg-accent/50!"
  >
    Try it Now
  </Link>
);

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero / Top Section */}
      <PageHeader
        className="items-center text-center"
        title="Vacuum Finder"
        subtitle="Find your perfect vacuum in seconds. Let us compare top models based on your needs and deliver the best match for your home."
      >
        <div className="mt-8 flex gap-4">{tryLink}</div>
      </PageHeader>

      {/* Why It's Useful */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Why Vacuum Finder?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-6 border border-border rounded hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Personalized Results</h3>
            <p className="text-sm text-text/90">
              Answer a few quick questions to get tailored suggestions that fit your exact home layout and cleaning
              style.
            </p>
          </div>
          <div className="p-6 border border-border rounded hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Save Time & Money</h3>
            <p className="text-sm text-text/90">
              No more endless comparisons – we quickly narrow down a shortlist so you can decide faster and with
              confidence.
            </p>
          </div>
          <div className="p-6 border border-border rounded hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Clear Explanations</h3>
            <p className="text-sm text-text/90">
              Each recommendation includes a simple breakdown of specs and features so you know exactly what you're
              getting.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-background-alt w-full py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">How to Use</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-14 w-14 flex items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold mb-2">Tell Us About Your Home</h3>
              <p className="text-sm text-text/90">
                Pick your floor types, number of rooms, whether you have pets, etc.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-14 w-14 flex items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold mb-2">We Compare & Suggest</h3>
              <p className="text-sm text-text/90">Our tool sifts through top models and shortlists the best fits.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-14 w-14 flex items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold mb-2">Pick & Purchase</h3>
              <p className="text-sm text-text/90">
                View detailed explanations, compare prices, and buy with confidence.
              </p>
            </div>
          </div>
          <div className="mt-8 flex justify-center">{tryLink}</div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
