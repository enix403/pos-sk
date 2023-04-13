import React from "react";

import styles from "./OutOfStockDialog.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

import { Classes, Dialog, Button } from "@blueprintjs/core";

const Table = () => {
  return (
    <div className={cx("table-wrapper", "ots-table")}>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty Requested</th>
              <th>Qty Available</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={cx("item")}>Cleaner</td>
              <td className={cx("qty")}>13</td>
              <td className={cx("qty")}>2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface ICheckoutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export const OutOfStockDialog: React.FC<ICheckoutConfirmDialogProps> = ({
  isOpen,
  onClose,
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
      title="Items out of stock"
      style={{
        width: "50%",
        minWidth: "700px",
      }}
      icon="waterfall-chart"
      isCloseButtonShown={true}
    >
      <div className={cx(Classes.DIALOG_BODY)}>
        <div className="margin-b-l">The following items are out of stock</div>
        <Table />
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onClose} intent="warning">
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
