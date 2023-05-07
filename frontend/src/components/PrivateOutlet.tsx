import { Navigate, Outlet } from 'react-router';

const PrivateOutlet = ({ isAuth }: { isAuth: boolean }) => {
  return isAuth ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateOutlet;
