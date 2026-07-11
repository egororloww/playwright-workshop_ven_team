import { Typography } from '@components';

import classes from './index.module.scss';

type Props = {
  label?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isError?: boolean;
};

const TextareaComponent: React.FC<Props> = ({ name, label, value, placeholder, isDisabled = false, isError = false, ...rest }) => {
  return (
    <div className={classes.textarea_container}>
      {label ? (
        <Typography color="dark-080" textAlign="left" textWeight="600" component="label" htmlFor={name}>
          {label}
        </Typography>
      ) : null}
      <textarea className={`${classes.textarea} ${isError ? classes.textarea_error : ''}`} value={value} placeholder={placeholder} name={name} disabled={isDisabled} {...rest} />
    </div>
  );
};

export default TextareaComponent;
