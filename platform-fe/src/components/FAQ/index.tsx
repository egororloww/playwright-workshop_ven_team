import { ReactNode } from 'react';
import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import classes from './index.module.scss';

type ArrowProps = {
  id: number;
};

type ItemsProps = {
  header: string;
  content: string | ReactNode;
};

export const FAQ = ({ items }: { items: ItemsProps[] }): JSX.Element => (
  <div className={classes.accordion}>
    <Accordion transition transitionTimeout={300}>
      {items.map(({ header, content }: ItemsProps, i: number) => (
        <AccordionItem
          header={
            <div className={classes.header}>
              <span className={classes.title}>{header}</span>
              <span className={classes.arrow}>
                <Arrow id={i} />
              </span>
            </div>
          }
          key={i}
        >
          {content}
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

const Arrow = ({ id }: ArrowProps): JSX.Element => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke={`url(#paint0_linear_2010_15381_${id})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id={`paint0_linear_2010_15381_${id}`} x1="12" y1="9" x2="12" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff99" />
          <stop offset="1" stopColor="#ffffff99" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default FAQ;
