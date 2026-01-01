import { Route, Routes } from 'react-router-dom';
import Login from './screens/Login';
import Files from './screens/Files';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/files" element={<Files />} />
    </Routes>
  );
}
