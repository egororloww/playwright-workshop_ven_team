/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CompactTable } from '@table-library/react-table-library/compact';
import { ReactNode } from 'react';

import classes from './index.module.scss';

export const Table = ({ columns, nodes, theme }: any): ReactNode => {
  const data = { nodes };

  return (
    <div className={classes.table}>
      <CompactTable columns={columns} data={data} theme={theme} layout={{ fixedHeader: true }} />
    </div>
  );
};
