import * as yup from "yup";
import { MappingTechnology } from "../../database";

export const quizSchema = yup.object().shape({
  brand: yup.string().optional(),
  budget: yup.number().required("Budget is required"),
  numPets: yup.number().min(0, "Invalid number of pets"),
  model: yup.string().required(),
  imageUrl: yup.string().url().required(),
  mappingTechnology: yup.string<MappingTechnology>().required(),
  batteryLifeInMinutes: yup.number().required().nullable(),
  suctionPowerInPascals: yup.number().required().nullable(),
  noiseLevelInDecibels: yup.number().required().nullable(),
  dustbinCapacityInLiters: yup.number().required().nullable(),
  waterTankCapacityInLiters: yup.number().required().nullable(),
  hasChildLockFeature: yup.boolean().required().nullable(),
  hasMoppingFeature: yup.boolean().required().nullable(),
  hasSelfEmptyingFeature: yup.boolean().required().nullable(),
  hasZoneCleaningFeature: yup.boolean().required().nullable(),
  hasMultiFloorMappingFeature: yup.boolean().required().nullable(),
  hasVirtualWallsFeature: yup.boolean().required().nullable(),
  hasAppControlFeature: yup.boolean().required().nullable(),
  hasSmartHomeIntegrationFeature: yup.boolean().required().nullable(),
  hasManualControlFeature: yup.boolean().required().nullable(),
  hasVoiceControlFeature: yup.boolean().required().nullable(),
});

export type QuizFormValues = yup.InferType<typeof quizSchema>;
