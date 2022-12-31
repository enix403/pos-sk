import React from 'react'
import './NewSale.scss'

import { CartListPanel } from './CartListPanel'
import { AddItemPanel } from './AddItemPanel'
import { FinancialsPanel } from './FinancialsPanel'

export const NewSaleView = () => {
  return (
    <div className='new-sale-view'>
      <CartListPanel />
      <AddItemPanel />
      <FinancialsPanel />
    </div>
  );
}
