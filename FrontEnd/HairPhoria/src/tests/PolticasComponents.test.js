import React from 'react';
import { render, fireEvent } from './setupTests.js'

import PoliticasComponents from '../components/PoliticasComponents.jsx';

test('renders PoliticasComponents component', () => {
  render(<PoliticasComponents />);
  
});
