import { useEffect } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { useSiteConfig } from "../providers/site-config";
import { useAddVacuumMutation, useDeleteVacuumMutation, useUpdateVacuumMutation } from "../database/hooks";
import { useAppForm } from "./form";
import { AffiliateLinkBase, Currency, Region, Vacuum, VacuumBase, VacuumMappingTechnology } from "../types";
import { ConfirmButton } from "./confirm-button";

interface AdminVacuumFormProps {
  vacuum?: Vacuum;
}
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

  const { reset, handleSubmit, AppForm, AppField, ...formRest } = useAppForm({
    defaultValues: {
      imageUrl: "https://placehold.co/600x400",
      brand: "Dreame",
      model: "L10s Pro Ultra Heat",
      mappingTechnology: VacuumMappingTechnology.Laser,
      batteryLifeInMinutes: 180,
      suctionPowerInPascals: 3000,
      noiseLevelInDecibels: 60,
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
      onSubmit: z.object({
        imageUrl: z.string().url(),
        brand: z.string().min(2),
        model: z.string().min(2),
        mappingTechnology: z.nativeEnum(VacuumMappingTechnology),
        batteryLifeInMinutes: z.number().int().min(1),
        suctionPowerInPascals: z.number().int().min(1),
        noiseLevelInDecibels: z.number().int().min(1),
        dustbinCapacityInLiters: z.number().int().min(1),
        hasMoppingFeature: z.boolean(),
        hasSelfEmptyingFeature: z.boolean(),
        hasZoneCleaningFeature: z.boolean(),
        hasMultiFloorMappingFeature: z.boolean(),
        hasCarpetBoostFeature: z.boolean(),
        hasVirtualWallsFeature: z.boolean(),
        hasSmartHomeIntegration: z.boolean(),
        hasVoiceControl: z.boolean(),
        hasAppControl: z.boolean(),
        hasRemoteControl: z.boolean(),
        hasManualControl: z.boolean(),
        otherFeatures: z.array(z.string()),
        affiliateLinks: z.array(
          z.object({
            region: z.nativeEnum(Region),
            currency: z.nativeEnum(Currency),
            price: z.number().min(1),
            site: z.string().min(2),
            url: z.string().url(),
          })
        ),
      }),
    },
    onSubmit: ({ value }) => {
      if (vacuum?.id) {
        updateVacuumMutation.mutate({
          id: vacuum.id,
          data: value as VacuumBase,
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

  return (
    <form
      className="p-4 flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <AppForm>
        <AppField
          name="imageUrl"
          children={(field) => (
            <field.FormTextField
              label="Image URL"
              value={field.state.value}
              onChange={(value) => field.setValue(value)}
            />
          )}
        />

        <div className="flex flex-col md:flex-row gap-4 md:gap-12">
          <div className="md:w-1/2 flex flex-col gap-2">
            <AppField
              name="brand"
              children={(field) => (
                <field.FormTextField
                  label="Brand"
                  value={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="model"
              children={(field) => (
                <field.FormTextField
                  label="Model"
                  value={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
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

            <AppField
              name="batteryLifeInMinutes"
              children={(field) => (
                <field.FormTextField
                  type="number"
                  label="Battery Life (minutes)"
                  value={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="suctionPowerInPascals"
              children={(field) => (
                <field.FormTextField
                  type="number"
                  label="Suction Power (Pa)"
                  value={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="noiseLevelInDecibels"
              children={(field) => (
                <field.FormTextField
                  type="number"
                  label="Noise Level (dB)"
                  value={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="dustbinCapacityInLiters"
              children={(field) => (
                <field.FormTextField
                  type="number"
                  label="Dustbin Capacity (L)"
                  value={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />
          </div>

          <div className="md:w-1/2 flex flex-col gap-2">
            <AppField
              name="hasMoppingFeature"
              children={(field) => (
                <field.FormToggleField
                  label="Mopping Feature"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="hasSelfEmptyingFeature"
              children={(field) => (
                <field.FormToggleField
                  label="Self Emptying Feature"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="hasZoneCleaningFeature"
              children={(field) => (
                <field.FormToggleField
                  label="Zone Cleaning Feature"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="hasMultiFloorMappingFeature"
              children={(field) => (
                <field.FormToggleField
                  label="Multi Floor Mapping Feature"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="hasCarpetBoostFeature"
              children={(field) => (
                <field.FormToggleField
                  label="Carpet Boost Feature"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="hasVirtualWallsFeature"
              children={(field) => (
                <field.FormToggleField
                  label="Virtual Walls Feature"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="hasAppControl"
              children={(field) => (
                <field.FormToggleField
                  label="App Control"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="hasSmartHomeIntegration"
              children={(field) => (
                <field.FormToggleField
                  label="Smart Home Integration"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="hasVoiceControl"
              children={(field) => (
                <field.FormToggleField
                  label="Voice Control"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
              name="hasRemoteControl"
              children={(field) => (
                <field.FormToggleField
                  label="Remote Control"
                  checked={field.state.value}
                  onChange={(value) => field.setValue(value)}
                />
              )}
            />

            <AppField
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
          <formRest.FormSubmitButton>Save</formRest.FormSubmitButton>
        </div>
      </AppForm>
    </form>
  );
}
