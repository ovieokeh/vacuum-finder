// QuizQuestion.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import ReactMarkdown from "react-markdown";

import {
  FormConnectedBrandsSelect,
  FormConnectedMappingTechnologySelect,
  FormNumberSliderField,
  FormSelectField,
  FormTabField,
  FormTextField,
} from "../form-components";
import { QuestionType } from "./questions";
import { useSiteConfig } from "../../providers/site-config";

export interface QuizQuestionProps {
  field: string;
  question: string;
  unknownLabel?: string;
  type: QuestionType;
  options?: Array<{ label: string; value: any }>;
  helperText?: string;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  field,
  question,
  type,
  options,
  helperText,
  unknownLabel,
}) => {
  const { locale, currency } = useSiteConfig();
  const { control } = useFormContext();

  console.log({ locale });

  let inputField;
  switch (type) {
    case "text":
      inputField = (
        <Controller
          name={field}
          control={control}
          render={({ field, fieldState }) => <FormTextField {...field} type="text" state={fieldState} />}
        />
      );
      break;
    case "number":
      inputField = (
        <Controller
          name={field}
          control={control}
          render={({ field, fieldState }) => <FormTextField {...field} type="number" state={fieldState} />}
        />
      );
      break;
    case "number-slider":
      inputField = (
        <Controller
          name={field}
          control={control}
          render={({ field, fieldState }) => (
            <FormNumberSliderField
              {...field}
              state={fieldState}
              step={50}
              max={10_000}
              valueFormatter={(value) => {
                const formatted = new Intl.NumberFormat(locale, { style: "currency", currency: currency }).format(
                  value
                );
                return formatted;
              }}
            />
          )}
        />
      );
      break;
    case "select":
      inputField = (
        <Controller
          name={field}
          control={control}
          render={({ field, fieldState }) =>
            field.name === "brand" ? (
              <FormConnectedBrandsSelect {...field} state={fieldState} />
            ) : field.name === "mappingTechnology" ? (
              <FormConnectedMappingTechnologySelect {...field} state={fieldState} />
            ) : (
              <FormSelectField {...field} options={options ?? []} state={fieldState} />
            )
          }
        />
      );
      break;
    case "toggle":
      inputField = (
        <Controller
          name={field}
          control={control}
          render={({ field: formField }) => (
            <FormTabField {...formField} label={question} unknownLabel={unknownLabel || "Don't care"} />
          )}
        />
      );
      break;
    case "triState":
      inputField = (
        <Controller
          name={field}
          control={control}
          render={({ field }) => <FormTabField {...field} label={question} />}
        />
      );
      break;
    default:
      inputField = null;
  }

  return (
    <div className="quiz-question my-6">
      {type !== "toggle" && <label className="block font-medium mb-1">{question}</label>}
      {inputField}
      {helperText && (
        <div className="text-text/90 block mt-1 text-sm">
          <ReactMarkdown>{helperText}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};
