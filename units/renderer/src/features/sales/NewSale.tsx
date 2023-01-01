import React from 'react'
import './NewSale.scss'

import { action } from 'mobx'
import { Observer } from 'mobx-react'

import { Classes, Dialog, Button } from '@blueprintjs/core'

import { POSStage, CartStoreContext, cartStore } from './store'

import { CartListPanel } from './CartListPanel'
import { AddItemPanel } from './AddItemPanel'
import { FinancialsPanel } from './FinancialsPanel'

import { CheckoutConfirmDialog } from './CheckoutConfirmDialog'

export const NewSaleView = () => {
  return (
    <CartStoreContext.Provider value={cartStore}>
      <div className='new-sale-view'>
        <CartListPanel />
        <AddItemPanel />
        <FinancialsPanel />
      </div>

      <Observer>
        {() => (
          <CheckoutConfirmDialog
            isOpen={cartStore.stage == POSStage.Checkout}
            onClose={action(() => {
              /* TODO: Invoke proper action */
              cartStore.stage = POSStage.Idle;
              // cartStore.clear();
            })}
          />
        )}
      </Observer>

    </CartStoreContext.Provider>
  );
}

