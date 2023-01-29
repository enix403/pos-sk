import React from 'react'
import './CheckoutConfirmDialog.scss'

import cn from 'classnames'

import { Classes, Dialog, Button } from '@blueprintjs/core'

import { numberWithCommas, StatRow } from './common'
import type { CartStore } from './store'

const ItemsTable = () => (
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
      <tr>
        <td className="cell-num">1</td>
        <td className="cell-item">Toothbrush</td>
        <td className="cell-price">120</td>
        <td className="cell-qty">3</td>
        <td className="cell-subtotal">360</td>
      </tr>
      <tr>
        <td className="cell-num">2</td>
        <td className="cell-item">RIO Biscuit</td>
        <td className="cell-price">40</td>
        <td className="cell-qty">2</td>
        <td className="cell-subtotal">80</td>
      </tr>
      <tr>
        {/*<td className="cell-num">999</td>*/}
        <td className="cell-num">9</td>
        <td className="cell-item">Rooh-Afza</td>
        <td className="cell-price">770</td>
        <td className="cell-qty">1</td>
        <td className="cell-subtotal">770</td>
      </tr>
    </tbody>
  </table>
);

interface ICheckoutConfirmDialogProps {
  store: CartStore;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export const CheckoutConfirmDialog: React.FC<ICheckoutConfirmDialogProps> = ({
  store,
  isOpen,
  onClose,
  onConfirm
}) => {
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
        width: '75%', minWidth: '700px',
      }}
      icon="highlight"
      isCloseButtonShown={true}
    >
      <div className={cn(Classes.DIALOG_BODY, 'checkout-view')}>

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
          <Button onClick={onConfirm} intent="success">Confirm Sale</Button>
        </div>
      </div>
    </Dialog>
  );
}
