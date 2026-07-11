import { ReactNode, useEffect, useState } from 'react';
import { ReactComponent as Checked } from '@icons/check-square-checked.svg';
import { ReactComponent as UnChecked } from '@icons/check-square-unchecked.svg';
import classes from './index.module.scss';

type Props = {
  checked?: boolean;
  label: ReactNode;
  onChange?: () => void;
  disabled?: boolean;
};

export const CustomCheckbox = ({ checked, label, onChange = (): false => false, disabled = false, ...rest }: Props): JSX.Element => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (): void => {
    checked === undefined && setIsChecked((prev) => !prev);
    onChange();
  };

  useEffect(() => {
    checked !== undefined && setIsChecked(checked);
  }, [checked]);

  return (
    <label className={classes.checkbox}>
      <input disabled={disabled} type="checkbox" checked={isChecked} onChange={handleChange} {...rest} />
      <span className={classes.checkmark}>{isChecked ? <Checked /> : <UnChecked />}</span>
      {label}
    </label>
  );
};
