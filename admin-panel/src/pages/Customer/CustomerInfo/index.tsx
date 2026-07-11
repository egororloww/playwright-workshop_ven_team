import { useOutletContext } from 'react-router-dom';
import { CustomerInfoType } from '@/services/types/customers';
import { CopyToClipboardButton, InfoWrapper, PdfView, Typography } from '@/components';
import classes from './index.module.scss';

export const CustomerInfo = (): JSX.Element => {
  const { customer }: { customer: CustomerInfoType } = useOutletContext();

  return (
    <InfoWrapper>
      <div className={classes.wrapper}>
        <div className={classes.data}>
          <Typography size="regular">General</Typography>
          <div className={classes.info}>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                First name
              </Typography>
              <Typography size="md" textWeight="500">
                {customer.firstName}
              </Typography>
            </div>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Last name
              </Typography>
              <Typography size="md" textWeight="500">
                {customer.lastName}
              </Typography>
            </div>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Phone number
              </Typography>
              <div className={classes.block__copy}>
                <Typography textUnderline={true} component="a" href={`tel:${customer.phoneNumber}`} size="md" textWeight="500">
                  {customer.phoneNumber}
                </Typography>
                <CopyToClipboardButton text={customer.phoneNumber} />
              </div>
            </div>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Email
              </Typography>
              <div className={classes.block__copy}>
                <Typography textUnderline={true} component="a" href={`mailto:${customer.email}`} size="md" textWeight="500">
                  {customer.email}
                </Typography>
                <CopyToClipboardButton text={customer.email} />
              </div>
            </div>
          </div>
        </div>

        <div className={classes.data}>
          <Typography size="regular">Documents</Typography>
          <div className={classes.documents}>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Driver license
              </Typography>
              {customer.driverLicenseImage1Url ? (
                customer.driverLicenseImage1Url.includes('.pdf') ? (
                  <PdfView fileName={customer.driverLicenseImage1OriginalKey} fileLink={customer.driverLicenseImage1Url} />
                ) : (
                  <div className={`${classes.image} ${classes.image__card}`}>
                    <div className={`${classes.block__image} ${classes.block__image_card}`}>
                      <img src={customer.driverLicenseImage1Url} alt="image" width={167} />
                    </div>
                  </div>
                )
              ) : (
                '-'
              )}
            </div>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Driver license
              </Typography>

              {customer.driverLicenseImage2Url ? (
                customer.driverLicenseImage2Url.includes('.pdf') ? (
                  <PdfView fileName={customer.driverLicenseImage2OriginalKey} fileLink={customer.driverLicenseImage2Url} />
                ) : (
                  <div className={`${classes.image} ${classes.image__card}`}>
                    <div className={`${classes.block__image} ${classes.block__image_card}`}>
                      <img src={customer.driverLicenseImage2Url} alt="image" width={167} />
                    </div>
                  </div>
                )
              ) : (
                '-'
              )}
            </div>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Insurance card
              </Typography>

              {customer.insuranceCardImageUrl ? (
                customer.insuranceCardImageUrl.includes('.pdf') ? (
                  <PdfView fileName={customer.insuranceCardImageOriginalKey} fileLink={customer.insuranceCardImageUrl} />
                ) : (
                  <div className={`${classes.image} ${classes.image__card}`}>
                    <div className={`${classes.block__image} ${classes.block__image_card}`}>
                      <img src={customer.insuranceCardImageUrl} alt="image" width={167} />
                    </div>
                  </div>
                )
              ) : (
                '-'
              )}
            </div>
            <div className={classes.block}>
              <Typography size="sm" textWeight="600" color="dark-040" component="h3">
                Declaration page
              </Typography>

              {customer.insuranceDeclarationPageImageUrl ? (
                customer.insuranceDeclarationPageImageUrl.includes('.pdf') ? (
                  <PdfView fileName={customer.insuranceDeclarationPageImageOriginalKey} fileLink={customer.insuranceDeclarationPageImageUrl} />
                ) : (
                  <div className={`${classes.image} ${classes.image__card}`}>
                    <div className={`${classes.block__image} ${classes.block__image_page}`}>
                      <img src={customer.insuranceDeclarationPageImageUrl} alt="image" width={167} />
                    </div>
                  </div>
                )
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>
      </div>
    </InfoWrapper>
  );
};
