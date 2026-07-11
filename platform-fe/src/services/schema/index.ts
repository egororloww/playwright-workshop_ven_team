import * as yup from 'yup';
import { EMAIL_REGEX, PASSWORD_REGEX, PHONE_REGEX } from '../constants';

export const customerSchema = {
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  phoneNumber: yup.string().required('Phone Number is required').matches(PHONE_REGEX, 'Phone Number is not valid'),
  email: yup.string().required('Email is required').matches(EMAIL_REGEX, 'Email is not valid'),
};

export const createPasswordSchema = {
  password: yup
    .string()
    .required('Password is required')
    .matches(PASSWORD_REGEX, 'Password should be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and symbols')
    .test('passwords-match', 'Passwords do not match', function (value) {
      const parent = this.parent as { confirmPassword: string };
      return parent.confirmPassword === value;
    }),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .test('passwords-match', 'Passwords do not match', function (value) {
      const parent = this.parent as { password: string };
      return parent.password === value;
    }),
};

export const documentsSchema = {
  driverLicenseImage1: yup
    .mixed()
    .test('fileSize', 'File size is not valid', (value) => {
      const fileList = value as FileList | null | undefined;
      if (!fileList || fileList.length === 0) {
        return true;
      }
      const file = fileList[0];
      return file.size <= 10 * 1024 * 1024; // 10MB file size limit
    })
    .test('fileType', 'File format is not valid', (value) => {
      const fileList = value as FileList | null | undefined;
      if (!fileList || fileList.length === 0) {
        return true;
      }
      const file = fileList[0];
      return /(jpg|jpeg|png|pdf)$/i.test(file.type); // Allow jpg, jpeg, png, and pdf formats
    })
    .nullable(),
  driverLicenseImage2: yup
    .mixed()
    .test('fileSize', 'File size is not valid', (value) => {
      const fileList = value as FileList | null | undefined;
      if (!fileList || fileList.length === 0) {
        return true;
      }
      const image = fileList[0];
      return image.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'File format is not valid', (value) => {
      const fileList = value as FileList | null | undefined;
      if (!fileList || fileList.length === 0) {
        return true;
      }
      const file = fileList[0];
      return /(jpg|jpeg|png|pdf)$/i.test(file.type); // Allow jpg, jpeg, png, and pdf formats
    })
    .nullable(),
  insuranceCardImage: yup
    .mixed()
    .test('fileSize', 'File size is not valid', (value) => {
      const fileList = value as FileList | null | undefined;
      if (!fileList || fileList.length === 0) {
        return true;
      }
      const image = fileList[0];
      return image.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'File format is not valid', (value) => {
      const fileList = value as FileList | null | undefined;
      if (!fileList || fileList.length === 0) {
        return true;
      }
      const file = fileList[0];
      return /(jpg|jpeg|png|pdf)$/i.test(file.type); // Allow jpg, jpeg, png, and pdf formats
    })
    .nullable(),
  insuranceDeclarationPageImage: yup
    .mixed()
    .test('fileSize', 'File size is not valid', (value) => {
      const fileList = value as FileList | null | undefined;
      if (!fileList || fileList.length === 0) {
        return true;
      }
      const image = fileList[0];
      return image.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'File format is not valid', (value) => {
      const fileList = value as FileList | null | undefined;
      if (!fileList || fileList.length === 0) {
        return true;
      }
      const file = fileList[0];
      return /(jpg|jpeg|png|pdf)$/i.test(file.type); // Allow jpg, jpeg, png, and pdf formats
    })
    .nullable(),
};

export const registrationSchema = yup.object().shape({
  ...customerSchema,
  ...createPasswordSchema,
  ...documentsSchema,
});

export const editProfileSchema = yup.object().shape({
  ...customerSchema,
  ...documentsSchema,
});

export const documentsEditSchema = yup.object().shape({
  ...documentsSchema,
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .matches(PASSWORD_REGEX, 'New password is not valid')
    .test('passwords-match', 'New password must be different from current password', function (value) {
      const parent = this.parent as { oldPassword: string };
      return parent.oldPassword !== value;
    })
    .test('passwords-match', 'New passwords do not match', function (value) {
      const parent = this.parent as { confirmPassword: string };
      return parent.confirmPassword === value;
    }),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .test('passwords-match', 'New passwords do not match', function (value) {
      const parent = this.parent as { newPassword: string };
      return parent.newPassword === value;
    }),
});

export const authSchema = yup.object().shape({
  email: yup.string().required('Email is required').matches(EMAIL_REGEX, 'Email is not valid'),
  password: yup.string().required('Password is required'),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().required('Email is required').matches(EMAIL_REGEX, 'Email is not valid'),
});

export const forgotPasswordCodeSchema = yup.object().shape({
  code: yup.string().required('Code is required'),
});

export const verifyPhoneSchema = yup.object().shape({
  code: yup
    .string()
    .required('Code is required')
    .matches(/^[0-9]+$/, 'Must be only digits'),
});

export const forgotPasswordNewPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('New password is required')
    .matches(PASSWORD_REGEX, 'New password is not valid')
    .test('passwords-match', 'New passwords do not match', function (value) {
      const parent = this.parent as { confirmPassword: string };
      return parent.confirmPassword === value;
    }),
  confirmPassword: yup
    .string()
    .required('Confirm new password is required')
    .test('passwords-match', 'New passwords do not match', function (value) {
      const parent = this.parent as { password: string };
      return parent.password === value;
    }),
});
