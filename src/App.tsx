import { BrowserRouter } from 'react-router-dom';
import Drawer from './Drawer';
import CustomToaster from './components/CustomToaster';

function App() {
  return (
    <>
    <CustomToaster />
    <BrowserRouter>
      <Drawer />
    </BrowserRouter>
  </>
  );
}

export default App;