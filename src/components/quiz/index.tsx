import React, { useEffect, useState } from "react";
import { QuizQuestion } from "./question";
import { Transition } from "@headlessui/react";

import conversationalQuizQuestions from "./questions";
import { useSearchParams } from "react-router";

export interface QuizSectionProps {
  title: string;
  description: string;
  illustration?: React.ReactNode;
  children: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement | null>;
}

const QuizSection: React.FC<QuizSectionProps> = ({ title, description, illustration, children, ref }) => {
  return (
    <div className="quiz-section p-6 bg-background rounded-lg shadow" ref={ref}>
      <header className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-text/90">{description}</p>
        {illustration && <div className="mt-3">{illustration}</div>}
      </header>
      <div className="section-content">{children}</div>
    </div>
  );
};

// Extend the QuizStep interface to support per-section validation fields
export interface QuizStep extends QuizSectionProps {
  id: string;
  fields?: string[]; // List of field names to validate in this section
}

export interface QuizMultiStepProps {
  steps: QuizStep[];
  onComplete: () => void;
}

export const QuizMultiStep: React.FC<QuizMultiStepProps> = ({ steps, onComplete }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<number>(
    searchParams.get("step") ? parseInt(searchParams.get("step") as string) - 1 : 0
  );
  const [direction, setDirection] = useState(1);
  const currentSectionRef = React.useRef<HTMLDivElement>(null);
  const [currentSectionHeight, setCurrentSectionHeight] = useState<number>(0);

  const goNext = async () => {
    setDirection(1);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const goPrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    setSearchParams((prevParams) => {
      prevParams.set("step", (currentStep + 1).toString());
      return prevParams;
    });

    window.history.replaceState({}, "", `${window.location.pathname}?${searchParams.toString()}`);
  }, [searchParams, currentStep, setSearchParams]);

  useEffect(() => {
    if (currentSectionRef.current) {
      setCurrentSectionHeight(currentSectionRef.current.clientHeight);
    }
  }, [searchParams]);

  // Compute dynamic classes based on navigation direction
  const enterFromClass = direction === 1 ? "translate-x-full" : "-translate-x-full";
  const leaveToClass = direction === 1 ? "-translate-x-full" : "translate-x-full";

  return (
    <div
      className="relative"
      style={{
        minHeight: `calc(${currentSectionHeight}px + 2rem)`,
      }}
    >
      {steps.map((step, index) => (
        <Transition
          key={step.id}
          show={index === currentStep}
          unmount={true}
          enter="transition-all duration-500"
          enterFrom={`opacity-0 transform ${enterFromClass}`}
          enterTo="opacity-100 transform translate-x-0"
          leave="transition-all duration-500"
          leaveFrom="opacity-100 transform translate-x-0"
          leaveTo={`opacity-0 transform ${leaveToClass}`}
        >
          {/* Position each step absolutely so they overlap */}
          <div className="absolute top-0 inset-0">
            <QuizSection
              title={step.title}
              description={step.description}
              illustration={step.illustration}
              ref={currentSectionRef}
            >
              {step.children}
            </QuizSection>
          </div>
        </Transition>
      ))}
      <div className="fixed left-0 md:left-auto bottom-0 w-full md:w-[800px] flex items-center justify-between bg-background-alt p-4 rounded-md shadow">
        {currentStep > 0 ? (
          <>
            <button type="button" onClick={goPrevious} className="px-4 py-2 rounded bg-gray-200 text-gray-800">
              Previous
            </button>

            <button type="button" onClick={onComplete} className="text-text underline">
              Skip to Results
            </button>
          </>
        ) : (
          <div />
        )}
        <button type="button" onClick={goNext} className="px-4 py-2 rounded bg-blue-600 text-white">
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

const stepOneQuestionsFields = ["budget", "mappingTechnology", "hasMoppingFeature"];
const stepTwoQuestionsFields = ["batteryLifeInMinutes", "suctionPowerInPascals", "noiseLevelInDecibels"];
const stepThreeQuestionsFields = ["waterTankCapacityInLiters", "dustbinCapacityInLiters"];
const stepFourQuestionsFields = [
  "hasSelfEmptyingFeature",
  "hasZoneCleaningFeature",
  "hasMultiFloorMappingFeature",
  "hasVirtualWallsFeature",
  "hasGoogleOrAlexaIntegrationFeatureIntegrationFeature",
  "hasAppControlFeature",
  "hasManualControlFeature",
];

const stepOneQuestions = conversationalQuizQuestions.filter((q) => stepOneQuestionsFields.includes(q.field));
const stepTwoQuestions = conversationalQuizQuestions.filter((q) => stepTwoQuestionsFields.includes(q.field));
const stepThreeQuestions = conversationalQuizQuestions.filter((q) => stepThreeQuestionsFields.includes(q.field));
const stepFourQuestions = conversationalQuizQuestions.filter((q) => stepFourQuestionsFields.includes(q.field));

interface QuizContainerProps {
  onComplete: () => void;
}
export const QuizContainer = ({ onComplete }: QuizContainerProps) => {
  const quizSteps: QuizStep[] = [
    {
      id: "stepOne",
      title: "Step 1: Basics",
      description: "Tell us about your vacuum preferences.",
      fields: stepOneQuestionsFields,
      children: stepOneQuestions.map((question) => <QuizQuestion key={question.field} {...question} />),
    },
    {
      id: "stepTwo",
      title: "Step 2: Performance",
      description: "How do you want your vacuum to perform?",
      fields: stepTwoQuestionsFields,
      children: stepTwoQuestions.map((question) => <QuizQuestion key={question.field} {...question} />),
    },
    {
      id: "stepThree",
      title: "Step 3: Capacity",
      description: "Choose the right capacity for your needs.",
      fields: stepThreeQuestionsFields,
      children: stepThreeQuestions.map((question) => <QuizQuestion key={question.field} {...question} />),
    },
    {
      id: "stepFour",
      title: "Step 4: Features",
      description: "Select the features you need.",
      fields: stepFourQuestionsFields,
      children: stepFourQuestions.map((question) => <QuizQuestion key={question.field} {...question} />),
    },
  ];

  return <QuizMultiStep steps={quizSteps} onComplete={onComplete} />;
};
