import React from 'react';

import { NavPageView } from '@/layout/views';
import {
  Card,
  FormGroup,
  InputGroup,
  Button,
  Spinner
} from '@blueprintjs/core';
import { Form, Field } from 'react-final-form'

import { IdentifiedTradeItem } from '@shared/contracts/ITradeItem'
import { AllMessages, CommResultType } from '@shared/communication'

import {
  blurAllInputs,
  isResponseSuccessful,
  formatResponseErrorUser,
  formatResponseErrorLog,
  simpleErrorAlert,
  simpleSuccessAlert,
} from '@/utils'

import {
  composeValidators,
  processMeta,
  required,
  minValue,
  mustBeNumber
} from '@/components/fields'
import { AppToaster } from '@/toaster';


interface Values {
  itemName?: string;
  salePrice?: number;
}

const saveTradeItem = (values: Values) =>
  window.SystemBackend.sendMessage(
    new AllMessages.Stock.CreateTradeItem({
      name: values.itemName!,
      salePrice: values.salePrice!
    })
  );

const TradeItemForm = ({ afterCreate }) => {
  return (
    <Form
      onSubmit={async (values: Values, form) => {
        const result = await saveTradeItem(values);

        if (!isResponseSuccessful(result)) {
          simpleErrorAlert(formatResponseErrorUser(result));
          console.log(formatResponseErrorLog(result));
          return;
        }

        simpleSuccessAlert(<>
            Trade item <strong>{values.itemName}</strong> created successfully
        </>);

        blurAllInputs();
        form.restart();

        afterCreate();
      }}
      subscription={{ submitting: true, pristine: true }}
    >
      {({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <Field name="itemName" validate={required}>
            {({ input, meta }) => {
              const { intent, hasError } = processMeta(meta);

              return (
                <FormGroup label="Item Name" intent={intent} helperText={hasError && meta.error}>
                  <InputGroup
                    placeholder="Enter the item name"
                    fill={true}
                    leftIcon='layers'
                    intent={intent}
                    {...input}
                  />
                </FormGroup>
              );
            }}
          </Field>
          <Field name="salePrice" validate={composeValidators(mustBeNumber, required, minValue(1))}>
            {({ input, meta }) => {
              const { intent, hasError } = processMeta(meta);

              return (
                <FormGroup label="Sale Price" intent={intent} helperText={hasError && meta.error}>
                  <InputGroup
                    type="number"
                    placeholder="Enter sale price"
                    fill={true}
                    leftIcon='layers'
                    intent={intent}
                    {...input}
                  />
                </FormGroup>
              );
            }}
          </Field>
          <Button
            type="submit"
            disabled={submitting}
            loading={submitting}
            text="Add Item"
            icon="add-to-artifact"
            intent="primary"
            outlined={true}
          />
        </form>
      )}
    </Form>
  );
}


const TradeItemsList: React.FC<{ rows: IdentifiedTradeItem[] }> = ({ rows }) => {
  return (
    <div className="table-wrapper">
      <div className="table-header">
        <span className="title">
          Trade Items Added
        </span>
        <Button
          text="Export To Excel"
          rightIcon="export"
          intent="success"
          outlined={true}
        />
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr className="small">
              <th>SKU</th>
              <th>Name</th>
              <th>Sale Price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row =>
              <tr key={row.id}>
                <td>LKDWR-56546-242</td>
                <td>{row.name}</td>
                <td>{row.salePrice}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ManageTradeItemsView = () => {
  const [rows, setRows] = React.useState<IdentifiedTradeItem[]>([]);
  const [rowsLoading, setRowsLoading] = React.useState(false);

  const refreshList = React.useCallback(() => {
    setRowsLoading(true);
    window.SystemBackend.sendMessage(
      new AllMessages.Stock.GetTradeItems()
    )
      .then(result => {
        if (result.type == CommResultType.ChannelResponse)
          setRows(result.data!);
        else
          console.error(result.error);
      })
      .finally(() => setRowsLoading(false))
      .catch(err => console.error(err));
  }, []);

  React.useEffect(() => {
    refreshList();
  }, []);

  return (
    <NavPageView title="Manage Trade Items">
      <Card elevation={2} className="default-card">
        <h4 className="bp3-heading header-margin-b-l">
          Add Trade Item
        </h4>
        <TradeItemForm afterCreate={refreshList} />
      </Card>
      <Card elevation={2} className="default-card">
        {rowsLoading ?
          <Spinner intent="primary" size={120} /> :
          <TradeItemsList rows={rows} />
        }
      </Card>
    </NavPageView>
  )
}
