import { Container, FAQ, Line, PageWrapper, Title } from '@/components';
import { useEffect } from 'react';
import classes from './index.module.scss';
import { faq } from './data';

export const FAQPage = (): JSX.Element => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <Container>
      <PageWrapper>
        <div className={classes.body}>
          <Line>
            <Title component="h1" className={classes.title}>
              FAQ
            </Title>
          </Line>
          <FAQ items={faq} />
        </div>
      </PageWrapper>
    </Container>
  );
};
