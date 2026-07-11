/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as ArrowRight } from '@icons/chevron-right.svg';
import { ReactComponent as ArrowLeft } from '@icons/chevron-left.svg';
import { useEffect, useRef, useState } from 'react';
import classes from './index.module.scss';
import { DetailsHeroProps } from '@/pages/CarDetails';
import { useDrawer } from '@/context/hooks/useDrawer';
import { useBooking } from '@/context/hooks/useBooking';
import { convertToPst, formatCurrency, pickerDateESTToISOString } from '@/services/helpers';
import { defaultPickupDate, defaultReturnDate } from '@/services/constants';
import moment from 'moment-timezone';

export const DetailsHero = ({
  firstResizedMainImageUrl,
  secondResizedMainImageUrl,
  thirdResizedMainImageUrl,
  make,
  model,
  price,
  id,
}: DetailsHeroProps): JSX.Element => {
  const { prebooking, handlePrebooking } = useBooking();
  const [minDate, setMinDate] = useState<string | Date>('');
  const [start, setStart] = useState<string>(defaultPickupDate);
  const [end, setEnd] = useState<string>(defaultReturnDate);

  const { pickupDate, returnDate } = prebooking;

  const [isVisible, setIsVisible] = useState(true);

  const { openDrawer } = useDrawer();

  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '48px',
        threshold: 0,
      }
    );

    const section = sectionRef.current;

    if (section) {
      observer.observe(section);
    }

    // Clean up the observer
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  useEffect(() => {
    setMinDate(start ? start : defaultPickupDate);
  }, [start]);

  useEffect(() => {
    minDate && end && moment(minDate) > moment(end) && setEnd(minDate as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate]);

  const CustomHeader = ({ date, decreaseMonth, increaseMonth }: any): JSX.Element => {
    return (
      <div className="custom-header">
        <button className="custom-prev-button" onClick={decreaseMonth}>
          <ArrowLeft />
        </button>
        <div className="custom-date">{date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
        <button className="custom-next-button" onClick={increaseMonth}>
          <ArrowRight />
        </button>
      </div>
    );
  };

  return (
    <section className={classes.wrapper} ref={sectionRef}>
      <div className={classes.image}>
        <picture>
          <source media="(min-width: 1440px)" srcSet={firstResizedMainImageUrl} />
          <source media="(min-width: 800px)" srcSet={secondResizedMainImageUrl} />
          <source media="(min-width: 480px)" srcSet={thirdResizedMainImageUrl} />
          <img src={firstResizedMainImageUrl} alt="Car Image" width={1140} height={450} />
        </picture>
      </div>
      <div className={classes.content}>
        <h1 className={classes.title}>
          <span>
            {make} {model}
          </span>
        </h1>
        <div className={classes.form}>
          <div className={classes.input}>
            <label htmlFor="pick-up">Pick-up date</label>
            <ReactDatePicker
              id="pick-up"
              selected={convertToPst(start)}
              onChange={(date) => {
                setMinDate(pickerDateESTToISOString(date as Date));
                setStart(pickerDateESTToISOString(date as Date));
              }}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={convertToPst(moment().toISOString())}
              renderCustomHeader={CustomHeader}
              popperPlacement="bottom-start"
              onChangeRaw={(e) => e.preventDefault()}
              onFocus={(e) => e.target.blur()}
            />
          </div>
          <div className={classes.input}>
            <label htmlFor="return">Return date</label>
            <ReactDatePicker
              id="return"
              minDate={convertToPst(minDate as string)}
              onChange={(date) => {
                setEnd(pickerDateESTToISOString(date as Date));
              }}
              selected={convertToPst(end)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              renderCustomHeader={CustomHeader}
              popperPlacement="bottom-start"
              onChangeRaw={(e) => e.preventDefault()}
              onFocus={(e) => e.target.blur()}
            />
          </div>
          <button
            onClick={() => {
              handlePrebooking({
                key: 'pickupDate',
                data: pickerDateESTToISOString(convertToPst(start || defaultPickupDate)),
              });
              handlePrebooking({
                key: 'returnDate',
                data: pickerDateESTToISOString(convertToPst(end || defaultReturnDate)),
              });
              handlePrebooking({
                key: 'vehicleId',
                data: id,
              });
              openDrawer();
              setMinDate(defaultPickupDate);
              setStart(defaultPickupDate);
              setEnd(defaultReturnDate);
            }}
            className={classes.button}
          >
            <span className={classes.button__text}>Book Now</span>
            <span className={classes.button__price}>{formatCurrency(Number(price))}/day</span>
          </button>
        </div>
      </div>
      {!isVisible ? (
        <div className={classes.book}>
          <button
            onClick={() => {
              handlePrebooking({
                key: 'pickupDate',
                data: pickerDateESTToISOString(convertToPst(pickupDate || defaultPickupDate)),
              });
              handlePrebooking({
                key: 'returnDate',
                data: pickerDateESTToISOString(convertToPst(returnDate || defaultReturnDate)),
              });
              handlePrebooking({
                key: 'vehicleId',
                data: id,
              });
              openDrawer();
              setMinDate(defaultPickupDate);
              setStart(defaultPickupDate);
              setEnd(defaultReturnDate);
            }}
            className={classes.button}
          >
            <span className={classes.button__text}>Book Now</span>
            <span className={classes.button__price}>{formatCurrency(Number(price))}/day</span>
          </button>
        </div>
      ) : null}
    </section>
  );
};
