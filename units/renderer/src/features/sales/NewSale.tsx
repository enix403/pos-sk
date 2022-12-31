import React from 'react'
import './NewSale.scss'

import { observer } from 'mobx-react'

import { CartStoreContext, cartStore } from './store'

import { CartListPanel } from './CartListPanel'
import { AddItemPanel } from './AddItemPanel'
import { FinancialsPanel } from './FinancialsPanel'

export const NewSaleView = () => {
  return (
    <CartStoreContext.Provider value={cartStore}>
      <div className='new-sale-view'>
        <CartListPanel />
        <AddItemPanel />
        <FinancialsPanel />
      </div>
    </CartStoreContext.Provider>
  );
}

