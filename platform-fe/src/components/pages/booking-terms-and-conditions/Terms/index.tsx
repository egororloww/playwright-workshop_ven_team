import { Button } from '@/components';
import { terms } from './terms';
import { CustomCheckbox } from '@/components/BookingForm/CustomCheckbox';
import classes from './index.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const Terms = (): JSX.Element => {
  const [isChecked, setIsChecked] = useState<boolean>(!!sessionStorage.getItem('termsAgreed'));
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(!sessionStorage.getItem('termsRead'));
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isCheckboxDisabled) {
            setIsCheckboxDisabled(false);
          }
        });
      },
      { threshold: 0, rootMargin: '0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isCheckboxDisabled, sectionRef]);

  useEffect(() => {
    isChecked ? sessionStorage.setItem('termsAgreed', JSON.stringify(true)) : sessionStorage.removeItem('termsAgreed');
  }, [isChecked]);

  useEffect(() => {
    !isCheckboxDisabled ? sessionStorage.setItem('termsRead', JSON.stringify(true)) : sessionStorage.removeItem('termsRead');
  }, [isCheckboxDisabled]);

  return (
    <div className={classes.terms}>
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <div className={classes.content}>
            <div dangerouslySetInnerHTML={{ __html: terms }} />
            <div className={classes.flag} ref={sectionRef}></div>
          </div>
        </div>
        <div className={classes.check}>
          <CustomCheckbox
            checked={isChecked}
            disabled={isCheckboxDisabled}
            onChange={() => {
              setIsChecked(!isChecked);
            }}
            label={<span className={classes.label}>I agree to the terms and conditions</span>}
          />
          <p>We will also send a copy of the terms and conditions to your email.</p>
        </div>
      </div>

      <Button
        component={Link}
        to="/booking/payment"
        textUppercase={true}
        textWeight="700"
        isDisabled={!isChecked}
        fullWidth={true}
        className={classes.button}
      >
        Continue
      </Button>
    </div>
  );
};
