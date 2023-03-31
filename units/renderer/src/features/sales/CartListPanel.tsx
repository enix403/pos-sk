import React from 'react'

import { action } from 'mobx'
import { observer } from 'mobx-react'

import {
  Tag,
  NumericInput,
  Button,
  NonIdealState,
  ControlGroup
} from '@blueprintjs/core'

import { financialInputProps } from './common'
import { CartItem, CartStoreContext } from './store'

import type { IStoreItemAttribute } from '@shared/contracts/IStoreItem'
import { getActiveCurrency } from '@shared/commonutils'
import { PIECE_UNIT, fromSlug as unitFromSlug} from '@shared/contracts/IStoreItem'

function buildAttrFragment(attr: IStoreItemAttribute, index: number) {
  return (
    <React.Fragment key={index}>
      { index != 0 ? ' - ' : null }
      <span style={{color: "#6c757d"}}>{attr.name}:</span>
      {' '}
      {attr.value}
    </React.Fragment>
  );
}

interface QuantityInputProps {
  v: any,
  setV: any,
  tag?: any | undefined,
  invalid: (v: number) => boolean,
  [s: string]: any
}
const QuantityInput = ({v, setV, tag, invalid, ...rest}: QuantityInputProps) => (
  <NumericInput
    {...financialInputProps}
    {...rest}
    intent={invalid(v) ? 'danger' : 'none' }
    className="number-bold-input"
    rightElement={tag}
    placeholder={"Qty"}
    value={v}
    onValueChange={setV}
    fill={true}
  />
);

function RenderQuantityInput(item: CartItem) {
  const unit = item.unitDesc;

  if (unit.subUnit == null) {
    return (
       <QuantityInput
         v={item.quantity}
         setV={p => item.setQuantity(p)}
         tag={<Tag minimal intent="primary">PCs</Tag>}
         invalid={v => v <= 0}
       />
    );
  } else {
    return (
      <ControlGroup fill>
        <QuantityInput
          v={item.quantity}
          setV={p => item.setQuantity(p)}
          tag={<Tag minimal intent="primary">{unit.slug}</Tag>}
          invalid={() => item.realQuantity <= 0}
        />
        <QuantityInput
          v={item.subQuantity}
          setV={p => item.setSubQuantity(p)}
          invalid={() => item.realQuantity <= 0}
          tag={<Tag minimal intent="warning">{unit.subUnit}</Tag>}
          stepSize={250}
          majorStepSize={250}
        />
      </ControlGroup>
    );
  }
}

function attributesString(alist: IStoreItemAttribute[]) {
  if (alist.length == 0)
    return <></>;

  return (
    <>({alist.map(buildAttrFragment)})</>
  );
}

const CartItemView = observer(({ item }: { item: CartItem }) => (
  <tr>
    <td className="quantity">
      {RenderQuantityInput(item)}
    </td>
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
        minimal outlined
        onClick={() => item.quantityInc()}
        className="margin-r-m"
      />
      <Button
        icon="minus"
        intent="primary"
        minimal outlined
        disabled={item.quantity <= 1}
        onClick={() => item.quantityDec()}
        className="margin-r-m"
      />
      <Button
        icon="cross"
        intent="danger"
        minimal outlined
        onClick={() => item.remove()}
      />
    </td>
  </tr>
));


export const CartListPanel = observer(() => {

  const { cartStore: store } = React.useContext(CartStoreContext)!;

  return (
    <div className="cart-panel">
      {store.items.length == 0 ?
        <NonIdealState
          icon={'shopping-cart'}
          title={"No item added"}
        /> :
        <table className="cart-item-list" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Qty</th>
              <th className="fitwidth alcenter">Price<br /><small>({getActiveCurrency()})</small> </th>
              <th>Item</th>
              <th className="alcenter">Actions</th>
            </tr>
          </thead>
          <tbody>
            {store.items.map(item => <CartItemView item={item} key={item.rawItem.id} />)}
          </tbody>
        </table>
      }
    </div>
  );
});
