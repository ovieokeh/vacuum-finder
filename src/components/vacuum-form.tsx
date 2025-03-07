import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSiteConfig } from "../providers/site-config";
import {
  useAddVacuumMutation,
  useDeleteVacuumMutation,
  useSearchVacuumsQuery,
  useUpdateVacuumMutation,
  useVacuumBrandsQuery,
} from "../database/hooks";
import { useAppForm } from "./form";
import { AffiliateLinkBase, Currency, Region, Vacuum, VacuumBase, VacuumMappingTechnology } from "../types";
import { ConfirmButton } from "./confirm-button";
import { FaChevronDown, FaMinus, FaTrash } from "react-icons/fa";
import { AffiliateLinkInstructions } from "./affiliate-instructions";
import { useStore } from "@tanstack/react-form";
import { LuInfo } from "react-icons/lu";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";

interface AdminVacuumFormProps {
  vacuum?: Vacuum;
}

const extractDirtyFields = (original: VacuumBase, updated: VacuumBase) => {
  const dirtyFields: Record<string, any> = {};

  for (const key in updated) {
    const originalValue = original[key as keyof VacuumBase];
    const updatedValue = updated[key as keyof VacuumBase];

    if (originalValue.toString().toLowerCase() !== updatedValue.toString().toLowerCase()) {
      dirtyFields[key] = updatedValue;
    }
  }

  return dirtyFields;
};
export function AdminVacuumForm({ vacuum }: AdminVacuumFormProps) {
  const navigate = useNavigate();

  const { userToken } = useSiteConfig();
  const addVacuumMutation = useAddVacuumMutation({
    onSuccess: () => {
      navigate("/admin");
    },
  });
  const updateVacuumMutation = useUpdateVacuumMutation({
    onSuccess: () => {
      navigate("/admin");
    },
  });
  const deleteVacuumMutation = useDeleteVacuumMutation({
    onSuccess: () => {
      navigate("/admin");
    },
  });

  const brandsQuery = useVacuumBrandsQuery();

  const form = useAppForm({
    defaultValues: {
      imageUrl: "https://cevxzvsqlweccdszjadm.supabase.co/storage/v1/object/public/product-images//empty.jpg",
      brand: "",
      model: "",
      mappingTechnology: VacuumMappingTechnology.Laser,
      batteryLifeInMinutes: 180,
      suctionPowerInPascals: 3000,
      noiseLevelInDecibels: 60,
      waterTankCapacityInLiters: 1,
      dustbinCapacityInLiters: 2,
      hasMoppingFeature: true,
      hasSelfEmptyingFeature: true,
      hasZoneCleaningFeature: true,
      hasMultiFloorMappingFeature: true,
      hasCarpetBoostFeature: true,
      hasVirtualWallsFeature: true,
      hasSmartHomeIntegration: true,
      hasVoiceControl: true,
      hasAppControl: true,
      hasRemoteControl: true,
      hasManualControl: true,
      otherFeatures: [],
      affiliateLinks: [] as Partial<AffiliateLinkBase>[],
      ...((vacuum as Partial<VacuumBase>) || {}),
    },
    validators: {
      onSubmit: ({ value, ...rest }) => {
        console.log("rest", rest);
        // validate all fields

        const entries = Object.entries(value);

        for (const [key, value] of entries) {
          switch (key) {
            case "brand": {
              if (!value) {
                return {
                  key,
                  error: "Brand is required",
                };
              }
              break;
            }

            case "model": {
              if (!value) {
                return {
                  key,
                  error: "Model is required",
                };
              }

              const existingVacuum = searchVacuumQuery.data?.data.find(
                (vacuum) => vacuum.brand === form.getFieldValue("brand") && vacuum.model === value
              );

              if (existingVacuum && !vacuum?.id) {
                return {
                  key,
                  error: "Vacuum with this brand and model already exists",
                };
              }
              break;
            }

            case "mappingTechnology": {
              if (!Object.values(VacuumMappingTechnology).includes(value as VacuumMappingTechnology)) {
                return {
                  key,
                  error: "Invalid mapping technology",
                };
              }
              break;
            }

            case "batteryLifeInMinutes": {
              const parsedValue = parseFloat(value.toString());
              if (isNaN(parsedValue) || parsedValue < 1) {
                return {
                  key,
                  error: "Invalid battery life",
                };
              }
              break;
            }

            case "suctionPowerInPascals": {
              const parsedValue = parseFloat(value.toString());
              if (isNaN(parsedValue) || parsedValue < 1) {
                return {
                  key,
                  error: "Invalid suction power",
                };
              }
              break;
            }

            case "noiseLevelInDecibels": {
              const parsedValue = parseFloat(value.toString());
              if (isNaN(parsedValue) || parsedValue < 1) {
                return {
                  key,
                  error: "Invalid noise level",
                };
              }
              break;
            }

            case "waterTankCapacityInLiters": {
              const parsedValue = parseFloat(value.toString());
              if (isNaN(parsedValue) || parsedValue < 0) {
                return {
                  key,
                  error: "Invalid water tank capacity",
                };
              }
              break;
            }

            case "dustbinCapacityInLiters": {
              const parsedValue = parseFloat(value.toString());
              if (isNaN(parsedValue) || parsedValue < 0) {
                return {
                  key,
                  error: "Invalid dustbin capacity",
                };
              }
              break;
            }

            case "otherFeatures": {
              if ((value as string[]).some((feature) => !feature)) {
                return {
                  key,
                  error: "Invalid feature",
                };
              }
              break;
            }

            case "affiliateLinks": {
              const parsedValue = value as Partial<AffiliateLinkBase>[];
              if (parsedValue.some((link) => !link.url)) {
                return {
                  key,
                  error: "Invalid URL",
                };
              }
              if (parsedValue.some((link) => !link.site)) {
                return {
                  key,
                  error: "Invalid site",
                };
              }
              if (parsedValue.some((link) => !link.region)) {
                return {
                  key,
                  error: "Invalid region",
                };
              }
              if (parsedValue.some((link) => !link.currency)) {
                return {
                  key,
                  error: "Invalid currency",
                };
              }
              if (parsedValue.some((link) => !link.price)) {
                return {
                  key,
                  error: "Invalid price",
                };
              }
              break;
            }

            default:
              break;
          }
        }

        return null;
      },
    },
    onSubmit: ({ value }) => {
      if (vacuum?.id) {
        const dirtyFields = extractDirtyFields(vacuum, value as VacuumBase);
        updateVacuumMutation.mutate({
          id: vacuum.id,
          data: dirtyFields as Partial<VacuumBase>,
          userToken,
        });
      } else {
        addVacuumMutation.mutate({
          ...(value as VacuumBase),
          userToken,
        });
      }
    },
  });

  const { reset, handleSubmit } = form;

  useEffect(() => {
    if (vacuum?.id) {
      const { ...rest } = vacuum;
      const affiliateLinks = rest.affiliateLinks || [];
      reset({
        ...vacuum,
        affiliateLinks: affiliateLinks.map((link) => link),
      });
    }
  }, [reset, vacuum]);

  const brand = useStore(form.store, (state) => state.values.brand);
  const model = useStore(form.store, (state) => state.values.model);

  const searchVacuumQuery = useSearchVacuumsQuery({
    brand,
    model,
  });
  const similarVacuums = useMemo(
    () => (brand && model ? searchVacuumQuery.data : null),
    [brand, model, searchVacuumQuery.data]
  );

  return (
    <form
      className="pb-2 md:p-4 md:px-0 flex flex-col gap-10"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();

        const formErrors = form.getAllErrors();
        if (Object.keys(formErrors).length > 0) {
          console.error("Form errors:", formErrors);
        }
      }}
    >
      <form.AppForm>
        <div className="flex flex-col md:flex-row gap-4 md:gap-12">
          <div className="md:w-1/2 flex flex-col gap-2">
            <form.AppField
              name="imageUrl"
              children={(field) => (
                <field.FormImageUploadField
                  label="Click to upload image"
                  value={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <form.AppField name="affiliateLinks" mode="array">
              {(field) => {
                return (
                  <div className="flex flex-col gap-2 bg-background p-4">
                    <div className="text-lg font-semibold">Affiliate Links</div>

                    <AffiliateLinkInstructions />

                    {field.state.value.map((_link, index) => {
                      return (
                        <div key={index} className="flex flex-col gap-1 bg-background-alt p-2 rounded-lg text-sm!">
                          <form.AppField
                            name={`affiliateLinks[${index}].region`}
                            children={(field) => (
                              <field.FormSelectField
                                label="Region"
                                options={Object.values(Region)}
                                selectedOption={field.state.value ?? Region.Global}
                                onChange={(value) => field.setValue(value)}
                              />
                            )}
                          />

                          <form.AppField
                            name={`affiliateLinks[${index}].currency`}
                            children={(field) => (
                              <field.FormSelectField
                                label="Currency"
                                options={Object.values(Currency)}
                                selectedOption={field.state.value ?? Currency.USD}
                                onChange={(value) => field.setValue(value)}
                              />
                            )}
                          />

                          <form.AppField
                            name={`affiliateLinks[${index}].price`}
                            children={(field) => (
                              <field.FormTextField
                                name={`affiliateLinks[${index}].price`}
                                type="number"
                                label="Price"
                                value={field.state.value ?? 300}
                                onChange={(value) => field.setValue(value)}
                                formErrors={form.getAllErrors().form.errors}
                              />
                            )}
                          />

                          <form.AppField
                            name={`affiliateLinks[${index}].site`}
                            children={(field) => (
                              <field.FormTextField
                                name={`affiliateLinks[${index}].site`}
                                label="Site"
                                value={field.state.value ?? "Amazon"}
                                onChange={(value) => field.setValue(value)}
                                formErrors={form.getAllErrors().form.errors}
                              />
                            )}
                          />

                          <form.AppField
                            name={`affiliateLinks[${index}].url`}
                            children={(field) => (
                              <field.FormTextField
                                name={`affiliateLinks[${index}].url`}
                                label="URL"
                                value={field.state.value ?? ""}
                                onChange={(value) => field.setValue(value)}
                                formErrors={form.getAllErrors().form.errors}
                              />
                            )}
                          />

                          <button
                            type="button"
                            className="w-fit text-red px-4 py-2 rounded-md cursor-pointer"
                            onClick={() => field.removeValue(index)}
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      className="bg-background-alt! border! border-border! px-4 py-2 rounded-md cursor-pointer"
                      onClick={() =>
                        field.pushValue({
                          region: Region.Global,
                          currency: Currency.USD,
                          price: 300,
                          site: "Amazon",
                          url: "",
                        })
                      }
                    >
                      Add Affiliate Link
                    </button>
                  </div>
                );
              }}
            </form.AppField>
          </div>
          <div className="md:w-1/2 flex flex-col gap-2">
            <form.AppField
              name="brand"
              children={(field) => (
                <field.FormComboboxField
                  name="brand"
                  label="Brand"
                  selectedOption={field.state.value}
                  options={brandsQuery?.data?.brands || []}
                  onChange={(value) => field.setValue(value)}
                  formErrors={form.getAllErrors().form.errors}
                />
              )}
            />

            <form.AppField
              name="model"
              children={(field) => (
                <>
                  <field.FormTextField
                    name="model"
                    label="Model"
                    value={field.state.value}
                    onChange={(value) => field.setValue(value)}
                    formErrors={form.getAllErrors().form.errors}
                  />

                  {!vacuum?.id && similarVacuums?.data?.length ? (
                    <div className="bg-background-alt p-4 rounded-lg">
                      <p className="flex gap-2 items-center">
                        <LuInfo className="w-4 h-4" />
                        It seems a vacuum with a similar brand and model already exists:
                      </p>
                      <ul>
                        {similarVacuums.data.map((vacuum) => (
                          <li key={vacuum.id}>
                            <Link
                              to={`/vacuums/${vacuum.id}`}
                              className="text-blue-700 dark:text-blue-300"
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
            />

            <form.AppField
              name="mappingTechnology"
              children={(field) => (
                <field.FormSelectField
                  label="Mapping Technology"
                  options={Object.values(VacuumMappingTechnology)}
                  selectedOption={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <form.AppField
              name="batteryLifeInMinutes"
              children={(field) => (
                <field.FormTextField
                  name="batteryLifeInMinutes"
                  type="number"
                  label="Battery Life (minutes)"
                  value={field.state.value}
                  onChange={(value) => field.setValue(value)}
                  formErrors={form.getAllErrors().form.errors}
                />
              )}
            />

            <form.AppField
              name="suctionPowerInPascals"
              children={(field) => (
                <field.FormTextField
                  name="suctionPowerInPascals"
                  type="number"
                  label="Suction Power (Pa)"
                  value={field.state.value}
                  onChange={(value) => field.setValue(value)}
                  formErrors={form.getAllErrors().form.errors}
                />
              )}
            />

            <form.AppField
              name="noiseLevelInDecibels"
              children={(field) => (
                <field.FormTextField
                  name="noiseLevelInDecibels"
                  type="number"
                  label="Noise Level (dB)"
                  value={field.state.value}
                  onChange={(value) => field.setValue(value)}
                  formErrors={form.getAllErrors().form.errors}
                />
              )}
            />

            <form.AppField
              name="waterTankCapacityInLiters"
              children={(field) => (
                <field.FormTextField
                  name="waterTankCapacityInLiters"
                  type="number"
                  label="Water Tank Capacity (L)"
                  value={field.state.value ?? 0}
                  onChange={(value) => field.setValue(value)}
                  formErrors={form.getAllErrors().form.errors}
                />
              )}
            />

            <form.AppField
              name="dustbinCapacityInLiters"
              children={(field) => (
                <field.FormTextField
                  name="dustbinCapacityInLiters"
                  type="number"
                  label="Dustbin Capacity (L)"
                  value={field.state.value}
                  onChange={(value) => field.setValue(value)}
                  formErrors={form.getAllErrors().form.errors}
                />
              )}
            />

            <form.AppField
              name="otherFeatures"
              mode="array"
              children={(arrayField) => (
                <div className="flex flex-col gap-2 py-4">
                  <div className="font-semibold">Other Features</div>

                  {arrayField.state.value.map((field, index) => {
                    return (
                      <form.AppField
                        key={`otherFeatures[${index}]`}
                        name={`otherFeatures[${index}]`}
                        children={(field) => (
                          <div className="flex gap-2">
                            <field.FormTextField
                              name="otherFeatures"
                              inputContainerClassName="flex-row-reverse"
                              icon={
                                <button
                                  type="button"
                                  className="outline-0! focus-within:outline-0! border-0! py-0! px-0! cursor-pointer"
                                  onClick={() => arrayField.removeValue(index)}
                                >
                                  <FaMinus className="w-4 h-4" />
                                </button>
                              }
                              value={field.state.value}
                              onChange={(value) => field.setValue(value)}
                              formErrors={!field.state.value ? form.getAllErrors().form.errors : []}
                            />
                          </div>
                        )}
                      />
                    );
                  })}

                  <button
                    type="button"
                    className="bg-background-alt! border! border-border! px-4 py-2 rounded-md cursor-pointer"
                    onClick={() => arrayField.pushValue("")}
                  >
                    Add Feature
                  </button>
                </div>
              )}
            />

            <form.AppField
              name="hasMoppingFeature"
              children={(field) => (
                <field.FormToggleField
                  label="Mopping Feature"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <form.AppField
              name="hasSelfEmptyingFeature"
              children={(field) => (
                <field.FormToggleField
                  label="Self Emptying Feature"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <form.AppField
              name="hasZoneCleaningFeature"
              children={(field) => (
                <field.FormToggleField
                  label="Zone Cleaning Feature"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <form.AppField
              name="hasMultiFloorMappingFeature"
              children={(field) => (
                <field.FormToggleField
                  label="Multi Floor Mapping Feature"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <form.AppField
              name="hasCarpetBoostFeature"
              children={(field) => (
                <field.FormToggleField
                  label="Carpet Boost Feature"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <form.AppField
              name="hasVirtualWallsFeature"
              children={(field) => (
                <field.FormToggleField
                  label="Virtual Walls Feature"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <form.AppField
              name="hasAppControl"
              children={(field) => (
                <field.FormToggleField
                  label="App Control"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <form.AppField
              name="hasSmartHomeIntegration"
              children={(field) => (
                <field.FormToggleField
                  label="Smart Home Integration"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <form.AppField
              name="hasVoiceControl"
              children={(field) => (
                <field.FormToggleField
                  label="Voice Control"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <form.AppField
              name="hasRemoteControl"
              children={(field) => (
                <field.FormToggleField
                  label="Remote Control"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <form.AppField
              name="hasManualControl"
              children={(field) => (
                <field.FormToggleField
                  label="Manual Control"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Checklist />
          <div className="flex gap-2">
            {vacuum?.id ? (
              <ConfirmButton
                onClick={() => {
                  deleteVacuumMutation.mutateAsync({
                    id: vacuum.id,
                    userToken,
                  });
                }}
                confirmText="Delete Vacuum"
              >
                Delete
              </ConfirmButton>
            ) : null}
            <form.FormSubmitButton>Save</form.FormSubmitButton>
          </div>
        </div>
      </form.AppForm>
    </form>
  );
}

const checklistItems = [
  "Rename the vacuum image as (brand)-(model).jpg",
  "Check that this is a new vacuum and not a duplicate",
  "Add all affiliate links you could find for the different regions",
  "Fill out all the fields to the best of your ability",
  "If you can't find a feature, set it to false or 0 (if it's a number)",
];
const Checklist = () => {
  return (
    <Disclosure as="div" className="flex flex-col gap-4 max-w-md">
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
