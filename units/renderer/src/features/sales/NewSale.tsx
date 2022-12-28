import React from 'react'
import './NewSale.scss'

import {
  Tabs,
  Tab,
  Tag,
  Button,
  ControlGroup,
  FormGroup,
  InputGroup,
  NumericInput,
  NonIdealState,
  Icon,
  Spinner,
} from '@blueprintjs/core'

class AddByNamePanel extends React.Component {
  render() {

    const loading = false;
    const visual = loading ? <Spinner intent="success" size={90} /> : 'search';

    return (
      <>
        <ControlGroup className="bp3-dark" fill={true} vertical={false}>
          <InputGroup
            type="text"
            large
            placeholder="Enter item name ..."
            fill
            leftIcon='layers'
            intent='none'
          />
          <Button
            large
            outlined
            icon="search"
            intent="success"
            className="margin-l-m"
          />
        </ControlGroup>

        <NonIdealState
          className="non-ideal"
          icon={visual}
          title={loading ? undefined : "No search results"}
        />
      </>
    );
  }
}

const AddItem = () => {
  return (
    <div className='add-item bp3-dark'>
      <h4 className="bp3-heading header-margin-b-s">Add Item</h4>
      <Tabs large id="TabsExample" defaultSelectedTabId="name">
        <Tab id="name" title="Name" panel={<AddByNamePanel />} panelClassName="addby-name" />
        <Tab disabled id="appcode" title="Code" />
        <Tab disabled id="upc" title="UPC" />
      </Tabs>
    </div>
  );
};

const CartItem = ({ i }) => {
  return (
    <div className='cart-item'>
        <Tag minimal intent="success">#QUE-003443-AH-34-005</Tag>
        <NumericInput
          className="quantity"
          rightElement={<Tag minimal intent="primary">x Rs. 1240</Tag>}
          leftIcon='shopping-cart'
          placeholder={"Qty"}
        />
        <span className='itm-name'>Some Item {i}</span>
        <p>
          <strong>Color:</strong> Red,{' '}
          <strong>Size:</strong> 100g
        </p>
        <Button icon="cross" intent="danger" minimal={true} />
    </div>
  );
};

const CartListPanel = () => {
  return (
    <>
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
    </>
  );
};


class CartView extends React.Component {
  render() {
    return (
      <>
        <div className="left-panel">
          <AddItem />
        </div>

        <div className="right-panel">
          <CartListPanel />
        </div>
      </>
    );
  }
};


export class NewSaleView extends React.Component {
  render() {
    return (
      <div className='new-sale-view'>
        <CartView />
      </div>
    );
  }
}
