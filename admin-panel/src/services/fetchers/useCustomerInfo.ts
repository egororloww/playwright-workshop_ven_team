import { useAxios } from '@/api/useAxios';
import { UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';
import { CustomerInfoType } from '@services/types/customers';

export const useCustomerInfo = (customerId: string): { customer: CustomerInfoType } => {
  const { api } = useAxios();
  async function fetchCustomer(): Promise<CustomerInfoType> {
    const {
      data: { users },
    }: { data: { users: CustomerInfoType } } = await api.get(`/users/${customerId}/customer/admin`);
    return users;
  }
  const { data: customer }: UseSuspenseQueryResult<CustomerInfoType, Error> = useSuspenseQuery({
    queryKey: ['customers', customerId],
    queryFn: fetchCustomer,
  });
  return { customer };
};
