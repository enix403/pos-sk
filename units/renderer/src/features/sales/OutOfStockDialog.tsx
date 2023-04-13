import React from "react";

import styles from "./OutOfStockDialog.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

import { Classes, Dialog, Button } from "@blueprintjs/core";
import { MSG } from "@shared/communication";
import { IStoreItem } from "@shared/contracts/IStoreItem";
import { Quantity, Units } from "@shared/contracts/unit";
import { renderQuantity } from "./common";

function renderQtyFromEfv(item: IStoreItem, efvVal: number): React.ReactNode {
  let unit = Units.fromSlug(item.unit)!;

  let qty = new Quantity(unit, 0, 0).setEffectiveVal(efvVal);

  return renderQuantity(qty);
}

type TableProps = {
  items: MSG.Sale.OutStockItem[];
};
const Table = ({ items }: TableProps) => {
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
            {items.map((it) => (
              <tr>
                <td className={cx("item")}>{it.item.name}</td>
                <td className={cx("qty")}>
                  {renderQtyFromEfv(it.item, it.requested)}
                </td>
                <td className={cx("qty")}>
                  {renderQtyFromEfv(it.item, it.available)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface ICheckoutConfirmDialogProps {
  isOpen: boolean;
  items: MSG.Sale.OutStockItem[];
  onClose: () => void;
}
export const OutOfStockDialog: React.FC<ICheckoutConfirmDialogProps> = ({
  isOpen,
  items,
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
        <Table items={items} />
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
