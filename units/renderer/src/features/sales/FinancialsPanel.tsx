import React, { useState } from 'react'

import { observer } from 'mobx-react'

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

import { SaleMethod } from '@shared/contracts/ISale'

import { CreditCustomerSelect } from './CreditCustomerSelect'

import { CartStoreContext } from './store'
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

  const [method, setMethod] = useState<SaleMethod>(SaleMethod.Direct);
  const [discount, setDiscount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [cust, setCust] = useState(null);

  const billAmount = store.billAmount;
  const payable = billAmount - discount;
  const change = amountPaid - payable;

  return (
    <div className="bar-panel financials bp3-dark">
      <h4 className="bp3-heading header-margin-b-l">Transaction</h4>

      <StatRow title="Item Count" value={store.itemCount} />
      <StatRow title="Bill Amount" value={billAmount} />

      <DiscountInput value={discount} setValue={setDiscount} max={billAmount} />

      <StatRow className="money-highlight" title="Total Payable" value={payable} />

      <RadioGroup
        inline
        label="Sale Method"
        className="sale-method-radio"
        onChange={(event) => setMethod(event.currentTarget.value as SaleMethod)}
        selectedValue={method}
      >
        <Radio large label="Cash" value={SaleMethod.Direct} />
        <Radio large label="Credit" value={SaleMethod.Credit} />
      </RadioGroup>

      {method == SaleMethod.Direct ?
        <AmountPaidForm
          setAmountPaid={setAmountPaid}
          amountPaid={amountPaid}
          change={change}
        /> :
        <CreditCustomerSelect
          value={cust}
          setValue={setCust}
        />
      }

      <div className="checkout">
        <Button
          intent="primary"
          text="Checkout"
          icon="box"
        />
      </div>

    </div>
  );
});
