/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Container, Line, Loader, Title } from '@/components';
import { ReactComponent as Logo } from '@icons/text.svg';

import { MutationFunction, UseSuspenseQueryResult, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import moment from 'moment-timezone';
import classes from './index.module.scss';
import { useAxios } from '@/api/useAxios';
import { useEffect, useState } from 'react';
import { formatPhoneNumber } from '@/services/helpers';

type RaffleType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
};
type RafflesType = {
  raffles: RaffleType[];
};

export const RaffleResults = (): JSX.Element => {
  const [error, setError] = useState(false);
  const queryClient = useQueryClient();
  const { api } = useAxios();

  function formatDate(date: Date): string {
    return moment(date).tz('UTC').format('DD MMM, YYYY, hh:mm A');
  }

  async function fetchResults(): Promise<RaffleType[]> {
    const {
      data: { raffles },
    }: { data: RafflesType } = await api.get(`/raffles/winners`);
    return raffles;
  }
  const { data, isLoading }: UseSuspenseQueryResult<RaffleType[], Error> = useSuspenseQuery({
    queryKey: ['results'],
    queryFn: fetchResults,
    staleTime: Infinity,
  });

  async function generateUser(): Promise<any> {
    await api.post('/raffles/winners/generate');
  }

  const { mutate, isPending } = useMutation({
    mutationFn: generateUser as unknown as MutationFunction<unknown>,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['results'],
        refetchType: 'all',
        exact: true,
      });
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error({ error });
      setError(true);
    },
  });

  useEffect(() => {
    let timeout: number | undefined;
    timeout = setTimeout(() => {
      setError(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  return (
    <Container>
      {isLoading || isPending ? <Loader /> : null}
      <div className={classes.wrapper}>
        <div className={classes.logo}>
          <Logo />
        </div>
        <div className={classes.title}>
          <Line position="both">
            <Title>winners</Title>
          </Line>
          <div className={classes.actions}>
            <Button disabled={isLoading || isPending} onClick={mutate} className={classes.button} textUppercase={true} textWeight="700">
              Select Winner
            </Button>
            {error ? <span className={classes.actions__error}>All participants of this raffle were already selected as winners</span> : null}
          </div>
        </div>
        {data && data.length ? (
          <div className={classes.results}>
            <div className={classes.table}>
              <ul className={classes.table__head}>
                <li>Time</li>
                <li>First Name</li>
                <li>Last Name</li>
                <li>Email</li>
                <li>Phone Number</li>
              </ul>

              {data.map((result) => (
                <ul className={classes.table__content}>
                  <li>{formatDate(result.createdAt)}</li>
                  <li>{result.firstName}</li>
                  <li>{result.lastName}</li>
                  <li>{result.email}</li>
                  <li>{formatPhoneNumber(result.phoneNumber)}</li>
                </ul>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Container>
  );
};
