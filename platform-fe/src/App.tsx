import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
