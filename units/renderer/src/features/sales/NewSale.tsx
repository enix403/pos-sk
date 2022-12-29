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
  RadioGroup,
  Radio,
  NonIdealState,
  Icon,
  Spinner,
} from '@blueprintjs/core'

import { numberWithCommas } from './utility'

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

const Financials = () => {
  const [method, setMethod] = React.useState('credit');
  const [discount, setDiscount] = React.useState(0);

  const billAmount = 125400;

  return (
    <div className='financials bp3-dark'>
      <h4 className="bp3-heading header-margin-b-l">Transaction</h4>

      <p className="fin-row fin-row-margin">
        <span class="t">Bill Amount</span>
        <span class="v">{numberWithCommas(billAmount)}</span>
      </p>
      <p className="discount-row fin-row-margin">
        <span className="margin-r-l">Discount</span>
        <NumericInput
          fill
          allowNumericCharactersOnly
          clampValueOnBlur
          minorStepSize={null}
          stepSize={1}
          min={0}
          max={billAmount}
          buttonPosition='none'
          leftIcon='lightbulb'
          placeholder="Enter discount"
          intent='success'

          onValueChange={d => setDiscount( isNaN(d) ? 0 : d )}
          value={discount}
        />
      </p>

      <p className="fin-row fin-row-margin">
        <span class="t">Total Payable</span>
        <span class="v">{numberWithCommas(billAmount - discount)}</span>
      </p>

      <RadioGroup
          inline
          label="Sale Method"
          className="sale-method-radio"
          onChange={(event) => setMethod(event.currentTarget.value)}
          selectedValue={method}
      >
          <Radio label="Cash" value="cash" />
          <Radio label="Credit" value="credit" />
      </RadioGroup>
    </div>
  );
};

function buildAttrFragment(attr, index)
{
  const [name, value] = attr;
  return (
    <>
      { index != 0 ? ' - ' : null }
      <strong>{name}:</strong>
      {' '}
      {value}
    </>
  );
}

const CartItem = ({ i }) => {

  const attrs = [
    ['Color', 'Red'],
    ['Size', '120g']
  ];

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
        <p className="itm-attrs">
          {attrs.map(buildAttrFragment)}
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
          <Financials />
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
