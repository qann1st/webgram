import { Navigate, Outlet } from 'react-router';

const AuthOutlet = ({ isAuth }: { isAuth: boolean }) => {
  return isAuth ? <Navigate to="/messages" /> : <Outlet />;
};

export default AuthOutlet;
