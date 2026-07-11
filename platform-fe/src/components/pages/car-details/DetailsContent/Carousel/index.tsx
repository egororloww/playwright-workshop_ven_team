import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ReactComponent as ChevronLeft } from '@icons/chevron-left.svg';
import { ReactComponent as ChevronRight } from '@icons/chevron-right.svg';

import 'swiper/css';
import 'swiper/css/pagination';

import classes from './index.module.scss';

// import required modules
import { Pagination } from 'swiper/modules';
import { GalleryImage } from '@/pages/CarDetails';
import { useModal } from '@/components/Modal/useModal';
import { Gallery } from '../Gallery';
import { GalleryModal } from '@/components';

type Props = {
  cars: GalleryImage[];
};

export const Carousel = ({ cars }: Props): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const swiper = useRef() as any;
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [slideIndex, setSlideIndex] = useState<number | undefined>(undefined);

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

  const { modalIsOpen, openModal, closeModal } = useModal();

  const handleModalOpen = (index: number): void => {
    setSlideIndex(index);
    openModal();
  };
  const handleNextModalImage = (index: number): void => {
    const carsCount = cars.length - 1;
    carsCount > index && carsCount !== index ? setSlideIndex(index + 1) : setSlideIndex(0);
  };
  const handlePrevModalImage = (index: number): void => {
    const carsCount = cars.length - 1;
    carsCount >= index && index !== 0 ? setSlideIndex(index - 1) : setSlideIndex(carsCount);
  };
  const handleModalClose = (): void => {
    closeModal();
    setUrl(undefined);
  };

  useEffect(() => {
    if (slideIndex || slideIndex === 0) {
      const car = cars[slideIndex];
      const url = car.firstResizedImageUrl;
      setUrl(url);
    }
  }, [cars, slideIndex]);

  return (
    <div className={classes.carousel}>
      <GalleryModal modalIsOpen={modalIsOpen} closeModal={handleModalClose}>
        <Gallery url={url} handleNextModalImage={handleNextModalImage} handlePrevModalImage={handlePrevModalImage} index={slideIndex as number} />
      </GalleryModal>

      <div className={classes.wrapper}>
        <Swiper
          slidesPerGroup={2}
          slidesPerView={2}
          loop={false}
          spaceBetween={8}
          breakpoints={{
            769: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            993: {
              slidesPerView: 4,
              slidesPerGroup: 4,
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
          {cars.map((car, index) => (
            <SwiperSlide key={car.id}>
              <div className={classes.slide} role="button" onClick={() => handleModalOpen(index)}>
                <img src={car.thirdResizedImageUrl} alt="Slide" />
              </div>
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
