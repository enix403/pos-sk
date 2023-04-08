import React from "react";

import { action } from "mobx";
import { observer } from "mobx-react";

import {
  Tag,
  NumericInput,
  Button,
  NonIdealState,
  ControlGroup,
} from "@blueprintjs/core";

import { financialInputProps } from "./common";
import { CartItem, CartStoreContext } from "./store";

import type { IStoreItemAttribute } from "@shared/contracts/IStoreItem";
import { getActiveCurrency } from "@shared/commonutils";

function buildAttrFragment(attr: IStoreItemAttribute, index: number) {
  return (
    <React.Fragment key={index}>
      {index != 0 ? " - " : null}
      <span style={{ color: "#6c757d" }}>{attr.name}:</span> {attr.value}
    </React.Fragment>
  );
}

interface QuantityInputProps {
  v: any;
  setV: any;
  tag?: any | undefined;
  invalid: (v: number) => boolean;
  [s: string]: any;
}
const QuantityInput = ({
  v,
  setV,
  tag,
  invalid,
  ...rest
}: QuantityInputProps) => (
  <NumericInput
    {...financialInputProps}
    {...rest}
    intent={invalid(v) ? "danger" : "none"}
    className="number-bold-input"
    rightElement={tag}
    placeholder={"Qty"}
    value={v}
    onValueChange={setV}
    fill={true}
    buttonPosition="none"
  />
);

function RenderQuantityInput(item: CartItem) {
  // const unit = item.unitDesc;
  const qty = item.quantity;

  const STEPS = 4;

  let parts = qty.unit.getFractionalParts();
  let step = qty.unit.getFractionalParts() / STEPS;

  if (!qty.unit.isFractional()) {
    return (
      <QuantityInput
        v={qty.base}
        setV={(p) => item.setQuantity(p)}
        tag={
          <Tag minimal intent="primary">
            {qty.unit.shortName}
          </Tag>
        }
        invalid={(v) => v <= 0}
      />
    );
  } else {
    return (
      <ControlGroup fill>
        <QuantityInput
          v={qty.base}
          setV={(p) => item.setQuantity(p)}
          tag={
            <Tag minimal intent="primary">
              {qty.unit.shortName}
            </Tag>
          }
          invalid={() => item.realQuantity <= 0}
        />
        <QuantityInput
          v={qty.fractional}
          setV={action((p: number) => {
            if (p == parts) {
              item.quantityInc();
              item.setSubQuantity(0);
            } else if (p == -1 && item.quantity.base > 0) {
              item.quantityDec();
              item.setSubQuantity(step * (STEPS - 1));
            } else {
              item.setSubQuantity(Math.max(0, p));
            }
          })}
          invalid={() => item.realQuantity <= 0}
          tag={
            <Tag minimal intent="warning">
              {qty.unit.getFractionalName()}
            </Tag>
          }
          stepSize={step}
          majorStepSize={step}
          max={parts}
          min={-1}
        />
      </ControlGroup>
    );
  }
}

function attributesString(alist: IStoreItemAttribute[]) {
  if (alist.length == 0) return <></>;

  return <>({alist.map(buildAttrFragment)})</>;
}

const CartItemView = observer(({ item }: { item: CartItem }) => (
  <tr>
    <td className="quantity">{RenderQuantityInput(item)}</td>
    <td className="itm-price fitwidth alcenter">
      <strong>{item.price}</strong>
    </td>
    <td>
      <span className="itm-name">{item.rawItem.name}</span>
      <span className="itm-attrs">
        {attributesString(item.rawItem.attributes as [IStoreItemAttribute])}
      </span>
    </td>
    <td className="padding-v-s fitwidth itm-buttons">
      <Button
        icon="plus"
        intent="success"
        minimal
        outlined
        onClick={() => item.quantityInc()}
        className="margin-r-m"
      />
      <Button
        icon="minus"
        intent="primary"
        minimal
        outlined
        disabled={item.quantity.base <= 1}
        onClick={() => item.quantityDec()}
        className="margin-r-m"
      />
      <Button
        icon="cross"
        intent="danger"
        minimal
        outlined
        onClick={() => item.remove()}
      />
    </td>
  </tr>
));

export const CartListPanel = observer(() => {
  const { cartStore: store } = React.useContext(CartStoreContext)!;

  return (
    <div className="cart-panel">
      {store.items.length == 0 ? (
        <NonIdealState icon={"shopping-cart"} title={"No item added"} />
      ) : (
        <table className="cart-item-list" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Qty</th>
              <th className="fitwidth alcenter">
                Price
                <br />
                <small>({getActiveCurrency()})</small>{" "}
              </th>
              <th>Item</th>
              <th className="alcenter">Actions</th>
            </tr>
          </thead>
          <tbody>
            {store.items.map((item) => (
              <CartItemView item={item} key={item.rawItem.id} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
});
