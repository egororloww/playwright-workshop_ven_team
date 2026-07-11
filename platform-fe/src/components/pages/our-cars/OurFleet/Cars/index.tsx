import { CarCard } from '@/components';
import classes from './index.module.scss';
import { CarType } from '@/services/types/car';

type Props = {
  cars: CarType[];
};

export const Cars = ({ cars }: Props): JSX.Element => {
  return (
    <ul className={classes.list}>
      {[...cars]
        .sort((a, b) => {
          const modelA = a.make.toUpperCase() + ' ' + a.model.toUpperCase();
          const modelB = b.make.toUpperCase() + ' ' + b.model.toUpperCase();

          if (modelA < modelB) {
            return -1;
          }
          if (modelA > modelB) {
            return 1;
          }
          return 0;
        })
        .map((car) => (
          <li role="button" className={classes.list__item} key={car.id}>
            <CarCard car={car} />
          </li>
        ))}
    </ul>
  );
};
