import React from 'react';
import { render} from './setupTests.js'
import RegisterConfirm from "../components/RegisterConfirm"


test('renders RegisterConfirm component', () => {
    render(<RegisterConfirm/>);
    
  });