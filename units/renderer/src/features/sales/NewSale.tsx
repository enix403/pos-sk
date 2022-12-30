import React from 'react'
import './NewSale.scss'

import cn from 'classnames/bind';

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

import { CreditCustomerSelect } from './CreditCustomerSelect';

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

const financialInputProps = {
  allowNumericCharactersOnly: true,
  clampValueOnBlur: true,
  minorStepSize: null,
  stepSize: 1,
  min: 0
};

interface IFinancialsState {
  method: 'credit' | 'cash';
  billAmount: number;
  discount: number;
  amountPaid: number
};

class Financials extends React.Component<any, IFinancialsState> {
  state: IFinancialsState = {
    method: 'cash',
    billAmount: 6350,
    discount: 0,
    amountPaid: 0,
  };

  setMethod = (v) => this.setState({ method: v });
  setDiscount = (v) => this.setState({ discount: v });
  setAmountPaid = (v) => this.setState({ amountPaid: v });


  renderAmountPaidForm() {
    const { billAmount, discount, amountPaid } = this.state;

    const payable = billAmount - discount;
    const change = amountPaid - payable;

    return (
      <>
        <FormGroup label="Amount Paid">
          <NumericInput
            {...financialInputProps}
            large fill
            leftIcon='folder-open'
            placeholder="Enter amout paid"
            intent='primary'
            onValueChange={p => this.setAmountPaid( isNaN(p) ? 0 : p )}
            value={amountPaid}
          />
        </FormGroup>

        <p className={cn("margin-t-xl fin-row", "money-highlight-" + ((change < 0) ? 'err' : 'alt'))}>
          <span className="t">Change</span>
          <span className="v">{numberWithCommas(change)}</span>
        </p>
      </>
    );
  }

  renderCreditCustomerForm() {
    return <CreditCustomerSelect />;
  }

  render() {

    const { method, discount, billAmount } = this.state;

    const payable = billAmount - discount;

    return (
      <div className='financials bp3-dark'>
        <h4 className="bp3-heading header-margin-b-l">Transaction</h4>

        <div className="fin-row fin-row-margin">
          <span className="t">Item Count</span>
          <span className="v">52</span>
        </div>
        <div className="fin-row fin-row-margin">
          <span className="t">Bill Amount</span>
          <span className="v">{numberWithCommas(billAmount)}</span>
        </div>

        <div className="discount-row fin-row-margin">
          <span className="margin-r-l">Discount</span>
          <NumericInput
            {...financialInputProps}
            max={billAmount}
            fill
            buttonPosition='none'
            leftIcon='eraser'
            placeholder="Enter discount"
            intent='warning'

            onValueChange={d => this.setDiscount( isNaN(d) ? 0 : d )}
            value={discount}
          />
        </div>

        <p className="money-highlight fin-row fin-row-margin">
          <span className="t">Total Payable</span>
          <span className="v">{numberWithCommas(payable)}</span>
        </p>

        <RadioGroup
            inline
            label="Sale Method"
            className="sale-method-radio"
            onChange={(event) => this.setMethod(event.currentTarget.value)}
            selectedValue={method}
        >
            <Radio large label="Cash" value="cash" />
            <Radio large label="Credit" value="credit" />
        </RadioGroup>

        {method == 'cash' ? this.renderAmountPaidForm() : this.renderCreditCustomerForm()}

      </div>
    );
  }
};

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
        <div className="cart-panel">
          <CartListPanel />
        </div>
        <div className="bar-panel">
          <AddItem />
        </div>
        <div className="bar-panel">
          <Financials />
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

