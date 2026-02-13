import { useLocation } from 'react-router-dom';
import Header from './Header/Header';

const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/client') || location.pathname.startsWith('/agent') || location.pathname.startsWith('/admin');

  return (
    <div>
      {!isDashboard && <Header />}
      {children}
    </div>
  );
};

export default Layout;
