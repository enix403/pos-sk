import React from 'react'

import {
  MenuItem,
  FormGroup,
} from '@blueprintjs/core'

import { Suggest } from "@blueprintjs/select";
const flags = {
  allowCreate: false,
  closeOnSelect: true,
  openOnKeyDown: false,
  resetOnClose: false,
  resetOnQuery: true,
  resetOnSelect: false,
};

export type CustomerResource = { id: number, name: string };

const ALL_CUSTOMERS: CustomerResource[] = [
  {id: 1, name: "ABC 1"},
  {id: 2, name: "DEF 2"},
  {id: 3, name: "GHI 3"},
  {id: 4, name: "JKL 4"},
];

const filterCustomer = (query, customer, _index, exactMatch) => {
  const normalizedTitle = customer.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return normalizedTitle.indexOf(normalizedQuery) >= 0;
  }
};

const renderCustomer = (customer, { handleClick, modifiers }) => {
  if (!modifiers.matchesPredicate)
    return null;

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={customer.id}
      onClick={handleClick}
      text={customer.name}
    />
  );
};

export const CreditCustomerSelect = ({value, setValue}) => (
  <FormGroup label="Customer Name">
    <Suggest<any>
      {...flags}
      popoverProps={{ minimal: true }}
      fill
      inputProps={{ large: true, leftIcon: 'person'}}
      items={ALL_CUSTOMERS}
      itemRenderer={renderCustomer}
      selectedItem={value}
      onItemSelect={(c) => setValue(c)}
      inputValueRenderer={(customer) => customer.name}
      itemsEqual={(a, b) => a.id == b.id}
      itemPredicate={filterCustomer}
      noResults={<MenuItem disabled={true} text="No results." />}
    />
  </FormGroup>
);
