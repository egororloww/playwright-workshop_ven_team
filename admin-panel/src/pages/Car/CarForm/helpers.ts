/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { CarCreateFormType } from '@services/types/cars.ts';

export const createFromData = ({ data, dirtyFields }: { data: CarCreateFormType; dirtyFields: any }): FormData => {
  const formData = new FormData();
  const isEdit = !!dirtyFields;
  Object.keys(data).forEach((key) => {
    if (key === 'features') {
      if (isEdit && !dirtyFields[key]) {
        return;
      }
      const featuresIds = data[key].map((v) => v.value);
      formData.append('features', featuresIds.join(','));
      return;
    }

    if (key === 'hoverImage' || key === 'normalImage' || key === 'mainImage') {
      if (isEdit && !dirtyFields[key]) {
        return;
      }
      formData.append(key, data[key][0]);
      return;
    }

    if (isEdit && !dirtyFields[key]) {
      return;
    }
    // TODO: Fix typeScript types
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    formData.append(key, data[key]);
  });

  return formData;
};
