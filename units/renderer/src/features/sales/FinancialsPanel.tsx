import React, { useState } from 'react'

import { action } from 'mobx'
import { observer } from 'mobx-react'

import cn from 'classnames'

import {
  Tag,
  FormGroup,
  NumericInput,
  Button,
  NonIdealState,
  RadioGroup,
  Radio,
  Colors
} from '@blueprintjs/core'

import { SaleMethod } from '@shared/contracts/ISale'

import { CreditCustomerSelect } from './CreditCustomerSelect'

import { CartStoreContext, CartHealth } from './store'
import { numberWithCommas } from './utility'
import { financialInputProps } from './common'

const StatRow = ({ title, value, ...rest }) => (
  <div {...rest} className={cn("fin-row fin-row-margin", rest.className || '')}>
    <span className="t">{title}</span>
    <span className="v">{numberWithCommas(value)}</span>
  </div>
);

const DiscountInput = ({ value, setValue, max }) => (
  <div className="discount-row fin-row-margin">
    <span className="margin-r-l">Discount</span>
    <NumericInput
      {...financialInputProps}
      max={max}
      fill
      buttonPosition='none'
      leftIcon='eraser'
      className="number-bold-input"
      placeholder="Enter discount"
      intent='warning'

      onValueChange={d => setValue(isNaN(d) ? 0 : d)}
      value={value}
    />
  </div>
);

const AmountPaidForm = ({ setAmountPaid, amountPaid, change }) => (
  <>
    <FormGroup label="Amount Paid">
      <NumericInput
        {...financialInputProps}
        large fill
        buttonPosition='none'
        className="number-bold-input"
        leftIcon='folder-open'
        placeholder="Enter amout paid"
        intent='primary'
        onValueChange={p => setAmountPaid(isNaN(p) ? 0 : p)}
        value={amountPaid}
      />
    </FormGroup>
    <StatRow
      className={cn("margin-t-xl", "money-highlight-" + ((change < 0) ? 'err' : 'alt'))}
      title="Change"
      value={change}
    />
  </>
);

export const FinancialsPanel = observer(() => {
  const store = React.useContext(CartStoreContext)!;

  return (
    <div className="bar-panel financials bp3-dark">
      <h4 className="bp3-heading header-margin-b-l">Transaction</h4>

      <StatRow title="Item Count" value={store.itemCount} />
      <StatRow title="Bill Amount" value={store.billAmount} />

      <DiscountInput
        value={store.discount}
        setValue={action((d) => store.discount = d)}
        max={store.billAmount} />

      <StatRow className="money-highlight" title="Total Payable" value={store.payable} />

      <RadioGroup
        inline
        label="Sale Method"
        className="sale-method-radio"
        onChange={action(event => store.method = (event.currentTarget.value as SaleMethod))}
        selectedValue={store.method}
      >
        <Radio large label="Cash" value={SaleMethod.Direct} />
        <Radio large label="Credit" value={SaleMethod.Credit} />
      </RadioGroup>

      {store.method == SaleMethod.Direct ?
        <AmountPaidForm
          setAmountPaid={action(p => store.amountPaid = p)}
          amountPaid={store.amountPaid}
          change={store.cashChange}
        /> :
        <CreditCustomerSelect
          value={store.customer}
          setValue={action(c => store.customer = c)}
        />
      }

      <div className="checkout">
        <div
          className="bp3-text-small status"
          style={{
            color: store.health == CartHealth.Ok ? Colors.GREEN5 : Colors.RED5
          }}
        >
          {store.healthString}
        </div>
        <Button
          intent="primary"
          text="Checkout"
          icon="box"
          disabled={store.health != CartHealth.Ok}
        />
      </div>

    </div>
  );
});
