// QuizQuestion.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FormConnectedBrandsSelect,
  FormConnectedMappingTechnologySelect,
  FormSelectField,
  FormTabField,
  FormTextField,
} from "../form-components";

export type QuestionType = "text" | "number" | "select" | "toggle" | "triState";

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
  const { control } = useFormContext();

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
      {helperText && <p className="text-text/90 block mt-1 text-sm">{helperText}</p>}
    </div>
  );
};
