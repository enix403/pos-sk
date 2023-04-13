import React from "react";
import "./NewSale.scss";

import { Overlay, Spinner } from "@blueprintjs/core";

import { action, makeAutoObservable, runInAction } from "mobx";
import { Observer } from "mobx-react";

import { POSStage, CartStoreContext, rootStore, MakeSale } from "./store";

import { CartListPanel } from "./CartListPanel";
import { AddItemPanel } from "./AddItemPanel";
import { FinancialsPanel } from "./FinancialsPanel";
import { CheckoutConfirmDialog } from "./CheckoutConfirmDialog";
import { OutOfStockDialog } from "./OutOfStockDialog";

import { simpleSuccessAlert, simpleErrorAlert } from "@/utils";
import { Units } from "@shared/contracts/unit";
import { MSG } from "@shared/communication";

const { cartStore, invStore } = rootStore;

class OTSStore {
  dialogShown = false;
  items: MSG.Sale.OutStockItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  showDialog() {
    this.dialogShown = true;
    cartStore.stage = POSStage.ItemsOutOfStock;
  }

  closeDialog() {
    this.dialogShown = false;
    cartStore.stage = POSStage.Idle;
  }
}
const otsStore = (window["otsStore"] = new OTSStore());

const onDialogCofirm = action(async () => {
  cartStore.stage = POSStage.PostCheckout;

  const saleRes = await MakeSale(cartStore);

  cartStore.stage = POSStage.Idle;

  if (saleRes === null) {
    simpleErrorAlert("Could not perform sale");
    return;
  }

  const saleData = saleRes.data!;

  if (saleData.result == MSG.Sale.SaleResult.ItemsOutOfStock) {
    runInAction(() => {
      otsStore.items = saleData.out_stock_items;
      otsStore.showDialog();
    });
  } else {
    otsStore.dialogShown = false;
    cartStore.clear();
    simpleSuccessAlert("Sale done");
  }
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

      <Observer>
        {() => (
          <OutOfStockDialog
            isOpen={otsStore.dialogShown}
            items={otsStore.items}
            onClose={() => otsStore.closeDialog()}
          />
        )}
      </Observer>

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
