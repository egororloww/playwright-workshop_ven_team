import { useAxios } from '@/api/useAxios';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';
import { CustomerListType, CustomerType, DataCustomerListType } from '@services/types/customers';

export const useCustomersList = (): { customersList: CustomerType[] } => {
  const { api } = useAxios();
  async function fetchCustomersList(): Promise<CustomerListType> {
    const {
      data: { users },
    }: { data: DataCustomerListType } = await api.get(`/users/customer/list/admin`);
    return users;
  }
  const { data: customersList }: UseSuspenseQueryResult<CustomerListType, Error> = useSuspenseQuery({
    queryKey: ['customers', 'list'],
    queryFn: fetchCustomersList,
  });
  return { customersList };
};
