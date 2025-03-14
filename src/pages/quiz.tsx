import { Helmet } from "react-helmet";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { PageHeader } from "../components/page-header";
import { QuizContainer } from "../components/quiz";
import { Outlet, useNavigate } from "react-router";
import { QuizFormValues, quizSchema } from "../components/quiz/shared";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux";
import { replaceState } from "../redux/vacuum-filters-reducer";
import { markAllValuesAsDefined } from "../shared-utils/object";

export function QuizPage() {
  const vacuumFilters = useAppSelector((state) => state.vacuumsFilters);
  const form = useForm<QuizFormValues>({
    resolver: yupResolver(quizSchema),
    defaultValues: vacuumFilters,
  });

  const values = useWatch({ control: form.control });
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(replaceState({ value: markAllValuesAsDefined(values) }));
  }, [values, dispatch]);

  const handleComplete = () => {
    navigate("/vacuums");
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Quiz - Robot Vacuum Finder & Guide</title>
        <meta
          name="description"
          content="Discover the perfect robot vacuum for your needs with our interactive quiz."
        />
      </Helmet>
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
