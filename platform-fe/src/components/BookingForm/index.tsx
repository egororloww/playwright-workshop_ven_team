/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import carPlaceholder from '@icons/car-placeholder.png';
import { ReactComponent as ArrowRight } from '@icons/chevron-right.svg';
import { ReactComponent as ArrowLeft } from '@icons/chevron-left.svg';
import { ReactComponent as Close } from '@icons/close.svg';
import { ReactComponent as MapIcon } from '@icons/map.svg';
import { ReactComponent as PinIcon } from '@icons/marker-pin.svg';
import { ReactComponent as IndicatorIcon } from '@icons/chevron-down.svg';
import { Button, Loader, Title } from '@components';
import { Column } from './Column';
import { BlockTitle } from './BlockTitle';
import { Block } from './Block';
import { ListTitle } from './ListTitle';
import { Price } from './Price';
import { useDrawer } from '@/context/hooks/useDrawer';
import { CustomCheckbox } from './CustomCheckbox';
import { useBooking } from '@/context/hooks/useBooking';
import { useEffect, useMemo, useRef, useState } from 'react';
import Select from 'react-select';
import { calculateDifferenceBetweenTwoDates, convertToPst, formatCurrency, pickerDateESTToISOString } from '@/services/helpers';
import { useNavigate } from 'react-router-dom';
import classes from './index.module.scss';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReactNode } from 'react';
import moment from 'moment-timezone';
import { useGetCarsBookingList } from './useGetCarsBookingList';
import { useGetLocationsList } from './useGetLocationsList';
import { defaultPickupDate, defaultReturnDate } from '@/services/constants';

const bookingSchema = yup.object().shape({
  pickupDate: yup
    .date()
    .required('Date from is required')
    .min(convertToPst(), 'Trip starts in the past')
    .test('pickupDate-minOneHour', 'Trip can start at least 1 hour from now', (value) => {
      if (!value) return true;
      return moment(value).diff(convertToPst(moment().add(1, 'hour').toISOString()), 'minutes') >= 0;
    })
    .max(yup.ref('returnDate'), 'Return date must be greater than Pick-up date')
    .test('pickup-return-difference', 'Return date must be greater than Pick-up date', function (value) {
      const { returnDate } = this.parent;
      if (!value || !returnDate) return true;
      const pickupDateTime = new Date(value).getTime();
      const returnDateTime = new Date(returnDate).getTime();
      const differenceInMinutes = (returnDateTime - pickupDateTime) / (1000 * 60);
      return differenceInMinutes >= 30;
    }),
  returnDate: yup.date().required('Date to is required').min(yup.ref('pickupDate'), 'Return date must be greater than Pick-up date'),
  vehicleId: yup.number().required(),
  pickupLocationId: yup.number().required(),
  returnLocationId: yup.number().required(),
  additionalServices: yup.array(),
});

const CALENDAR_MIN_WIDTH = 325;

