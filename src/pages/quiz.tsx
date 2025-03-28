import { useForm, FormProvider, useWatch } from "react-hook-form";

import { PageHeader } from "../components/page-header";
import { QuizContainer } from "../components/quiz";
import { Outlet, useNavigate } from "react-router";
import { QuizFormValues } from "../components/quiz/shared";
import { SEO } from "../components/seo";
import { initialSearchFiltersState } from "../shared-utils/vacuum-filters";
import { filtersToParamsString } from "../hooks/use-filters-params";

export function QuizPage() {
  const form = useForm<QuizFormValues>({
    defaultValues: initialSearchFiltersState,
  });

  const values = useWatch({ control: form.control });

  const navigate = useNavigate();

  const handleComplete = () => {
    const params = filtersToParamsString(values);
    navigate("/vacuums?" + params);
  };

  return (
    <>
      <SEO
        title="Quiz - Robot Vacuum Finder & Guide"
        description="Discover the perfect robot vacuum for your needs with our interactive quiz."
        image="/images/take-quiz.png"
      />
      <PageHeader
        title="Robot Vacuum Finder Quiz"
        subtitle="Find the perfect robot vacuum for your needs"
        containerClassName="border-b border-border text-center"
      />

      <div className="md:mx-auto md:max-w-[840px] px-4 py-8">
        <FormProvider {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleComplete();
            }}
          >
            <QuizContainer onComplete={handleComplete} />
          </form>
        </FormProvider>
      </div>

      <Outlet />
    </>
  );
}
