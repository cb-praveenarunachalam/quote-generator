import { useEffect } from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { useLocation } from 'react-router';

const AppNavBar = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, [location]);

  return (
    <Navbar expand="lg" className="bg-body-custom" sticky="top" variant='dark'>
      <Container>
        <Navbar.Brand href="/" className='nav-brand'>
          <img className='company-logo' src='/public/cn-logo-white.svg' />
          <h4 className='company-name'>VilAI</h4>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default AppNavBar;
