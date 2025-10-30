import AppRoutes from './AppRoutes'; // <-- IMPORT YOUR NEW ROUTES
import ToastProvider from './components/UI/ToastProvider/ToastProvider';

function App() {
  return (
    <div className="bg-white text-gray-800">
      <ToastProvider />
      <AppRoutes /> {/* <-- RENDER YOUR ROUTES HERE */}
    </div>
  );
}

export default App;