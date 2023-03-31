import React from "react";
import "./NewSale.scss";

import { action } from "mobx";
import { Observer } from "mobx-react";

import { POSStage, CartStoreContext, rootStore, MakeSale } from "./store";

import { CartListPanel } from "./CartListPanel";
import { AddItemPanel } from "./AddItemPanel";
import { FinancialsPanel } from "./FinancialsPanel";

import { CheckoutConfirmDialog } from "./CheckoutConfirmDialog";

const { cartStore, invStore } = rootStore;

const onDialogCofirm = action(() => {
  cartStore.stage = POSStage.PostCheckout;
  MakeSale(cartStore).then(
    action(() => {
      cartStore.clear();
      cartStore.stage = POSStage.Idle;
    })
  );
});

const onDialogClose = action(() => {
  cartStore.stage = POSStage.Idle;
});

export const NewSaleView = () => {
  React.useEffect(() => {
    invStore.fetchAvailableItems().then(() => {
      /*
      cartStore.addItem(invStore.allItems[0]);
      cartStore.addItem(invStore.allItems[1]);
      cartStore.addItem(invStore.allItems[2]);
      cartStore.addItem(invStore.allItems[2]);
      cartStore.addItem(invStore.allItems[3]);
      */
    });
  }, []);
  return (
    <CartStoreContext.Provider value={rootStore}>
      <div className="new-sale-view">
        <CartListPanel />
        <AddItemPanel />
        <FinancialsPanel />
      </div>

      <Observer>
        {() => (
          <CheckoutConfirmDialog
            store={cartStore}
            isOpen={cartStore.stage == POSStage.Checkout}
            onConfirm={onDialogCofirm}
            onClose={onDialogClose}
          />
        )}
      </Observer>
    </CartStoreContext.Provider>
  );
};
