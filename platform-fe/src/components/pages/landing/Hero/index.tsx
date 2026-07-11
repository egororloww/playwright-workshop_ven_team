import { Button, Container, Line } from '@/components';
import { ReactComponent as TextAnimation } from '@icons/text.svg';
import carOffWebp from '@images/hero/off/Img_Headlights_Off.webp';
import carOffPng from '@images/hero/off/Img_Headlights_Off.png';
import carOffWebpMd from '@images/hero/off/Img_Headlights_Off_md.webp';
import carOffPngMd from '@images/hero/off/Img_Headlights_Off_md.png';
import carOffWebpXs from '@images/hero/off/Img_Headlights_Off_xs.webp';
import carOffPngXs from '@images/hero/off/Img_Headlights_Off_xs.png';

import carOnWebp from '@images/hero/on/Img_Headlights_On.webp';
import carOnPng from '@images/hero/on/Img_Headlights_On.png';
import carOnWebpMd from '@images/hero/on/Img_Headlights_On_md.webp';
import carOnPngMd from '@images/hero/on/Img_Headlights_On_md.png';
import carOnWebpXs from '@images/hero/on/Img_Headlights_On_xs.webp';
import carOnPngXs from '@images/hero/on/Img_Headlights_On_xs.png';
import classes from './index.module.scss';
import { useDrawer } from '@/context/hooks/useDrawer';

export const Hero = (): JSX.Element => {
  const { openDrawer } = useDrawer();

  return (
    <Container>
      <div className={classes.body}>
        <div className={classes.header}>
          <TextAnimation />
        </div>
        <div className={`${classes.image}`}>
          <picture>
            <source media="(min-width: 800px)" srcSet={carOffWebp} type="image/webp" />
            <source media="(min-width: 800px)" srcSet={carOffPng} />
            <source media="(min-width: 480px)" srcSet={carOffWebpMd} type="image/webp" />
            <source media="(min-width: 480px)" srcSet={carOffPngMd} />
            <source srcSet={carOffWebpXs} type="image/webp" />
            <img className={`${classes.image__default}`} src={carOffPngXs} alt="Car Image" width={1140} height={450} />
          </picture>

          <picture>
            <source media="(min-width: 800px)" srcSet={carOnWebp} type="image/webp" />
            <source media="(min-width: 800px)" srcSet={carOnPng} />
            <source media="(min-width: 480px)" srcSet={carOnWebpMd} type="image/webp" />
            <source media="(min-width: 480px)" srcSet={carOnPngMd} />
            <source srcSet={carOnWebpXs} type="image/webp" />
            <img className={`${classes.image__active}`} src={carOnPngXs} alt="Car Image" width={1140} height={450} />
          </picture>
        </div>
        <Line>
          <Button onClick={openDrawer} textUppercase={true} fullWidth={false} size="lg">
            Book Now
          </Button>
        </Line>
      </div>
    </Container>
  );
};
