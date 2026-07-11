/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectComponent, { components, MultiValueRemoveProps } from 'react-select';
import { ReactComponent as RemoveIcon } from '@icons/close_accent.svg';
import { Typography } from '@components';

import './index.scss';

export interface SelectOptionType {
  label: string;
  value: string | number;
}

type SelectProps = {
  name?: string;
  isSearchable?: boolean;
  hideSelectedOptions?: boolean;
  isError?: boolean;
  isMulti?: boolean;
  value?: SelectOptionType;
  label?: string;
  options?: any[];
  onChange?: (value: any) => void;
  placeholder?: string;
};

const MultiValueRemove: React.FC<any> = (props: MultiValueRemoveProps): JSX.Element => {
  return (
    <components.MultiValueRemove {...props}>
      <RemoveIcon />
    </components.MultiValueRemove>
  );
};

const Select: React.FC<SelectProps> = ({
  name = '',
  isSearchable = false,
  value = null,
  label = null,
  options = [],
  hideSelectedOptions = true,
  isError = false,
  isMulti = false,
  ...rest
}) => {
  return (
    <div className="main-form-select_container">
      {label && (
        <Typography color="dark-080" textAlign="left" textWeight="600" component="label" htmlFor={name}>
          {label}
        </Typography>
      )}
      <SelectComponent
        components={{ MultiValueRemove }}
        name={name}
        className={isError ? 'main-form-select_error' : ''}
        classNamePrefix="main-form-select"
        menuPosition="fixed"
        isSearchable={isSearchable}
        value={value}
        hideSelectedOptions={hideSelectedOptions}
        placeholder={isSearchable}
        options={options}
        isMulti={isMulti}
        // getOptionValue={(option) => option.value}
        {...rest}
      />
    </div>
  );
};

export default Select;
