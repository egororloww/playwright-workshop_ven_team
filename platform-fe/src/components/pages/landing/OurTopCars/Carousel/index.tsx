import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CarCard } from '@/components';
import { ReactComponent as ChevronLeft } from '@icons/chevron-left.svg';
import { ReactComponent as ChevronRight } from '@icons/chevron-right.svg';
import { CarType } from '@/services/types/car';
import 'swiper/css';
import 'swiper/css/pagination';

import classes from './index.module.scss';

// import required modules
import { Pagination } from 'swiper/modules';

type Props = {
  cars: CarType[];
};

export const Carousel = ({ cars }: Props): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const swiper = useRef() as any;

  const handleNext = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (swiper.current && swiper.current.swiper) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      swiper.current?.swiper?.slideNext();
    }
  };

  const handlePrev = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (swiper.current && swiper.current.swiper) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      swiper.current.swiper.slidePrev();
    }
  };

  return (
    <div className={classes.carousel}>
      <div className={classes.wrapper}>
        <Swiper
          slidesPerGroup={2}
          slidesPerView={2}
          loop={true}
          spaceBetween={30}
          breakpoints={{
            900: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
          }}
          pagination={{
            clickable: false,
            el: `.${classes.pagination}`,
            type: 'custom',
            renderCustom: (_, current, total) =>
              `
                <span class=${classes.current}>${current}</span> 
                <span class=${classes.line}></span> 
                <span class=${classes.total}>${total}</span>
            `,
          }}
          modules={[Pagination]}
          onInit={(core) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            swiper.current = core.el;
          }}
        >
          {[...cars]
            .sort((a, b) => {
              const modelA = a.model.toUpperCase();
              const modelB = b.model.toUpperCase();

              if (modelA < modelB) {
                return -1;
              }
              if (modelA > modelB) {
                return 1;
              }
              return 0;
            })
            .map((car) => (
              <SwiperSlide key={car.id}>
                <CarCard car={car} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div className={classes.navigation}>
        <div className={classes.navigation__prev} onClick={handlePrev}>
          <ChevronLeft />
        </div>
        <div className={classes.pagination}></div>
        <div className={classes.navigation__next} onClick={handleNext}>
          <ChevronRight />
        </div>
      </div>
    </div>
  );
};
