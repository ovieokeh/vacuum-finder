import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { createToast } from "vercel-toast";
import { FaChevronDown, FaPlus, FaTrash } from "react-icons/fa";
import { LuInfo, LuLoader } from "react-icons/lu";
import { Controller, Form, FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { ConfirmButton } from "./confirm-button";
import { AffiliateLinkInstructions } from "./affiliate-instructions";
import { useAddVacuum, useDeleteVacuum, useListBrands, useSearchVacuums, useUpdateVacuum } from "../database/hooks";
import {
  AffiliateLinkCreate,
  Currency,
  MappingTechnology,
  Region,
  VacuumCreate,
  VacuumWithAffiliateLink,
} from "../database/types";
import {
  CURRENCY_OPTIONS,
  FormArrayField,
  FormComboboxField,
  FormImageUploadField,
  FormSelectField,
  FormSubmitButton,
  FormTabField,
  FormTextField,
  MAPPING_TECHNOLOGY_OPTIONS,
  REGION_OPTIONS,
} from "./form-components";

interface AdminVacuumFormProps {
  vacuum?: VacuumWithAffiliateLink | null;
}

type FormValues = VacuumCreate & {
  affiliateLinks: AffiliateLinkCreate[];
};

const schema = yup.object({
  brand: yup.string().required(),
  model: yup.string().required(),
  imageUrl: yup.string().url().required(),
  mappingTechnology: yup.string<MappingTechnology>().required(),
  batteryLifeInMinutes: yup.number().required().nullable(),
  suctionPowerInPascals: yup.number().required().nullable(),
  noiseLevelInDecibels: yup.number().required().nullable(),
  dustbinCapacityInLiters: yup.number().required().nullable(),
  waterTankCapacityInLiters: yup.number().required().nullable(),
  maxObjectClearanceInMillimeters: yup.number().required().nullable(),
  hasChildLockFeature: yup.boolean().required().nullable(),
  hasMoppingFeature: yup.boolean().required().nullable(),
  hasAutoLiftMopFeature: yup.boolean().required().nullable(),
  hasSelfEmptyingFeature: yup.boolean().required().nullable(),
  hasSelfCleaningFeature: yup.boolean().required().nullable(),
  hasGoogleOrAlexaIntegrationFeature: yup.boolean().required().nullable(),
  hasZoneCleaningFeature: yup.boolean().required().nullable(),
  hasMultiFloorMappingFeature: yup.boolean().required().nullable(),
  hasVirtualWallsFeature: yup.boolean().required().nullable(),
  hasAppControlFeature: yup.boolean().required().nullable(),
  hasManualControlFeature: yup.boolean().required().nullable(),
  hasVoiceControlFeature: yup.boolean().required().nullable(),
  surfaceRecommendations: yup.array().of(yup.string().required()).nullable(),
  otherFeatures: yup.array().of(yup.string().required()).nullable(),
  affiliateLinks: yup
    .array()
    .of(
      yup
        .object({
          region: yup.string<Region>().required(),
          currency: yup.string<Currency>().required(),
          price: yup.number().required(),
          link: yup.string().url().required(),
        })
        .required()
    )
    .required(),
});

export function AdminVacuumForm({ vacuum }: AdminVacuumFormProps) {
  const navigate = useNavigate();

  const [formUrl, setFormUrl] = useState<string>("");
  const [isPopulating, setIsPopulating] = useState(false);

  const addVacuumMutation = useAddVacuum({
    onSuccess: () => {
      navigate("/admin");
    },
  });
  const updateVacuumMutation = useUpdateVacuum({
    onSuccess: () => {
      navigate("/admin");
    },
  });
  const deleteVacuumMutation = useDeleteVacuum({
    onSuccess: () => {
      navigate("/admin");
    },
  });

  const brandsQuery = useListBrands();
  const brands = useMemo(() => brandsQuery.data, [brandsQuery.data]);

  const vacuumForm = useForm<FormValues>({
    defaultValues: vacuum ?? {
      imageUrl: "https://cevxzvsqlweccdszjadm.supabase.co/storage/v1/object/public/product-images//empty.jpg",
      mappingTechnology: "laser",
      brand: "",
      model: "",
    },
    resolver: yupResolver(schema),
  });
  const { reset } = vacuumForm;

  useEffect(() => {
    if (vacuum?.id) {
      reset(vacuum);
    }
  }, [reset, vacuum]);

  const { brand, model } = useWatch({
    control: vacuumForm.control,
  });

  const affiliateLinksController = useFieldArray({
    control: vacuumForm.control,
    name: "affiliateLinks",
  });

  const searchVacuumQuery = useSearchVacuums({
    filters: {
      brand: brand as string,
      model: model as string,
    },
    enabled: !!brand && !!model,
  });

  const populateForm = async () => {
    if (!formUrl) {
      return;
    }

    setIsPopulating(true);

    try {
      const response = await fetch(`/api/enrich-amazon?link=${formUrl}`);
      const data = await response.json();

      vacuumForm.reset(data);
    } catch {
      createToast("Failed to populate form", {
        type: "error",
        timeout: 3000,
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const similarVacuums = useMemo(
    () => (brand && model ? searchVacuumQuery.data : null),
    [brand, model, searchVacuumQuery.data]
  );

  return (
    <FormProvider {...vacuumForm}>
      <Form
        className="pb-2 md:p-4 md:px-0 flex flex-col gap-10"
        onSubmit={(e) => {
          if (similarVacuums?.total && similarVacuums.total > 0 && !vacuum?.id) {
            createToast("It seems this vacuum already exists. Please check the list of similar vacuums", {
              type: "error",
              timeout: 3000,
            });
            return;
          }
          const data = e.data as FormValues;

          let toastMessage = "Vacuum added successfully";

          if (vacuum?.id) {
            updateVacuumMutation.mutateAsync({
              data: {
                ...(data as VacuumWithAffiliateLink),
                id: vacuum.id,
              },
            });
            toastMessage = "Vacuum updated successfully";
            reset(data);
          } else {
            const { affiliateLinks, ...rest } = data;
            addVacuumMutation.mutate({
              affiliateLinks,
              data: rest,
            });
          }

          createToast(toastMessage, {
            type: "success",
            timeout: 5000,
          });
        }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:gap-12">
          <div className="w-full">
            <p className="text-sm">
              Paste in the Amazon URL to a robot vacuum and populate the fields automatically. Ensure to verify data
              before saving!
            </p>
            <FormTextField name="amazonUrl" label="Amazon URL" value={formUrl} onChange={(e) => setFormUrl(e)} />
            <Button
              onClick={() => {
                populateForm();
              }}
              disabled={!formUrl || isPopulating}
              className="disabled:opacity-50 border-border! flex items-center gap-2"
            >
              Populate Form
              {isPopulating && <LuLoader className={`animate-spin ${isPopulating ? "w-6 h-6" : "hidden"}`} />}
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-12">
          <div className="md:w-1/2 flex flex-col gap-2">
            <Controller
              name="imageUrl"
              render={({ field, fieldState }) => (
                <FormImageUploadField label="Click to upload image" {...field} state={fieldState} />
              )}
              disabled={isPopulating}
            />

            <div className="flex flex-col gap-2 bg-background p-4">
              <p className="text-lg font-semibold">Affiliate Links</p>

              <AffiliateLinkInstructions />
              {affiliateLinksController.fields.map((field, index) => {
                return (
                  <div key={index} className="flex flex-col gap-1 bg-background-alt p-2 rounded-lg text-sm!">
                    <Controller
                      name={`affiliateLinks[${index}].region`}
                      render={({ field, fieldState }) => (
                        <FormSelectField label="Region" options={REGION_OPTIONS} {...field} state={fieldState} />
                      )}
                      disabled={isPopulating}
                    />

                    <Controller
                      name={`affiliateLinks[${index}].currency`}
                      render={({ field, fieldState }) => (
                        <FormSelectField
                          label="Currency"
                          options={CURRENCY_OPTIONS}
                          {...field}
                          state={fieldState}
                          labelClassName="uppercase"
                          optionClassName="uppercase"
                        />
                      )}
                      disabled={isPopulating}
                    />

                    <Controller
                      name={`affiliateLinks[${index}].price`}
                      render={({ field, fieldState }) => (
                        <FormTextField type="number" label="Price" {...field} state={fieldState} />
                      )}
                      disabled={isPopulating}
                    />

                    <Controller
                      name={`affiliateLinks[${index}].link`}
                      render={({ field, fieldState }) => <FormTextField label="URL" {...field} state={fieldState} />}
                      disabled={isPopulating}
                    />

                    <button
                      type="button"
                      className="w-fit text-red px-4 py-2 rounded-md cursor-pointer"
                      onClick={() => affiliateLinksController.remove(index)}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              <Button
                className="flex items-center gap-2 text-accent"
                onClick={() =>
                  affiliateLinksController.append({ region: "americas", currency: "usd", price: 100, link: "" })
                }
              >
                <FaPlus className="w-4 h-4" />
                Add Affiliate Link
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex flex-col gap-2">
            <Controller
              name="brand"
              render={({ field, fieldState }) => (
                <FormComboboxField label="Brand" options={brands || []} {...field} state={fieldState} />
              )}
              disabled={isPopulating}
            />

            <Controller
              name="model"
              render={({ field, fieldState }) => (
                <>
                  <FormTextField label="Model" {...field} state={fieldState} />

                  {!vacuum?.id && similarVacuums?.results?.length ? (
                    <div className="bg-background-alt p-4 rounded-lg">
                      <p className="flex gap-2 items-start">
                        <LuInfo className="w-3 h-3" />
                        <span className="text-sm pt-0 -mt-1">
                          It seems a vacuum with a similar brand and model already exists:
                        </span>
                      </p>
                      <ul>
                        {similarVacuums.results.map((vacuum: VacuumWithAffiliateLink) => (
                          <li key={vacuum.id}>
                            <Link
                              to={`/vacuums/${vacuum.id}`}
                              className="text-blue-700 dark:text-blue-300 text-sm pl-5"
                              target="_blank"
                            >
                              {vacuum.brand} {vacuum.model}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </>
              )}
              disabled={isPopulating}
            />

            <Controller
              name="mappingTechnology"
              render={({ field, fieldState }) => (
                <FormSelectField
                  label="Mapping Technology"
                  options={MAPPING_TECHNOLOGY_OPTIONS}
                  {...field}
                  state={fieldState}
                />
              )}
              disabled={isPopulating}
            />

            <Controller
              name="batteryLifeInMinutes"
              render={({ field, fieldState }) => (
                <FormTextField type="number" label="Battery Runtime (minutes)" {...field} state={fieldState} />
              )}
              disabled={isPopulating}
            />

            <Controller
              name="suctionPowerInPascals"
              render={({ field, fieldState }) => (
                <FormTextField type="number" label="Suction Power (Pa)" {...field} state={fieldState} />
              )}
              disabled={isPopulating}
            />

            <Controller
              name="noiseLevelInDecibels"
              render={({ field, fieldState }) => (
                <FormTextField type="number" label="Noise Level (dB)" {...field} state={fieldState} />
              )}
              disabled={isPopulating}
            />

            <Controller
              name="dustbinCapacityInLiters"
              render={({ field, fieldState }) => (
                <FormTextField type="number" label="Dustbin Capacity (L)" {...field} state={fieldState} />
              )}
              disabled={isPopulating}
            />

            <Controller
              name="waterTankCapacityInLiters"
              render={({ field, fieldState }) => (
                <FormTextField type="number" label="Water Tank Capacity (L)" {...field} state={fieldState} />
              )}
              disabled={isPopulating}
            />
            <Controller
              name="maxObjectClearanceInMillimeters"
              render={({ field, fieldState }) => (
                <FormTextField type="number" label="Max Object Clearance (mm)" {...field} state={fieldState} />
              )}
              disabled={isPopulating}
            />

            <div className="flex flex-col gap-2 mb-6">
              <FormArrayField
                name="surfaceRecommendations"
                label="Surface Recommendations (e.g Carpet, Hardwood)"
                disabled={isPopulating}
              />
              <FormArrayField
                name="otherFeatures"
                label="Other Features (e.g. HEPA Filter, Hot water cleaning)"
                disabled={isPopulating}
              />
            </div>

            <div className="flex gap-4 flex-wrap *:grow">
              <Controller
                name="hasChildLockFeature"
                render={({ field, fieldState }) => <FormTabField label="Child Lock" {...field} state={fieldState} />}
                disabled={isPopulating}
              />

              <Controller
                name="hasMoppingFeature"
                render={({ field, fieldState }) => (
                  <FormTabField label="Mopping Feature" {...field} state={fieldState} />
                )}
                disabled={isPopulating}
              />
              <Controller
                name="hasAutoLiftMopFeature"
                render={({ field, fieldState }) => (
                  <FormTabField label="Auto-lift Mop Feature" {...field} state={fieldState} />
                )}
                disabled={isPopulating}
              />

              <Controller
                name="hasSelfEmptyingFeature"
                render={({ field, fieldState }) => (
                  <FormTabField label="Self Emptying Feature" {...field} state={fieldState} />
                )}
                disabled={isPopulating}
              />

              <Controller
                name="hasSelfCleaningFeature"
                render={({ field, fieldState }) => (
                  <FormTabField label="Self Cleaning Feature" {...field} state={fieldState} />
                )}
                disabled={isPopulating}
              />

              <Controller
                name="hasZoneCleaningFeature"
                render={({ field, fieldState }) => (
                  <FormTabField label="Zone Cleaning Feature" {...field} state={fieldState} />
                )}
                disabled={isPopulating}
              />

              <Controller
                name="hasMultiFloorMappingFeature"
                render={({ field, fieldState }) => (
                  <FormTabField label="Multi Floor Mapping Feature" {...field} state={fieldState} />
                )}
                disabled={isPopulating}
              />

              <Controller
                name="hasVirtualWallsFeature"
                render={({ field, fieldState }) => (
                  <FormTabField label="Virtual Walls Feature" {...field} state={fieldState} />
                )}
                disabled={isPopulating}
              />

              <Controller
                name="hasAppControlFeature"
                render={({ field, fieldState }) => <FormTabField label="App Control" {...field} state={fieldState} />}
                disabled={isPopulating}
              />

              <Controller
                name="hasGoogleOrAlexaIntegrationFeature"
                render={({ field, fieldState }) => (
                  <FormTabField label="Google or Alexa Integration" {...field} state={fieldState} />
                )}
                disabled={isPopulating}
              />

              <Controller
                name="hasManualControlFeature"
                render={({ field, fieldState }) => (
                  <FormTabField label="Manual Control" {...field} state={fieldState} />
                )}
                disabled={isPopulating}
              />

              <Controller
                name="hasVoiceControlFeature"
                render={({ field, fieldState }) => <FormTabField label="Voice Control" {...field} state={fieldState} />}
                disabled={isPopulating}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Checklist />
          <div className="flex gap-2">
            {vacuum?.id ? (
              <ConfirmButton
                onClick={() => {
                  deleteVacuumMutation.mutate(vacuum.id);
                }}
                confirmText="Delete Vacuum"
              >
                Delete
              </ConfirmButton>
            ) : null}
            <FormSubmitButton disabled={isPopulating}>Save</FormSubmitButton>
          </div>
        </div>
      </Form>
    </FormProvider>
  );
}

const checklistItems = [
  "Rename the vacuum image as (brand)-(model).jpg",
  "Check that this is a new vacuum and not a duplicate",
  "Add all affiliate links you could find for the different regions",
  "Fill out all the fields to the best of your ability",
  "If you can't find a feature, leave it as Unknown or empty (if it's a number)",
];
const Checklist = () => {
  return (
    <Disclosure as="div" className="flex flex-col gap-4 max-w-lg">
      <DisclosureButton className="flex justify-between items-center gap-2 px-2! grow w-full bg-background">
        <p className="text-lg font-semibold flex items-center justify-between gap-4 grow">
          Before submitting
          <FaChevronDown className="w-4 h-4" />
        </p>
      </DisclosureButton>

      <DisclosurePanel className="p-4 bg-background">
        <ul className="list-disc list-inside">
          {checklistItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </DisclosurePanel>
    </Disclosure>
  );
};
