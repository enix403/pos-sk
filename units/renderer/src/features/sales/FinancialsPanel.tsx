import React from 'react'

import cn from 'classnames'

import {
  Tag,
  FormGroup,
  NumericInput,
  Button,
  NonIdealState,
  RadioGroup,
  Radio
} from '@blueprintjs/core'

import { CreditCustomerSelect } from './CreditCustomerSelect'

import { numberWithCommas } from './utility'
import { financialInputProps } from './common'

interface IFinancialsState {
  method: 'credit' | 'cash';
  billAmount: number;
  discount: number;
  amountPaid: number
};

export class FinancialsPanel extends React.Component<any, IFinancialsState> {
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
      <div className="bar-panel">
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
      </div>
    );
  }
};
