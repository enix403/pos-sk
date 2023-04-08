import React from "react";
import "./NewSale.scss";

import { action } from "mobx";
import { Observer } from "mobx-react";

import { POSStage, CartStoreContext, rootStore, MakeSale } from "./store";

import { CartListPanel } from "./CartListPanel";
import { AddItemPanel } from "./AddItemPanel";
import { FinancialsPanel } from "./FinancialsPanel";

import { CheckoutConfirmDialog } from "./CheckoutConfirmDialog";
import { Units } from "@shared/contracts/unit";

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

function fillRandomCart() {
  const fracItem = invStore.allItems.find((it) =>
    Units.fromSlug(it.item.unit)?.isFractional()
  );

  for (let i = 0; i < 50; ++i) {
    let index = Math.floor(Math.random() * invStore.allItems.length);
    cartStore.addItem(invStore.allItems[index]);
    if (fracItem !== undefined && Math.random() < 0.1) {
      cartStore.addItem(fracItem);
    }
  }
}

export const NewSaleView = () => {
  React.useEffect(() => {
    invStore.fetchAvailableItems().then(() => {
      fillRandomCart();
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
            isOpen={cartStore.stage == POSStage.Checkout}
            onConfirm={onDialogCofirm}
            onClose={onDialogClose}
          />
        )}
      </Observer>
    </CartStoreContext.Provider>
  );
};
