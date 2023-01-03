import React from 'react'
import './NewSale.scss'

import { action } from 'mobx'
import { Observer } from 'mobx-react'

import { Classes, Dialog, Button } from '@blueprintjs/core'

import { POSStage, CartStoreContext, cartStore as store, MakeSale } from './store'

import { CartListPanel } from './CartListPanel'
import { AddItemPanel } from './AddItemPanel'
import { FinancialsPanel } from './FinancialsPanel'

import { CheckoutConfirmDialog } from './CheckoutConfirmDialog'

const onDialogCofirm = action(() => {
  store.stage = POSStage.PostCheckout;
  MakeSale(store).then(action(() => {
    store.clear();
    store.stage = POSStage.Idle;
  }));
});

const onDialogClose = action(() => {
  store.stage = POSStage.Idle;
});

export const NewSaleView = () => {
  return (
    <CartStoreContext.Provider value={store}>
      <div className='new-sale-view'>
        <CartListPanel />
        <AddItemPanel />
        <FinancialsPanel />
      </div>

      <Observer>
        {() => (
          <CheckoutConfirmDialog
            store={store}
            isOpen={store.stage == POSStage.Checkout}
            onConfirm={onDialogCofirm}
            onClose={onDialogClose}
          />
        )}
      </Observer>

    </CartStoreContext.Provider>
  );
}

