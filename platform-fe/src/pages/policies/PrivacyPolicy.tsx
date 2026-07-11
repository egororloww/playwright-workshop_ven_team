import { Container, Line, PageWrapper, Title } from '@/components';
import { privacyPolicy } from './data';
import classes from './index.module.scss';
import { useEffect } from 'react';

export const PrivacyPolicy = (): JSX.Element => {
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
              Privacy Policy
            </Title>
          </Line>

          <div className={classes.content} dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
        </div>
      </PageWrapper>
    </Container>
  );
};