export const BookingForm = (): ReactNode => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: {},
  });
  const { setBooking, prebooking, handlePrebooking, calculateFee } = useBooking();

  const [minDate, setMinDate] = useState<string | Date>('');
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const { isDrawerOpen, closeDrawer } = useDrawer();

  const navigate = useNavigate();

  const { pickupLocationId, returnLocationId, vehicleId, pickupDate, returnDate, additionalServices, isSameLocation } = prebooking;

  const { carsBookingList, isCarsBookIstLoading } = useGetCarsBookingList({
    pickupDate,
    returnDate,
    enabled: isDrawerOpen && !!pickupDate && !!returnDate,
  });
  const { carsLocationsList, isCarsLocationsIstLoading } = useGetLocationsList({
    vehicleId,
    enabled: isDrawerOpen && !!carsBookingList && !!vehicleId,
  });

  const services = carsLocationsList?.additionalServices;
  const pickupLocations = useMemo(() => carsLocationsList?.pickupLocations || [], [carsLocationsList]);
  const vehicle = carsBookingList?.find((vehicle) => vehicle.id === vehicleId);
  const pickupLocation = pickupLocations?.find((location) => location.id === pickupLocationId);
  const returnLocation = pickupLocations?.find((location) => location.id === returnLocationId);
  const duration = calculateDifferenceBetweenTwoDates(pickupDate, returnDate);
  const processingFee = carsLocationsList?.fees?.processingFee;

  const pickupLocationPrice = Number(pickupLocation?.price) || 0;
  const returnLocationPrice = Number(returnLocation?.price) || 0;
  const vehiclePrice = vehicle?.price && duration ? Number(vehicle?.price) * duration : 0;
  const additionalServicesPrice =
    additionalServices?.length && services
      ? additionalServices?.reduce((acc, additionalService) => {
          const existingService = services?.find((service) => additionalService === service.id);
          return acc + Number(existingService?.code === 'prepaidFuel' ? +existingService?.price : (existingService?.price as any) * duration);
        }, 0)
      : 0;

  const bookingAmount = pickupLocationPrice + returnLocationPrice + vehiclePrice + additionalServicesPrice;
  const bookingTotal = bookingAmount + calculateFee(processingFee, bookingAmount);

  const onSubmit = (data: any): void => {
    const { pickupLocationId, returnLocationId, vehicleId, pickupDate, returnDate, additionalServices } = data;
    const booking = {
      pickupLocationId,
      returnLocationId,
      vehicleId: vehicleId,
      pickupDate: pickerDateESTToISOString(pickupDate),
      returnDate: pickerDateESTToISOString(returnDate),
      additionalServices,
      amount: bookingTotal.toFixed(2),
    };
    setBooking(booking);
    const bookingJson = JSON.stringify(booking);
    sessionStorage.setItem('booking', bookingJson);
    closeDrawer();
    navigate('/booking');
  };

  useEffect(() => {
    if (isDrawerOpen) {
      vehicleId && setValue('vehicleId', vehicleId as number);
      pickupLocationId && setValue('pickupLocationId', pickupLocationId as number);
      returnLocationId && setValue('returnLocationId', returnLocationId as number);
      additionalServices && setValue('additionalServices', additionalServices || []);

      !vehicleId &&
        handlePrebooking({
          key: 'vehicleId',
          data: vehicleId,
        });
      !pickupLocationId &&
        handlePrebooking({
          key: 'pickupLocationId',
          data: pickupLocationId,
        });
      !returnLocationId &&
        handlePrebooking({
          key: 'returnLocationId',
          data: returnLocationId,
        });

      handlePrebooking({
        key: 'isSameLocation',
        data: !!isSameLocation,
      });

      handlePrebooking({
        key: 'additionalServices',
        data: additionalServices || [],
      });

      if (Object.keys(prebooking).length > 0) {
        const data = JSON.stringify(prebooking);
        sessionStorage.setItem('prebooking', data);
      }
    }
  }, [isDrawerOpen]);
  useEffect(() => {
    if (isDrawerOpen) {
      setValue('pickupDate', pickupDate ? convertToPst(pickupDate) : convertToPst(defaultPickupDate));
      setValue('returnDate', returnDate ? convertToPst(returnDate) : convertToPst(defaultReturnDate));
      setMinDate(pickupDate ? pickupDate : defaultPickupDate);

      !pickupDate &&
        handlePrebooking({
          key: 'pickupDate',
          data: pickerDateESTToISOString(convertToPst(defaultPickupDate)),
        });

      !returnDate &&
        handlePrebooking({
          key: 'returnDate',
          data: pickerDateESTToISOString(convertToPst(defaultReturnDate)),
        });

      if (Object.keys(prebooking).length > 0) {
        const data = JSON.stringify(prebooking);
        sessionStorage.setItem('prebooking', data);
      }
    }
  }, [isDrawerOpen, pickupDate, returnDate]);

  useEffect(() => {
    if (Object.keys(prebooking).length > 0) {
      const data = JSON.stringify(prebooking);
      sessionStorage.setItem('prebooking', data);
    }
  }, [prebooking]);

  useEffect(() => {
    if (vehicleId) {
      !pickupLocationId && setValue('pickupLocationId', pickupLocations[0]?.id);
      !returnLocationId && !isSameLocation && setValue('returnLocationId', pickupLocations[0]?.id);
      !pickupLocationId &&
        handlePrebooking({
          key: 'pickupLocationId',
          data: pickupLocations[0]?.id,
        });
      !returnLocationId &&
        !isSameLocation &&
        handlePrebooking({
          key: 'returnLocationId',
          data: pickupLocations[0]?.id,
        });
      setValue('additionalServices', additionalServices || []);
    }
  }, [pickupLocationId, pickupLocations, returnLocationId, setValue, vehicleId, isSameLocation, additionalServices, handlePrebooking]);

  useEffect(() => {
    isSameLocation && setValue('returnLocationId', pickupLocationId as number);

    isSameLocation &&
      handlePrebooking({
        key: 'returnLocationId',
        data: pickupLocationId,
      });
  }, [getValues, isSameLocation, setValue, pickupLocationId, handlePrebooking]);

  useEffect(() => {
    minDate &&
      returnDate &&
      moment(typeof minDate === 'string' ? minDate : pickerDateESTToISOString(minDate)) > moment(returnDate) &&
      handlePrebooking({
        key: 'returnDate',
        data: typeof minDate === 'string' ? minDate : pickerDateESTToISOString(minDate),
      });
  }, [minDate]);

  useEffect(() => {
    if (isDrawerOpen) {
      setIsFormVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setIsFormVisible(false);
        clearTimeout(timeout);
      }, 500);
    }
  }, [isDrawerOpen]);

  const inputRef = useRef(null);

  // TODO: fix position for calendar, find another approach
  useEffect(() => {
    window.addEventListener('resize', adjustPopupContainerWidth);

    return () => {
      window.removeEventListener('resize', adjustPopupContainerWidth);
    };
  }, []);

  const adjustPopupContainerWidth = (): void => {
    const popperContainer = document.querySelector('.booking-form-date-popper') as HTMLElement;
    if (!popperContainer) {
      return;
    }

    const inputElement = inputRef.current ? (inputRef.current as HTMLElement) : null;
    const width = inputElement ? inputElement.getBoundingClientRect().width : 0;
    const calendarWidth = width && width > CALENDAR_MIN_WIDTH ? Math.floor(width) : CALENDAR_MIN_WIDTH;
    popperContainer.style.width = `${calendarWidth}px`;
  };

  const onCalendarOpen = (): void => {
    adjustPopupContainerWidth();
  };

  return (
    <>
      {isCarsBookIstLoading || isCarsLocationsIstLoading ? <Loader /> : null}
      <Drawer
        open={isDrawerOpen}
        direction="top"
        className={classes.drawer}
        overlayClassName={classes.overlay}
        lockBackgroundScroll={true}
        overlayOpacity={0.6}
      >
        <button className={classes.close} onClick={closeDrawer}>
          <Close />
        </button>
        <section className={classes.wrapper} id="booking-form-section">
          <div className={classes.header}>
            <Title className={classes.title} component="h2">
              Booking
            </Title>
          </div>
          {isFormVisible ? (
            <>
              <form className={classes.content} onSubmit={handleSubmit(onSubmit)}>
                <Column>
                  <Block>
                    <BlockTitle>Pick-up date</BlockTitle>
                    <div className={classes.input} ref={inputRef}>
                      <Controller
                        control={control}
                        name="pickupDate"
                        render={({ field }) => (
                          <ReactDatePicker
                            portalId="booking-form-section"
                            onCalendarOpen={onCalendarOpen}
                            popperClassName="booking-form-date-popper"
                            minDate={convertToPst(moment().toISOString())}
                            showTimeSelect
                            onChange={(date) => {
                              setMinDate(date as Date);
                              field.onChange(date);
                              handlePrebooking({
                                key: 'pickupDate',
                                data: pickerDateESTToISOString(date as Date),
                              });
                              trigger(['pickupDate', 'returnDate']);
                            }}
                            selected={field.value || convertToPst(defaultPickupDate)}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            onChangeRaw={(e) => e.preventDefault()}
                            onFocus={(e) => e.target.blur()}
                            renderCustomHeader={CustomHeader}
                            popperPlacement="bottom-start"
                          />
                        )}
                      />
                    </div>
                    {errors.pickupDate ? <p className={classes.error}>{errors.pickupDate.message}</p> : null}
                  </Block>
                  <Block>
                    <BlockTitle>Return date</BlockTitle>
                    <div className={classes.input}>
                      <Controller
                        control={control}
                        name="returnDate"
                        render={({ field }) => (
                          <ReactDatePicker
                            portalId="booking-form-section"
                            onCalendarOpen={onCalendarOpen}
                            popperClassName="booking-form-date-popper"
                            popperProps={{
                              positionFixed: true,
                              classes: 'test-classname-popper',
                            }}
                            showTimeSelect
                            minDate={typeof minDate === 'string' ? convertToPst(minDate) : minDate}
                            onChange={(date) => {
                              field.onChange(date);
                              handlePrebooking({
                                key: 'returnDate',
                                data: pickerDateESTToISOString(date as Date),
                              });
                              trigger(['pickupDate', 'returnDate']);
                            }}
                            selected={convertToPst(returnDate) || convertToPst(defaultReturnDate)}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            onChangeRaw={(e) => e.preventDefault()}
                            onFocus={(e) => e.target.blur()}
                            renderCustomHeader={CustomHeader}
                            popperPlacement="bottom-start"
                          />
                        )}
                      />
                    </div>
                    {errors.returnDate ? <p className={classes.error}>{errors.returnDate.message}</p> : null}
                  </Block>
                  <Block>
                    <BlockTitle>Choose car</BlockTitle>
                    <div className={classes.car}>
                      <Controller
                        name="vehicleId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={classes.select}
                            classNamePrefix="react-select"
                            components={{ DropdownIndicator: IndicatorIcon as any }}
                            options={carsBookingList || []}
                            menuPosition="fixed"
                            getOptionLabel={(option: any): string => {
                              return (
                                <div className={classes['select__cars-option']}>
                                  <div className={classes['select__cars-option-img']}>
                                    <img src={option.normalImageUrl} alt="image" width={90} height={61.538} />
                                  </div>
                                  <p className={classes['select__cars-option-text']}>
                                    <span className={classes['select__cars-option-title']}>{option.make + ' ' + option.model}</span>{' '}
                                    <span className={classes['select__cars-option-price']}>
                                      {Number(option.price) && option?.isAvailable ? formatCurrency(Number(option.price)) + '/day' : 'Unavailable'}
                                    </span>
                                  </p>
                                </div>
                              ) as unknown as string;
                            }}
                            getOptionValue={(option: any) => {
                              return option;
                            }}
                            isOptionDisabled={(option: any) => {
                              return !option?.isAvailable;
                            }}
                            isSearchable={false}
                            onChange={(value) => {
                              if (value) {
                                setValue('vehicleId', value.id);
                                handlePrebooking({
                                  key: 'vehicleId',
                                  data: value.id,
                                });
                              }
                            }}
                            value={vehicleId ? vehicle : undefined}
                            placeholder={
                              <div className={classes['select__cars-option']}>
                                <div className={classes['select__cars-option-img']}>
                                  <img src={carPlaceholder} alt="image" width={90} height={61.538} />
                                </div>
                                <span className={classes['select__cars-option-select-price']}>Select car</span>
                              </div>
                            }
                          />
                        )}
                      />
                      {!isCarsBookIstLoading && vehicleId && !vehicle?.isAvailable ? (
                        <p className={classes.car__unavailable}>This car is not available. Please choose another car or select other dates</p>
                      ) : null}
                    </div>
                  </Block>
                </Column>
                <div className={classes.divider}></div>
                <Column>
                  <Block>
                    <BlockTitle>Pick-up location</BlockTitle>
                    <div className={classes.location}>
                      <Controller
                        name="pickupLocationId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={classes.select}
                            classNamePrefix="react-select"
                            components={{ DropdownIndicator: IndicatorIcon as any }}
                            options={pickupLocations || []}
                            menuPosition="fixed"
                            getOptionLabel={(option: any): string =>
                              (
                                <div className={classes['select__location-option']}>
                                  <PinIcon />
                                  <p className={classes['select__location-option-text']}>
                                    <span className={classes['select__location-option-title']}>{option.address}</span>{' '}
                                    <span className={classes['select__location-option-price']}>
                                      ({Number(option.price) ? formatCurrency(Number(option.price)) : 'FREE'})
                                    </span>
                                  </p>
                                </div>
                              ) as unknown as string
                            }
                            getOptionValue={(option: any) => {
                              return option;
                            }}
                            onChange={(value) => {
                              setValue('pickupLocationId', value?.id as number);

                              handlePrebooking({
                                key: 'pickupLocationId',
                                data: value?.id,
                              });
                              isSameLocation && setValue('returnLocationId', value?.id as number);
                              isSameLocation &&
                                handlePrebooking({
                                  key: 'returnLocationId',
                                  data: value?.id,
                                });
                            }}
                            value={pickupLocations.find((location) => location.id === pickupLocationId) || pickupLocations[0]}
                            placeholder="Select location"
                            isDisabled={!vehicleId}
                            isSearchable={false}
                          />
                        )}
                      />

                      {pickupLocationId ? (
                        <a
                          className={classes.location__link}
                          href={`https://www.google.com/maps/search/?api=1&query=${pickupLocation?.address?.split(' ').join('+')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapIcon /> View on the Google Maps
                        </a>
                      ) : null}
                    </div>
                  </Block>
                  <div className={classes.return}>
                    <BlockTitle>Return location</BlockTitle>
                    <CustomCheckbox
                      checked={isSameLocation}
                      disabled={!vehicleId}
                      onChange={() => {
                        handlePrebooking({
                          key: 'isSameLocation',
                          data: !isSameLocation,
                        });
                        isSameLocation && setValue('returnLocationId', getValues('pickupLocationId'));

                        isSameLocation &&
                          handlePrebooking({
                            key: 'returnLocationId',
                            data: getValues('pickupLocationId'),
                          });
                      }}
                      label={<ListTitle>Same as Pick-up</ListTitle>}
                    />
                    <div className={classes.location}>
                      <Controller
                        name="returnLocationId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={classes.select}
                            classNamePrefix="react-select"
                            components={{ DropdownIndicator: IndicatorIcon as any }}
                            options={pickupLocations || []}
                            menuPosition="fixed"
                            getOptionLabel={(option: any): string =>
                              (
                                <div className={classes['select__location-option']}>
                                  <PinIcon />
                                  <p className={classes['select__location-option-text']}>
                                    <span className={classes['select__location-option-title']}>{option.address}</span>{' '}
                                    <span className={classes['select__location-option-price']}>
                                      ({Number(option.price) ? formatCurrency(Number(option.price)) : 'FREE'})
                                    </span>
                                  </p>
                                </div>
                              ) as unknown as string
                            }
                            getOptionValue={(option: any) => {
                              return option;
                            }}
                            onChange={(value) => {
                              setValue('returnLocationId', value?.id as number);
                              handlePrebooking({
                                key: 'returnLocationId',
                                data: value?.id,
                              });
                            }}
                            value={returnLocation || pickupLocations[0]}
                            isDisabled={!vehicleId || isSameLocation}
                            placeholder="Select location"
                            isSearchable={false}
                          />
                        )}
                      />

                      {returnLocationId ? (
                        <a
                          className={classes.location__link}
                          href={`https://www.google.com/maps/search/?api=1&query=${pickupLocations
                            ?.find((location) => location.id === returnLocationId)
                            ?.address?.split(' ')
                            .join('+')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapIcon /> View on the Google Maps
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <Block>
                    <BlockTitle>OWN INSURANCE</BlockTitle>
                    <p>Uploading ID card and declaration page will be on the next steps</p>
                  </Block>
                  {services ? (
                    <Block>
                      <BlockTitle>Additional Services</BlockTitle>
                      <div className={classes.services}>
                        {services.map((service: any) => {
                          const checked = additionalServices?.some((additionalService) => service.id === additionalService);
                          const onChange = (): void => {
                            const data = checked
                              ? additionalServices?.filter((additionalService) => additionalService !== service.id)
                              : [...(additionalServices as number[]), service.id];
                            handlePrebooking({
                              key: 'additionalServices',
                              data: data,
                            });
                          };
                          return (
                            <CustomCheckbox
                              key={service.id}
                              onChange={onChange}
                              checked={checked}
                              label={
                                <ListTitle>
                                  {service.name}{' '}
                                  <span>
                                    ({formatCurrency(Number(service.price))}
                                    {service.code === 'prepaidFuel' ? null : '/day'})
                                  </span>
                                </ListTitle>
                              }
                            />
                          );
                        })}
                      </div>
                    </Block>
                  ) : null}
                </Column>
                <div className={classes.divider}></div>
                <Column>
                  <Block>
                    <BlockTitle>Deposit</BlockTitle>
                    <p>
                      You’ll be charged a fully refundable deposit of $1000 when you book this car. It will be refunded after the trip ends without
                      incident.
                    </p>
                  </Block>
                  <Block>
                    <BlockTitle>Subtotal</BlockTitle>
                    <div className={classes.subtotal}>
                      <div className={classes.subtotal__row}>
                        <ListTitle>
                          Car rental <span>({vehicleId ? formatCurrency(Number(vehicle?.price)) : formatCurrency(0)}/day)</span>
                        </ListTitle>
                        <Price>{vehicleId ? formatCurrency(vehiclePrice) : formatCurrency(0)}</Price>
                      </div>
                      <div className={classes.subtotal__row}>
                        <ListTitle>Pick-up</ListTitle>
                        <Price>{pickupLocation && pickupLocationPrice ? formatCurrency(pickupLocationPrice) : 'FREE'}</Price>
                      </div>
                      <div className={classes.subtotal__row}>
                        <ListTitle>Return</ListTitle>
                        <Price>{returnLocation && returnLocationPrice ? formatCurrency(returnLocationPrice) : 'FREE'}</Price>
                      </div>
                      {additionalServices && additionalServices.length
                        ? services?.map((service: any) => {
                            const isExists = additionalServices.some((additionalService) => additionalService === service.id);
                            return isExists ? (
                              <div key={service.id} className={classes.subtotal__row}>
                                <ListTitle>
                                  {service.name}{' '}
                                  <span>
                                    ({formatCurrency(Number(service.price))}
                                    {service.code === 'prepaidFuel' ? null : '/day'})
                                  </span>
                                </ListTitle>
                                <Price>
                                  {isExists
                                    ? formatCurrency(Number(service.code === 'prepaidFuel' ? service.price : service.price * duration))
                                    : formatCurrency(0)}
                                </Price>
                              </div>
                            ) : null;
                          })
                        : null}

                      {vehicleId ? (
                        <div className={classes.subtotal__row}>
                          <ListTitle>
                            Processing Fee <span>({processingFee ? processingFee : 0}%)</span>
                          </ListTitle>
                          <Price>{formatCurrency(calculateFee(processingFee, bookingAmount))}</Price>
                        </div>
                      ) : null}
                    </div>
                  </Block>
                  <div className={`${classes.total} ${classes.total__desktop}`}>
                    <div className={classes.total__header}>
                      <BlockTitle>TOTAL</BlockTitle>
                      <BlockTitle>
                        {formatCurrency(bookingTotal)}
                        <span>
                          /{duration} {duration !== 1 ? 'days' : 'day'}
                        </span>
                      </BlockTitle>
                    </div>
                    <Button isDisabled={!vehicle?.isAvailable} textWeight="700" textUppercase={true} type="submit" fullWidth={true}>
                      Book Now
                    </Button>
                  </div>
                </Column>
              </form>
              <div className={`${classes.total} ${classes.total__mobile}`}>
                <div className={classes.total__header}>
                  <BlockTitle>TOTAL</BlockTitle>
                  <BlockTitle>
                    {formatCurrency(bookingTotal)}
                    <span>
                      /{duration} {duration !== 1 ? 'days' : 'day'}
                    </span>
                  </BlockTitle>
                </div>
                <Button
                  type="button"
                  onClick={() => handleSubmit(onSubmit)()}
                  isDisabled={!vehicle?.isAvailable}
                  textWeight="700"
                  textUppercase={true}
                >
                  Book Now
                </Button>
              </div>
            </>
          ) : null}
        </section>
      </Drawer>
    </>
  );
};

const CustomHeader = ({ date, decreaseMonth, increaseMonth }: any): JSX.Element => {
  return (
    <div className="custom-header">
      <button type="button" className="custom-prev-button" onClick={decreaseMonth}>
        <ArrowLeft />
      </button>
      <div className="custom-date">{date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
      <button type="button" className="custom-next-button" onClick={increaseMonth}>
        <ArrowRight />
      </button>
    </div>
  );
};
