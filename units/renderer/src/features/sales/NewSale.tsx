import React from "react";
import "./NewSale.scss";

import { Overlay, Spinner } from "@blueprintjs/core";

import { action } from "mobx";
import { Observer } from "mobx-react";

import { POSStage, CartStoreContext, rootStore, MakeSale } from "./store";

import { CartListPanel } from "./CartListPanel";
import { AddItemPanel } from "./AddItemPanel";
import { FinancialsPanel } from "./FinancialsPanel";
import { CheckoutConfirmDialog } from "./CheckoutConfirmDialog";
import { OutOfStockDialog } from "./OutOfStockDialog";

import { simpleSuccessAlert, simpleErrorAlert } from "@/utils";
import { Units } from "@shared/contracts/unit";

const { cartStore, invStore } = rootStore;

const onDialogCofirm = action(() => {
  cartStore.stage = POSStage.PostCheckout;
  MakeSale(cartStore).then(
    action((success) => {
      cartStore.stage = POSStage.Idle;
      if (success) {
        cartStore.clear();
        simpleSuccessAlert("Sale done");
      } else {
        simpleErrorAlert("Could not perform sale");
      }
    })
  );
});

const onDialogClose = action(() => {
  cartStore.stage = POSStage.Idle;
});

function fillRandomCart() {
  const fracItem = invStore.allItems.find((it) =>
    Units.fromSlug(it.unit)?.isFractional()
  );

  for (let i = 0; i < 3; ++i) {
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
      cartStore.clear();
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
          <Overlay
            canEscapeKeyClose={false}
            canOutsideClickClose={false}
            usePortal={true}
            isOpen={cartStore.stage == POSStage.PostCheckout}
          >
            <div className="ui-spinner">
              <Spinner intent="danger" size={190} />
            </div>
          </Overlay>
        )}
      </Observer>

      <OutOfStockDialog isOpen={false} onClose={() => {}} />

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
