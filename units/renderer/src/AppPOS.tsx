import React from 'react';

import { NewSaleView } from '@/features/sales/NewSale'

import { renderApp } from './AppBase';

export const AppPOS = () => {
  return (
    <NewSaleView />
  );
};

renderApp(<AppPOS />);
