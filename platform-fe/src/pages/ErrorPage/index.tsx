import { Container, PageWrapper, Title } from '@/components';
import image from '@images/error.png';
import classes from './index.module.scss';
export const ErrorPage = (): JSX.Element => {
  return (
    <PageWrapper contentPosition="center">
      <Container>
        <div className={classes.content}>
          <div className={classes.image}>
            <img src={image} alt="404" width={481} height={358} />
          </div>
          <Title textUppercase={false} className={classes.title}>
            Oops, something went wrong
          </Title>
          <p className={classes.text}>Please refresh the page or check your connection</p>
        </div>
      </Container>
    </PageWrapper>
  );
};
