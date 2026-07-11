import React, { useState } from 'react';

import EmailStep from '@components/Modal/ForgotPassword/steps/EmailStep.tsx';
import { ForgotPasswordProvider } from '@components/Modal/ForgotPassword/ForgotPasswordContext.tsx';
import CodeStep from '@components/Modal/ForgotPassword/steps/CodeStep.tsx';
import NewPasswordStep from '@components/Modal/ForgotPassword/steps/NewPasswordStep.tsx';

type Props = {
  goBack: () => void;
};

const ForgotPassword: React.FC<Props> = ({ goBack }) => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <ForgotPasswordProvider>
      {currentStep === 1 && <EmailStep setCurrentStep={setCurrentStep} cancelResetPassword={goBack} />}
      {currentStep === 2 && <CodeStep setCurrentStep={setCurrentStep} />}
      {currentStep === 3 && <NewPasswordStep setCurrentStep={setCurrentStep} />}
    </ForgotPasswordProvider>
  );
};

export default ForgotPassword;
