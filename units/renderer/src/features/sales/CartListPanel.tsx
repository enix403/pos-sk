import React from 'react'

import { action } from 'mobx'
import { observer } from 'mobx-react'

import {
  Tag,
  NumericInput,
  Button,
  NonIdealState
} from '@blueprintjs/core'

import { financialInputProps } from './common'
import { CartItem, CartStoreContext } from './store'

import type { IStoreItemAttribute } from '@shared/contracts/IStoreItem'

function buildAttrFragment(attr: IStoreItemAttribute, index: number) {
  return (
    <React.Fragment key={index}>
      { index != 0 ? ' - ' : null }
      <strong>{attr.name}:</strong>
      {' '}
      {attr.value}
    </React.Fragment>
  );
}

const CartItemView = observer(({ item }: { item: CartItem }) => (
  <div className='cart-item'>
    <NumericInput
      {...financialInputProps}
      intent={item.quantity <= 0 ? 'danger' : 'none' }
      className="quantity number-bold-input"
      rightElement={<Tag minimal intent="primary">x Rs. {item.price}</Tag>}
      placeholder={"Qty"}
      value={item.quantity}
      onValueChange={p => item.setQuantity(p)}
    />

    <span className='itm-name'>{item.itemResource.name}</span>

    <p className="itm-attrs">
      {(item.itemResource.attributes as [IStoreItemAttribute]).map(buildAttrFragment)}
    </p>

    <Button
      icon="chevron-up"
      intent="success"
      minimal outlined
      onClick={() => item.quantityInc()}
    />
    <div className="vdivider" />
    <Button
      icon="chevron-down"
      intent="primary"
      minimal outlined
      disabled={item.quantity == 1}
      onClick={() => item.quantityDec()}
    />
    <div className="vdivider" />
    <Button
      icon="cross"
      intent="danger"
      minimal outlined
      onClick={() => item.remove()}
    />
  </div>
));


export const CartListPanel = observer(() => {

  const store = React.useContext(CartStoreContext)!;

  return (
    <div className="cart-panel">
      {store.items.length == 0 ?
        <NonIdealState
          icon={'shopping-cart'}
          title={"No item added"}
        /> :
        <div className='cart-item-list'>
          {store.items.map(item => <CartItemView item={item} key={item.itemResource.id} />)}
        </div>
      }
    </div>
  );
});
