import React from "react";
import "./CheckoutConfirmDialog.scss";

import cn from "classnames";

import { Classes, Dialog, Button } from "@blueprintjs/core";

import { numberWithCommas, useStores } from "./common";

const ItemsTable = () => {
  const { cartStore } = useStores();

  return (
    <table className="items-table">
      <colgroup>
        <col className="cell-num" />
        <col className="cell-item" />
        <col className="cell-price" />
        <col className="cell-qty" />
        <col className="cell-subtotal" />
      </colgroup>
      <thead>
        <tr>
          <th className="cell-num">#</th>
          <th className="cell-item">Item</th>
          <th className="cell-price">Price</th>
          <th className="cell-qty">Qty</th>
          <th className="cell-subtotal">TTL.</th>
        </tr>
      </thead>
      <tbody>
        {cartStore.items.map((itCart, index) => (
          <tr>
            <td className="cell-num">{index + 1}</td>
            <td className="cell-item">{itCart.rawItem.name}</td>
            <td className="cell-price">{itCart.price}</td>
            <td className="cell-qty">{itCart.realQuantity}</td>
            <td className="cell-subtotal">{itCart.subtotal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface ICheckoutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export const CheckoutConfirmDialog: React.FC<ICheckoutConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { cartStore: store } = useStores();

  return (
    <Dialog
      canOutsideClickClose={false}
      canEscapeKeyClose={true}
      enforceFocus={true}
      shouldReturnFocusOnClose={false}
      usePortal={true}
      lazy={false}
      isOpen={isOpen}
      onClose={onClose}
      // isOpen={true}
      // onClose={() => {}}

      title="Checkout"
      style={{
        width: "75%",
        minWidth: "700px",
      }}
      icon="highlight"
      isCloseButtonShown={true}
    >
      <div className={cn(Classes.DIALOG_BODY, "checkout-view")}>
        <div className="panel-items table-reponsive">
          <ItemsTable />
        </div>

        <div className="panel-stats">
          <div className="box-row">
            <div className="box box">
              <p className="title">Item Count</p>
              <p className="value">{numberWithCommas(store.itemCount)}</p>
            </div>
            <div className="box box-1">
              <p className="title">Bill Amount</p>
              <p className="value">{numberWithCommas(store.billAmount)}</p>
            </div>
            <div className="box box-2">
              <p className="title">Discount</p>
              <p className="value">{numberWithCommas(store.discount)}</p>
            </div>
            <div className="box box-3">
              <p className="title">Total Payable</p>
              <p className="value">{numberWithCommas(store.payable)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onConfirm} intent="success">
            Confirm Sale
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
