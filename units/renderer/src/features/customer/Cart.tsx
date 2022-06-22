import React from 'react';

import './Cart.scss'

import { NavPageView } from '@/layout/views';
import {
  Tag,
  NumericInput,
  Card,
  Button,
  Divider,
  FormGroup
} from '@blueprintjs/core';


function Row() {
  return (
    <Card elevation={0} className="item-row">
      <div className="container">
        <div className="left">
          <p><Tag minimal intent="danger">#QUE-003443-AH-34-005</Tag></p>
          <h3 className="name">Soap 34</h3>

          <p className="bp3-text-muted bp3-text-small"><span className="margin-r-s">COLOR:</span>GREEN</p>
          <p className="bp3-text-muted bp3-text-small"><span className="margin-r-s">SIZE:</span>LARGE</p>
          <p className="bp3-text-muted bp3-text-small"><span className="margin-r-s">VARIANT:</span>A</p>
          <p className="bp3-text-muted bp3-text-small"><span className="margin-r-s">TYPE:</span>BOTTLE</p>
        </div>
        <div className="right">
          <FormGroup label="Quantity" className="quantity">
            <NumericInput
              rightElement={<Tag minimal intent="primary">x Rs. 1240</Tag>}
              leftIcon='shopping-cart'
              value={1}
            />
          </FormGroup>
          <p className="margin-b-l bp3-text-large">
            <strong>Total (PKR):&nbsp;</strong>
            <span style={{ float: 'right' }}>1240</span>
          </p>
          <Button
            text="Remove"
            intent="danger"
            outlined={true}
            fill={true}
            icon="delete" />
        </div>
      </div>
    </Card>
  );
}

function Summary() {
  return (
    <Tag
      // minimal
      fill
      large
      icon="dollar"
      intent="success"
    >
      <div className="bp3-text-large space-row padding-v-l">
        <p><strong>Total</strong></p>
        <p><strong>Rs. 4050</strong></p>
      </div>
    </Tag>
  );
}

// <h2 className="bp3-heading">Items Added</h2>
// <p className="bp3-small bp3-text-muted">#QUE-003443-AH-34-005</p>
export function CartView() {
  return (
    <NavPageView title="Customer Checkout Cart">
      <div className="cart-view">

        <div className="items-list">
          <h2 className="margin-b-l">Cart</h2>
          <Row />
          <Row />
        </div>

        <div className="total-stats">
          <h2 className="margin-b-l">Summary</h2>
          <Summary />
        </div>
      </div>
    </NavPageView>
  )
}
