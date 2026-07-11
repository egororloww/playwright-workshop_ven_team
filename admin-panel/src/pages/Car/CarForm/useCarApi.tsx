import { useAxios } from '@api/useAxios.ts';
import { CreateCarResponse } from '@services/types/cars.ts';

type PromiseReturn = {
  message: string;
};

type useCarApiReturn = {
  createCar: (data: FormData) => Promise<CreateCarResponse>;
  editCar: (data: FormData) => Promise<PromiseReturn>;
  galleryAdd: (data: FormData) => Promise<PromiseReturn>;
  galleriesDelete: (data: { ids: number[] }) => Promise<PromiseReturn>;
};

const useCarApi = ({ carId }: { carId?: string }): useCarApiReturn => {
  const { api, apiFormData } = useAxios();
  async function createCar(data: FormData): Promise<CreateCarResponse> {
    const {
      data: { vehicles },
    }: { data: { vehicles: CreateCarResponse } } = await apiFormData.post('/vehicles', data);
    return vehicles;
  }
  async function editCar(data: FormData): Promise<{ message: string }> {
    const {
      data: { message },
    }: { data: { message: { message: string } } } = await apiFormData.put(`/vehicles/${carId}`, data);
    return message;
  }

  async function galleryAdd(data: FormData): Promise<{ message: string }> {
    const {
      data: { message },
    }: { data: { message: { message: string } } } = await apiFormData.post('/vehiclesGallery/', data);
    return message;
  }

  async function galleriesDelete(data: { ids: number[] }): Promise<{ message: string }> {
    const {
      data: { message },
    }: { data: { message: { message: string } } } = await api.delete(`/vehiclesGallery/`, { data });
    return message;
  }

  return { createCar, editCar, galleryAdd, galleriesDelete };
};

export default useCarApi;
