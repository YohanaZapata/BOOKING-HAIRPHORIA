import React from 'react';
import { render, fireEvent } from './setupTests.js'
import AddCategorie from "../components/AddCategorie"

test('renders AddCategorie component', () => {
  render(<AddCategorie />);
  
});
