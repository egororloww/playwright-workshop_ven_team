import { Button, Container, PageWrapper, Title } from '@/components';
import { Link } from 'react-router-dom';
import image from '@images/404.png';
import classes from './index.module.scss';
export const NotFound = (): JSX.Element => {
  return (
    <PageWrapper contentPosition="center">
      <Container>
        <div className={classes.content}>
          <div className={classes.image}>
            <img src={image} alt="404" width={741} height={356} />
          </div>
          <Title textUppercase={false} className={classes.title}>
            Page not found
          </Title>
          <p className={classes.text}>Oops! Looks like the page you were looking for doesn’t exist</p>
          <Button fullWidth={false} component={Link} to="/" variant="outlined" textGradient="white" textColor="white">
            Back to Home Page
          </Button>
        </div>
      </Container>
    </PageWrapper>
  );
};
