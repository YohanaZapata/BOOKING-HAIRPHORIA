import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
 import { prettyDOM } from'@testing-library/dom/';







const AllTheProviders = ({ children }) => {
  return <Router>{children}</Router>;
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });
  
  

 
export * from '@testing-library/react';
export * from '@testing-library/jest-dom/extend-expect';
export { customRender as render };