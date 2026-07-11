import React from 'react';
import MailchimpSubscribe from 'react-mailchimp-subscribe';

type ComponentProps = {
  url: string;
};

export const MailchimpFormContainer = ({ url, children }: React.PropsWithChildren<ComponentProps>): JSX.Element => {
  return (
    <MailchimpSubscribe
      url={url}
      render={({ subscribe, status, message }) => {
        const props = {
          status,
          message,
          onValidated: (formData: never): void => subscribe(formData),
        };
        return React.Children.map(children, (child) =>
          React.cloneElement(
            child as React.ReactElement<React.ReactNode>,
            {
              props,
            },
            null
          )
        );
      }}
    />
  );
};
