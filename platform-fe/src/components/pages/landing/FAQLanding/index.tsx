import { Container, FAQ, Line, Title } from '@/components';
import { ReactNode } from 'react';
import { faq } from './data';
import classes from './index.module.scss';

export const FAQLanding = (): ReactNode => (
  <Container maxWidth="md">
    <div className={classes.body}>
      <Line>
        <Title component="h2">FAQ</Title>
      </Line>
      <FAQ items={faq} />
    </div>
  </Container>
);

export default FAQLanding;
