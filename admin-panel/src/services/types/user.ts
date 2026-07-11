export interface User {
  id: number;
  email: string;
  role: 'user';
  sub: string;
}

export type RaffleType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
};
