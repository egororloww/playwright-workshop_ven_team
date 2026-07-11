import { Container, PageWrapper, Title } from '@/components/index.ts';
import { PaymentFormTest } from '../PaymentFormTest/index.tsx';
import classes from './index.module.scss';

export const PaymentContentTest = (): JSX.Element => {
  return (
    <PageWrapper>
      <Container>
        <div className={classes.content}>
          <Title className={classes.title}>Payment</Title>
          <PaymentFormTest />
        </div>
      </Container>
    </PageWrapper>
  );
};
