export const markAllValuesAsDefined = <T extends Record<string, unknown | undefined>>(obj: any): T => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [key, value ?? ""];
    })
  ) as T;
};
