import * as yup from 'yup';
import { EMAIL_REGEX } from '../constants';

export const authSchema = yup.object().shape({
  email: yup.string().required('Email is required').matches(EMAIL_REGEX, 'Email is not valid'),
  password: yup.string().required('Password is required'),
});

export const availabilitySchema = yup.object().shape({
  unavailableFrom: yup.date().required('Date from is required').max(yup.ref('unavailableTo'), 'Start date must be lower than end date'),
  unavailableTo: yup
    .date()
    .required('Date to is required')
    .test('Equals', 'End date must be greater than start date', (date, context) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      if (date.getTime() > context.parent.unavailableFrom.getTime()) {
        return true;
      }
    })
    .min(yup.ref('unavailableFrom'), 'End date must be greater than start date'),
  comment: yup.string().required('Comment is required'),
});

export const carFormScheme = yup.object().shape({
  make: yup.string().required('Make is required'),
  model: yup.string().required('Model is required'),
  price: yup.string().required('Price is required'),
  doors: yup
    .string()
    .required('Doors is required')
    .matches(/^[0-9]+$/, 'Must be only digits'),
  seats: yup
    .string()
    .required('Seats is required')
    .matches(/^[0-9]+$/, 'Must be only digits'),
  fuelType: yup.string().required('Fuel type is required'),
  ageLimit: yup.string().required('Age limit is required'),
  description: yup.string().required('Description is required'),
  features: yup.array().required('Features is required'),
  normalImage: yup
    .mixed<FileList | string>()
    .required('Normal image is required')
    .test('fileSize', 'File size is not valid', (fileList) => {
      if (typeof fileList === 'string') {
        return true;
      }
      const image = fileList[0];
      return image.size <= 100 * 1024;
    })
    .test('fileType', 'File format is not valid', (fileList) => {
      if (typeof fileList === 'string') {
        return true;
      }
      const image = fileList[0];
      return /(jpg|jpeg|png)$/i.test(image.type);
    })
    .nullable(),
  hoverImage: yup
    .mixed<FileList | string>()
    .required('Hover image is required')
    .test('fileSize', 'File size is not valid', (fileList) => {
      if (typeof fileList === 'string') return true;
      const image = fileList[0];
      return image.size <= 100 * 1024;
    })
    .test('fileType', 'File format is not valid', (fileList) => {
      if (typeof fileList === 'string') return true;
      const image = fileList[0];
      return /(jpg|jpeg|png)$/i.test(image.type);
    })
    .nullable(),
  mainImage: yup
    .mixed<FileList | string>()
    .required('Main image is required')
    .test('fileSize', 'File size is not valid', (fileList) => {
      if (typeof fileList === 'string') return true;
      const image = fileList[0];
      return image.size <= 2 * 1024 * 1024;
    })
    .test('fileType', 'File format is not valid', (fileList) => {
      if (typeof fileList === 'string') return true;
      const image = fileList[0];
      return /(jpg|jpeg|png)$/i.test(image.type);
    }),
});

export const carGalleryImagesFormScheme = yup.object().shape({
  galleryImages: yup.array().of(
    yup
      .mixed<{ value: File | string; id?: number | string }>()
      .required('Gallery images are required')
      .test('fileSize', 'File size is not valid', ({ value: file }) => {
        if (typeof file === 'string') return true;
        return file.size <= 2 * 1024 * 1024;
      })
      .test('fileType', 'File format is not valid', ({ value: file }) => {
        if (typeof file === 'string') return true;
        return /(jpg|jpeg|png)$/i.test(file.type);
      })
  ),
});
