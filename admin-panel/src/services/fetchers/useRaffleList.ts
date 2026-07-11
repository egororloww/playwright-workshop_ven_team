import { useAxios } from '@api/useAxios.ts';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';
import { RaffleType } from '../types/user';

export const useRaffleList = (): { winnersList: RaffleType[] } => {
  const { api } = useAxios();
  async function fetchRaffleList(): Promise<RaffleType[]> {
    const {
      data: { raffles },
    }: { data: { raffles: RaffleType[] } } = await api.get(`/raffles/winners`);
    return raffles;
  }
  const { data: winnersList }: UseSuspenseQueryResult<RaffleType[], Error> = useSuspenseQuery({
    queryKey: ['raffle', 'list'],
    queryFn: fetchRaffleList,
  });
  return { winnersList };
};
