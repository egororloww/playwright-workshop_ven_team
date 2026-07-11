import { ReactComponent as Icon1 } from '@icons/why-us/car.svg';
import { ReactComponent as Icon2 } from '@icons/why-us/crown.svg';
import { ReactComponent as Icon3 } from '@icons/why-us/quality.svg';
import { ReactComponent as Icon4 } from '@icons/why-us/join.svg';

export type ItemType = {
  icon: JSX.Element;
  title: string;
  text: string;
};

export type ListType = ItemType[];

export const list: ListType = [
  {
    icon: <Icon1 />,
    title: 'Our Fleet',
    text: 'At the heart of Elite Fleet Group is our meticulously curated collection of high-performance vehicles',
  },
  {
    icon: <Icon2 />,
    title: 'Premier Service',
    text: 'Personalized consultations to match you with the perfect car for your needs',
  },
  {
    icon: <Icon3 />,
    title: 'Unmatched Quality',
    text: 'Each car undergoes rigorous maintenance and thorough inspection',
  },
  {
    icon: <Icon4 />,
    title: 'Join the Elite',
    text: "With Elite Fleet Group you're indulging in an elite experience that sets a new standard in luxury car rentals",
  },
];
