import { VacuumsFilters } from "../../types";

export type QuestionType = "text" | "number" | "number-slider" | "select" | "toggle" | "triState";

export interface QuizQuestion {
  id: string;
  field: keyof VacuumsFilters;
  question: string;
  type: QuestionType;
  options?: Array<{ label: string; value: any }>;
  helperText?: string;
}

export const conversationalQuizQuestions: QuizQuestion[] = [
  {
    id: "budget",
    field: "budget",
    question: "What's your budget for a new vacuum?",
    type: "number-slider",
    helperText: "Enter an amount in your local currency.",
  },
  {
    id: "mappingTechnology",
    field: "mappingTechnology",
    question: "How do you prefer your vacuum to navigate your home?",
    type: "select",
    options: [
      { label: "I'm not picky", value: "" },
      { label: "I want smart, precise navigation", value: "laser" },
      { label: "I prefer simple, basic navigation", value: "camera" },
      { label: "I want both", value: "laser + camera" },
    ],
    helperText: `This helps determine how well it maps your space.
- Camera is fine if your home has good lighting and few obstacles.
- Laser is more precise and works well in low light.
- A combination of both is best for large, complex spaces.
    `,
  },
  {
    id: "numPets",
    field: "numPets",
    question: "How many pets do you have?",
    type: "select",
    options: [
      { label: "None", value: 0 },
      { label: "1 or 2", value: 2 },
      { label: "3 or more", value: 3 },
    ],
    helperText: "This helps us find vacuums that handle pet hair well.",
  },
  {
    id: "hasMoppingFeature",
    field: "hasMoppingFeature",
    question: "Would you like a vacuum that can also mop your floors?",
    type: "toggle",
  },
  {
    id: "batteryLifeInMinutes",
    field: "batteryLifeInMinutes",
    question: "How important is long battery life to you?",
    type: "select",
    options: [
      { label: "Not very important", value: 30 },
      { label: "Somewhat important", value: 60 },
      { label: "Very important", value: 90 },
    ],
    helperText: "Longer battery means more cleaning time between charges.",
  },
  {
    id: "suctionPowerInPascals",
    field: "suctionPowerInPascals",
    question: "How powerful do you need the suction to be?",
    type: "select",
    options: [
      { label: "Basic cleaning", value: 1000 },
      { label: "Good for pet hair", value: 1500 },
      { label: "Deep cleaning performance", value: 2000 },
    ],
    helperText: "Higher suction helps tackle stubborn dirt and pet hair.",
  },
  {
    id: "noiseLevelInDecibels",
    field: "noiseLevelInDecibels",
    question: "Do you prefer a quieter vacuum?",
    type: "select",
    options: [
      { label: "Yes, very quiet", value: 50 },
      { label: "Somewhat quiet is fine", value: 65 },
      { label: "I don’t mind some noise", value: 80 },
    ],
    helperText: "Lower numbers indicate a quieter operation.",
  },
  {
    id: "waterTankCapacityInLiters",
    field: "waterTankCapacityInLiters",
    question: "If mopping is important, how much water capacity feels right?",
    type: "select",
    options: [
      { label: "Small (I mop often)", value: 0.5 },
      { label: "Moderate", value: 1 },
      { label: "Large (less frequent refills)", value: 1.5 },
    ],
    helperText: "This determines how much area can be mopped before refilling.",
  },
  {
    id: "dustbinCapacityInLiters",
    field: "dustbinCapacityInLiters",
    question: "How often would you prefer to empty your vacuum's dustbin?",
    type: "select",
    options: [
      { label: "I'm fine with frequent emptying", value: 0.3 },
      { label: "I prefer a balance", value: 0.5 },
      { label: "I want it to last longer", value: 1 },
    ],
    helperText: "A larger dustbin means longer intervals between emptying.",
  },
  {
    id: "hasSelfEmptyingFeature",
    field: "hasSelfEmptyingFeature",
    question: "Would you like the vacuum to empty its dustbin automatically?",
    type: "triState",
    options: [
      { label: "Don't Care", value: null },
      { label: "Yes, please", value: true },
      { label: "No, thanks", value: false },
    ],
  },
  {
    id: "hasZoneCleaningFeature",
    field: "hasZoneCleaningFeature",
    question: "Do you want the option to focus on cleaning specific areas?",
    type: "triState",
    options: [
      { label: "Don't Care", value: null },
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  {
    id: "hasMultiFloorMappingFeature",
    field: "hasMultiFloorMappingFeature",
    question: "Do you need your vacuum to remember multiple floors?",
    type: "triState",
    options: [
      { label: "Don't Care", value: null },
      { label: "Yes, for multi-level homes", value: true },
      { label: "No, a single-floor model is enough", value: false },
    ],
  },
  {
    id: "hasVirtualWallsFeature",
    field: "hasVirtualWallsFeature",
    question: "Would you like to set boundaries to keep the vacuum out of certain areas?",
    type: "triState",
    options: [
      { label: "Don't Care", value: null },
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  {
    id: "hasSmartHomeIntegrationFeature",
    field: "hasSmartHomeIntegrationFeature",
    question: "Should your vacuum connect with your smart home system?",
    type: "triState",
    options: [
      { label: "Don't Care", value: null },
      { label: "Yes, integrate it", value: true },
      { label: "No, that's not needed", value: false },
    ],
  },
  {
    id: "hasAppControlFeature",
    field: "hasAppControlFeature",
    question: "Do you prefer controlling your vacuum with a mobile app?",
    type: "triState",
    options: [
      { label: "Don't Care", value: null },
      { label: "Yes, via app", value: true },
      { label: "No, I prefer other controls", value: false },
    ],
  },
  {
    id: "hasManualControlFeature",
    field: "hasManualControlFeature",
    question: "Would you like physical controls on the vacuum as well?",
    type: "triState",
    options: [
      { label: "Don't Care", value: null },
      { label: "Yes, I want manual controls", value: true },
      { label: "No, app control is enough", value: false },
    ],
  },
];

export default conversationalQuizQuestions;
