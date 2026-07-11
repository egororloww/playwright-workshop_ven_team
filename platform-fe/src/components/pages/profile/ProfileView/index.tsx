import { formatPhoneNumber } from '@/services/helpers';
import classes from '../index.module.scss';

import { useGetProfile } from '@/services/hooks/useGetProfile';
import { AccentButton } from '@/components';
import { Link } from 'react-router-dom';
import { PdfView } from './PdfView';

export const ProfileView = (): JSX.Element => {
  const { data } = useGetProfile({
    queryKey: ['profile'],
    endpoint: '/users/profile/customer',
  });

  return (
    <div className={classes.profile}>
      <div className={classes.information}>
        <div className={classes.information__row}>
          <div className={classes.information__block}>
            <h3 className={classes.information__title}>First name</h3>
            <p className={classes.information__text}>{data.firstName}</p>
          </div>
          <div className={classes.information__block}>
            <h3 className={classes.information__title}>Last name</h3>
            <p className={classes.information__text}>{data.lastName}</p>
          </div>
        </div>
        <div className={classes.information__row}>
          <div className={classes.information__block}>
            <h3 className={classes.information__title}>Email</h3>
            <p className={classes.information__text}>{data.email}</p>
          </div>
          <div className={classes.information__block}>
            <h3 className={classes.information__title}>Phone number</h3>
            <p className={classes.information__text}>{formatPhoneNumber(data.phoneNumber)}</p>
          </div>
        </div>
      </div>
      <div className={classes.documents}>
        <div className={classes.documents__block}>
          <h3 className={classes.documents__title}>driver license</h3>
          {!data.driverLicenseImage1Url && !data.driverLicenseImage2Url ? (
            <div className={classes.documents__license}>
              <p>There are no scans of your driver license</p>
              <AccentButton textUppercase={true} textWeight="700" component={Link} to="edit">
                Attach Driver License
              </AccentButton>
            </div>
          ) : (
            <div className={classes.documents__images}>
              {data.driverLicenseImage1Url ? (
                <div className={`${classes.image} ${classes.image__card}`}>
                  {data.driverLicenseImage1Url.includes('.pdf') ? (
                    <PdfView fileName={data.driverLicenseImage1OriginalKey} fileLink={data.driverLicenseImage1Url} />
                  ) : (
                    <img src={data.driverLicenseImage1Url} width={175.503} height={110} />
                  )}
                </div>
              ) : null}
              {data.driverLicenseImage2Url ? (
                <div className={`${classes.image} ${classes.image__card}`}>
                  {data.driverLicenseImage2Url.includes('.pdf') ? (
                    <PdfView fileName={data.driverLicenseImage2OriginalKey} fileLink={data.driverLicenseImage2Url} />
                  ) : (
                    <img src={data.driverLicenseImage2Url} width={175.503} height={110} />
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
        <div className={classes.documents__block}>
          <h3 className={classes.documents__title}>insurance</h3>
          {!data.insuranceCardImageUrl && !data.insuranceDeclarationPageImageUrl ? (
            <div className={classes.documents__license}>
              <p>There are no scans of your insurance</p>
              <AccentButton textUppercase={true} textWeight="700" component={Link} to="edit">
                Attach Insurance
              </AccentButton>
            </div>
          ) : (
            <div className={classes.documents__images}>
              {data.insuranceDeclarationPageImageUrl ? (
                <div className={classes.imageWrapper}>
                  <h3 className={classes.imageTitle}>Declaration page</h3>
                  <div className={`${classes.image} ${classes.image__page}`}>
                    {data.insuranceDeclarationPageImageUrl.includes('.pdf') ? (
                      <PdfView fileName={data.insuranceDeclarationPageImageOriginalKey} fileLink={data.insuranceDeclarationPageImageUrl} />
                    ) : (
                      <img src={data.insuranceDeclarationPageImageUrl} width={175.503} height={212} />
                    )}
                  </div>
                </div>
              ) : null}
              {data.insuranceCardImageUrl ? (
                <div className={classes.imageWrapper}>
                  <h3 className={classes.imageTitle}>Insurance card</h3>
                  <div className={`${classes.image} ${classes.image__card}`}>
                    {data.insuranceCardImageUrl.includes('.pdf') ? (
                      <PdfView fileLink={data.insuranceCardImageUrl} fileName={data.insuranceCardImageOriginalKey} />
                    ) : (
                      <img src={data.insuranceCardImageUrl} width={175.503} height={110} />
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
