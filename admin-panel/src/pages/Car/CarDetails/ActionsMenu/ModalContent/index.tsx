import { Button, Typography } from '@/components';
import classes from './index.module.scss';
import { useAxios } from '@api/useAxios.ts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type ComponentProps = {
  closeModal: () => void;
  carName: string;
  carId?: number | string;
};

const ModalContent = ({ closeModal, carId, carName }: ComponentProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { api } = useAxios();
  async function deleteCar(carId: string | number): Promise<{ message: string }> {
    const {
      data: { message },
    }: { data: { message: { message: string } } } = await api.delete(`/vehicles/${carId}`);
    return message;
  }

  const handleDelete = (): void => {
    setIsLoading(true);
    deleteCar(carId as string)
      .then(() => {
        navigate('/cars');
      })
      .catch(() => {
        toast.error('The vehicle has active bookings. Please finalize the bookings first', {
          autoClose: 7000,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={classes.modal}>
      <Typography component="h2" size="lg" textWeight="700" color="dark">
        Delete car
      </Typography>
      <Typography component="p" size="md" textWeight="500" color="dark-080">
        Are you sure you want to delete {carName}?
      </Typography>
      <div className={classes.actions}>
        <Button disabled={isLoading} onClick={closeModal} fullWidth={false} textColor="accent" color="white" size="md">
          Cancel
        </Button>
        <Button onClick={handleDelete} disabled={isLoading} fullWidth={false} size="md">
          Yes, Delete
        </Button>
      </div>
    </div>
  );
};

export default ModalContent;
