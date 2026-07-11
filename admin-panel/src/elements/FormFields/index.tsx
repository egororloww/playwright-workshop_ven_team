/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
import { Controller, UseFormReturn } from 'react-hook-form';
import classes from '@pages/Car/CarForm/index.module.scss';
import { TextField, Typography } from '@components';
import Select, { SelectOptionType } from '@/elements/Select';
import TextareaComponent from '@components/common/inputs/TextareaComponent';
import ImageUpload from '@/elements/FormFields/ImageUpload';

type FormFieldType = {
  form: UseFormReturn<any>;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  name: string;
  placeholder?: string;
  label?: string;
};

export const TextAreaFiled: React.FC<FormFieldType> = ({ form, isDisabled = false, name, placeholder = '', label = '' }) => {
  const {
    control,
    formState: { errors },
  } = form;
  const error = errors?.[name]?.message || '';
  return (
    <div className={classes.field}>
      <Controller
        name={name}
        control={control}
        render={({ field: { ...field } }) => (
          <>
            <TextareaComponent {...field} isError={!!error} isDisabled={isDisabled} placeholder={placeholder} name={name} label={label} />
            {error ? (
              <Typography className={classes.field_error} size="sm" color="accent" textAlign="left" component="p">
                {error as string}
              </Typography>
            ) : null}
          </>
        )}
      />
    </div>
  );
};

export const Field: React.FC<FormFieldType> = ({ form, isDisabled = false, name, placeholder = '', label = '', ...rest }) => {
  const {
    control,
    formState: { errors },
  } = form;
  const error = errors?.[name]?.message || '';
  return (
    <div className={classes.field}>
      <Controller
        name={name}
        control={control}
        render={({ field: { ...field } }) => (
          <>
            <TextField placeholder={placeholder} isError={!!error} label={label} {...field} disabled={isDisabled} name={name} {...rest} />
            {error ? (
              <Typography className={classes.field_error} size="sm" color="accent" textAlign="left" component="p">
                {error as string}
              </Typography>
            ) : null}
          </>
        )}
      />
    </div>
  );
};

type SelectFieldProps = FormFieldType & {
  options?: SelectOptionType[];
  isMulti?: boolean;
};

export const SelectField: React.FC<SelectFieldProps> = ({ form, label, placeholder = '', options = [], name, isMulti = false }) => {
  const {
    control,
    formState: { errors },
  } = form;

  const error = errors[name]?.message || '';
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field } }) => (
        <>
          <Select
            {...field}
            label={label}
            isError={!!error}
            options={options}
            value={isMulti ? value : options.find((c) => c.value === value)}
            onChange={(val: SelectOptionType) => onChange(isMulti ? val : val.value)}
            isMulti={isMulti}
            placeholder={placeholder}
          />
          {error ? (
            <Typography className={classes.field_error} size="sm" color="accent" textAlign="left" component="p">
              {error as string}
            </Typography>
          ) : null}
        </>
      )}
    />
  );
};

type ImageUploadFieldProps = FormFieldType & {
  options?: SelectOptionType[];
  staticError?: boolean;
};

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ form, name, label, staticError = false }) => {
  const {
    control,
    formState: { errors },
  } = form;
  const error = errors[name]?.message || '';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <>
          <ImageUpload
            helperText={error as string}
            error={!!errors.driverLicenseImage1}
            onChange={onChange}
            name={name}
            image={value}
            label={label}
          />
          {error ? (
            <Typography
              className={`${classes.field_error} ${staticError ? classes.field_error_static : ''}`}
              size="sm"
              color="accent"
              textAlign="left"
              component="p"
            >
              {error as string}
            </Typography>
          ) : null}
        </>
      )}
    />
  );
};
