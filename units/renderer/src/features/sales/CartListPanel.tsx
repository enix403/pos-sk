import React from 'react'

import {
  Tag,
  NumericInput,
  Button,
  NonIdealState
} from '@blueprintjs/core'

import { financialInputProps } from './common'

function buildAttrFragment(attr, index) {
  const [name, value] = attr;
  return (
    <React.Fragment key={index}>
      { index != 0 ? ' - ' : null }
      <strong>{name}:</strong>
      {' '}
      {value}
    </React.Fragment>
  );
}

const CartItem = ({ i }) => {

  const attrs = [
    ['Color', 'Red'],
    ['Size', '120g']
  ];

  return (
    <div className='cart-item'>
      <NumericInput
        {...financialInputProps}
        className="quantity"
        rightElement={<Tag minimal intent="primary">x Rs. 1240</Tag>}
        placeholder={"Qty"}
      />
      <span className='itm-name'>Some Item {i}</span>
      <p className="itm-attrs">
        {attrs.map(buildAttrFragment)}
      </p>
      <Button icon="cross" intent="danger" minimal={true} />
    </div>
  );
};

export const CartListPanel = () => {
  return (
    <div className="cart-panel">

      {/*<NonIdealState
        icon={'shopping-cart'}
        title={"No item added"}
      />*/}
      <div className='cart-item-list'>
        <CartItem i={1} />
        <CartItem i={2} />
        <CartItem i={3} />
        <CartItem i={4} />
        <CartItem i={5} />
        <CartItem i={6} />
        <CartItem i={7} />
        <CartItem i={8} />
        <CartItem i={9} />
      </div>
    </div>
  );
};
