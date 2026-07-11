/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-console */

import { ReactNode, useEffect, useRef, useState } from 'react';
import classes from './index.module.scss';
import { useAxios } from '@/api/useAxios.ts';
import { MutationFunction, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from '@/components/index.ts';
import * as yup from 'yup';
import { ErrorTokenResponse, SuccessTokenResponse } from '@components/pages/payment/PaymentForm/type.ts';
import { style } from '@components/pages/payment/PaymentForm/style.ts';

const schema = yup.object().shape({
  streetAddress: yup.string().required('Street Address is required'),
  zipCode: yup.string().required('Zip code is required'),
  amount: yup.string().matches(/^\d+(\.\d{1,2})?$/, 'Amount is not valid'),
});

declare global {
  interface Window {
    GlobalPayments: any;
  }
}

type FormDataType = {
  amount?: string;
  streetAddress?: string;
  zipCode?: string;
};

export const PaymentFormTest = (): ReactNode => {
  const { api } = useAxios();
  const queryClient = useQueryClient();
  const formDataRef = useRef<FormDataType>({});

  const [loading, setLoading] = useState(false);
  const [fieldErrorMsg, setIsErrorMsg] = useState('');

  async function handlePay(bookingData: any): Promise<any> {
    const { data } = await api.post('/transactions/pay/heartland/test', bookingData);
    return data;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handlePay as unknown as MutationFunction<any, any>,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['bookings', 'list'],
        refetchType: 'all',
      });
      setLoading(false);
      setIsErrorMsg('');
    },
    onError: () => {
      setIsErrorMsg(
        'Unable to process the payment. Please check your card details and try again. Contact your payment provider if the problem continues'
      );
    },
  });

  const onTokenSuccess = (response: SuccessTokenResponse): void => {
    const paymentToken = response.paymentReference;

    schema
      .validate(formDataRef.current)
      .then(() => {
        const data = {
          paymentToken,
          amount: Number(formDataRef.current.amount),
          billingAddress: {
            zipCode: formDataRef.current.zipCode,
            streetAddress: formDataRef.current.streetAddress,
          },
        };

        mutate(data);
      })
      .catch((err: { message: string }) => {
        setIsErrorMsg(err?.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!window.GlobalPayments as any) {
      return;
    }

    window.GlobalPayments.configure({
      publicApiKey: import.meta.env.VITE_APP_HEARTLAND_KEY,
    });

    // Create Form
    const cardForm = window.GlobalPayments.ui.form({
      fields: {
        'card-number': {
          placeholder: '•••• •••• •••• ••••',
          target: '#credit-card-card-number',
          format: 16,
        },
        'card-expiration': {
          placeholder: 'MM / YYYY',
          target: '#credit-card-card-expiration',
        },
        'card-cvv': {
          placeholder: '•••',
          target: '#credit-card-card-cvv',
        },
        'card-holder-name': {
          placeholder: 'Jane Smith',
          target: '#credit-card-card-holder',
        },
        submit: {
          value: 'Submit',
          target: '#credit-card-submit',
        },
      },
      styles: style,
    });

    // form-level event handlers. examples:
    cardForm.ready(() => {
      console.log('Registration of all credit card fields occurred');
    });
    cardForm.on('token-success', onTokenSuccess);
    cardForm.on('token-error', (response: ErrorTokenResponse) => {
      console.log(response.reasons);
      console.error(response.error ? response.reasons[0].message : '');
      setIsErrorMsg(
        'Unable to process the payment. Please check your card details and try again. Contact your payment provider if the problem continues'
      );
      setLoading(false);
    });

    cardForm.on('click', () => {
      setLoading(true);
    });
  }, []);

  const handeInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = target;
    formDataRef.current = {
      ...formDataRef.current,
      [name]: value,
    };
  };

  return (
    <div className={`${classes['form-wrapper']} form-wrapper`}>
      {loading || isPending ? <Loader /> : null}
      <form className={classes.form} id="payment-form">
        <div className={`${classes['form-row']} form-row`}>
          <label className={classes.label} htmlFor="credit-card-card-number">
            card number
          </label>
          <div id="credit-card-card-number" className={classes['input-wrapper']} />
        </div>
        <div className={`${classes['form-row']} ${classes['form-row_short']} form-row`}>
          <label className={classes.label} htmlFor="credit-card-card-expiration">
            Card expiration
          </label>
          <div id="credit-card-card-expiration" className={classes['input-wrapper']} />
        </div>
        <div className={`${classes['form-row']} ${classes['form-row_short']} form-row`}>
          <label className={classes.label} htmlFor="credit-card-card-cvv">
            Security code
          </label>
          <div id="credit-card-card-cvv" className={classes['input-wrapper']} />
        </div>
        <div className={`${classes['form-row']} form-row`}>
          <label className={classes.label} htmlFor="amount">
            Card holder name
          </label>
          <div id="credit-card-card-holder" className={classes['input-wrapper']} />
        </div>
        <div className={`${classes['form-row']} form-row`}>
          <label className={classes.label} htmlFor="amount">
            Amount
          </label>
          <input step={0.01} type="number" className={classes.zip} required name="amount" placeholder="Amount" onChange={handeInputChange} />
        </div>
        <div className={`${classes['form-row']} form-row`}>
          <h3 className={`${classes.label} ${classes.label__title}`}>Billing info</h3>
        </div>
        <div className={`${classes['form-row']} form-row`}>
          <label className={classes.label} htmlFor="zip">
            Zip code
          </label>
          <input type="number" className={classes.zip} required name="zipCode" placeholder="Postal code" onChange={handeInputChange} />
        </div>
        <div className={`${classes['form-row']} form-row`}>
          <label className={classes.label} htmlFor="streetAddress">
            Street address
          </label>
          <input type="string" className={classes.zip} required name="streetAddress" placeholder="Street address" onChange={handeInputChange} />
        </div>

        {fieldErrorMsg ? <span className={classes.error}>{fieldErrorMsg}</span> : null}
        <div id="credit-card-submit" className={classes.button} />
      </form>
    </div>
  );
};
