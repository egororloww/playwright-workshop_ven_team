import { Container, Line, PageWrapper, Title } from '@/components';
import { termsAndConditions } from './data';
import classes from './index.module.scss';
import { useEffect } from 'react';

export const TermsAndConditions = (): JSX.Element => {
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
              Terms and Conditions
            </Title>
          </Line>
          <div className={classes.content} dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
        </div>
      </PageWrapper>
    </Container>
  );
};
