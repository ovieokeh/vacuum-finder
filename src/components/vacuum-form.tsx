import { useState } from "react";
import {
  Field,
  Button,
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Switch,
} from "@headlessui/react";
import { GoChevronDown } from "react-icons/go";

import { FloorType, VacuumFilterOptions } from "../types";

interface VacuumFormProps {
  onSubmit: (formData: VacuumFilterOptions) => void;
}

export function VacuumForm({ onSubmit }: VacuumFormProps) {
  const [formData, setFormData] = useState<VacuumFilterOptions>({
    houseSizeSqM: 32,
    floorType: FloorType.Hardwood,
    budget: 300,
    numRooms: 3,
    numPets: 0,
    mopFeature: false,
  });

  return (
    <div className="p-4 flex flex-col gap-4 bg-gray-100">
      <Listbox
        value={formData.floorType}
        onChange={(value) => setFormData({ ...formData, floorType: value as FloorType })}
      >
        <div className="flex flex-col gap-2">
          <Label className="text-sm/6 font-medium">Floor Type</Label>
          <ListboxButton className="flex flex-row items-center justify-between gap-2 text-left px-2! bg-white!">
            {formData.floorType}
            <GoChevronDown className="w-4 h-4" />
          </ListboxButton>
          <ListboxOptions anchor="bottom start" className="bg-white rounded shadow">
            {Object.values(FloorType).map((type) => (
              <ListboxOption
                key={type}
                value={type}
                className="group flex gap-2 px-4 py-2 data-[focus]:bg-blue-100 cursor-pointer"
              >
                {type}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>

      <Field>
        <div className="space-y-2">
          <Label className="block text-sm/6 font-medium">Living Area (sqm)</Label>
          <Input
            type="number"
            value={formData.houseSizeSqM.toString()}
            onChange={(e) => setFormData({ ...formData, houseSizeSqM: +e.target.value })}
            className={"block bg-white p-2 rounded-md focus:ring-primary focus:border-primary"}
          />
        </div>
      </Field>

      <Field>
        <div className="space-y-2">
          <Label className="block text-sm/6 font-medium">Budget</Label>
          <Input
            type="number"
            value={formData.budget.toString()}
            onChange={(e) => setFormData({ ...formData, budget: +e.target.value })}
            className={"block bg-white p-2 rounded-md focus:ring-primary focus:border-primary"}
          />
        </div>
      </Field>

      <Field>
        <div className="space-y-2">
          <Label className="block text-sm/6 font-medium">Number of Rooms</Label>
          <Input
            type="number"
            value={formData.numRooms.toString()}
            onChange={(e) => setFormData({ ...formData, numRooms: +e.target.value })}
            className={"block bg-white p-2 rounded-md focus:ring-primary focus:border-primary"}
          />
        </div>
      </Field>

      <Field>
        <div className="space-y-2">
          <Label className="block text-sm/6 font-medium">Number of Pets</Label>
          <Input
            type="number"
            value={formData.numPets.toString()}
            onChange={(e) => setFormData({ ...formData, numPets: +e.target.value })}
            className={"block bg-white p-2 rounded-md focus:ring-primary focus:border-primary"}
          />
        </div>
      </Field>

      <Field>
        <Label className="block text-sm/6 font-medium">Mop Feature</Label>
        <Switch
          checked={formData.mopFeature}
          onChange={(e) => setFormData({ ...formData, mopFeature: e })}
          className="group relative flex w-16 py-1! cursor-pointer rounded-full bg-white/10 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none inline-block size-6 -translate-x-4 rounded-full ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-4 "
            style={{
              backgroundColor: formData.mopFeature ? "rgb(59, 130, 246)" : "rgb(229, 231, 235)",
            }}
          />
        </Switch>
      </Field>

      <Button onClick={() => onSubmit(formData)}>
        <span>Find Vacuums</span>
      </Button>
    </div>
  );
}
