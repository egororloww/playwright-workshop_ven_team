import { createContext, PropsWithChildren, useState } from 'react';

type StateType = {
  email?: string;
  code?: string;
};

type ContextType = {
  state: StateType;
  updateState: (state: StateType) => void;
};

export const ForgotPasswordContext = createContext<ContextType>({} as ContextType);

export const ForgotPasswordProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [state, setState] = useState({});

  const updateState = (object = {}): void => {
    setState((prevState) => ({ ...prevState, ...object }));
  };
  return <ForgotPasswordContext.Provider value={{ updateState, state }}>{children}</ForgotPasswordContext.Provider>;
};
