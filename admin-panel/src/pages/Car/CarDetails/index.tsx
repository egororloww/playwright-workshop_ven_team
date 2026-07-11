import { useOutletContext } from 'react-router-dom';
import { FeaturesBadge, InfoWrapper, Typography } from '@/components';
import { CarDetailsType } from '@/services/types/cars';
import classes from './index.module.scss';
import { formatCurrency } from '@/services/helpers';

export const CarDetails = (): JSX.Element => {
  const { carDetails }: { carDetails: CarDetailsType } = useOutletContext();

  return (
    <InfoWrapper>
      <div className={classes.wrapper}>
        <div className={classes.info}>
          <div className={classes.info__row}>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Make
              </Typography>
              <Typography size="md" textWeight="500" color="dark-080">
                {carDetails.make}
              </Typography>
            </div>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Model
              </Typography>
              <Typography size="md" textWeight="500" color="dark-080">
                {carDetails.model}
              </Typography>
            </div>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Price per day
              </Typography>
              <Typography size="md" textWeight="500" color="dark-080">
                {formatCurrency(carDetails.price)}
              </Typography>
            </div>
          </div>
          <div className={classes.info__row}>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Fuel type
              </Typography>
              <Typography size="md" textWeight="500" color="dark-080">
                {carDetails.fuelType}
              </Typography>
            </div>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Doors
              </Typography>
              <Typography size="md" textWeight="500" color="dark-080">
                {carDetails.doors}
              </Typography>
            </div>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Seats
              </Typography>
              <Typography size="md" textWeight="500" color="dark-080">
                {carDetails.seats}
              </Typography>
            </div>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Age limit
              </Typography>
              <Typography size="md" textWeight="500" color="dark-080">
                {carDetails.ageLimit}
              </Typography>
            </div>
          </div>
        </div>
        <div className={classes.description}>
          <div className={`${classes.block} ${classes.description__text}`}>
            <Typography size="sm" textWeight="600" color="dark-040" component="h3">
              Description
            </Typography>
            <Typography size="md" textWeight="500" color="dark-080">
              {carDetails.description}
            </Typography>
          </div>
          <div className={`${classes.block} ${classes.description__images}`}>
            <Typography size="sm" textWeight="600" color="dark-040" component="h3">
              Listing images
            </Typography>
            <div className={classes.images}>
              <div className={classes.block}>
                <Typography size="md" textWeight="500" color="dark-080">
                  Normal
                </Typography>
                <div className={classes.images__image}>
                  <img src={carDetails.normalImageUrl} alt="Normal image" width={127} />
                </div>
              </div>
              <div className={classes.block}>
                <Typography size="md" textWeight="500" color="dark-080">
                  Hover
                </Typography>
                <div className={classes.images__image}>
                  <img src={carDetails.hoverImageUrl} alt="Hover image" width={127} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.block}>
          <Typography size="sm" textWeight="600" color="dark-040" component="h3">
            Features
          </Typography>
          {carDetails.features.length ? (
            <div className={classes.features}>
              {carDetails.features.map((feature) => (
                <FeaturesBadge key={feature.id} feature={feature.name} />
              ))}
            </div>
          ) : (
            <Typography size="md" textWeight="500" color="dark-080">
              -
            </Typography>
          )}
        </div>

        <div className={classes.block}>
          <Typography size="sm" textWeight="600" color="dark-040" component="h3">
            Gallery images
          </Typography>
          <div className={classes.gallery}>
            <div className={classes.block}>
              <Typography size="md" textWeight="500" color="dark-080">
                Main
              </Typography>
              <div className={classes.gallery__image}>
                <img src={carDetails.thirdResizedMainImageUrl} alt="Main image" width={127} />
              </div>
            </div>
            <div className={classes.block}>
              <Typography size="md" textWeight="500" color="dark-080">
                Others
              </Typography>
              {carDetails.galleryImages.length ? (
                <div className={classes.gallery__list}>
                  {carDetails.galleryImages.map((image) => (
                    <div className={classes.gallery__image}>
                      <img src={image.thirdResizedImageUrl} alt="Gallery image" width={127} />
                    </div>
                  ))}
                </div>
              ) : (
                <Typography size="md" textWeight="500" color="dark-080">
                  -
                </Typography>
              )}
            </div>
          </div>
        </div>
      </div>
    </InfoWrapper>
  );
};
