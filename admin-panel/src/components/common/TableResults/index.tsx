import { Typography } from '../Typography';

type ComponentProps = {
  results: number;
};

export const TableResults = ({ results }: ComponentProps): JSX.Element => {
  return (
    <Typography color="dark-060" size="md" textWeight="400">
      {results} result{results !== 1 ? 's' : ''}
    </Typography>
  );
};
