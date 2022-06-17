import React from 'react';

import { NavPageView } from '@/layout/views';
import {
  Card,
  FormGroup,
  InputGroup,
  Button,
  Spinner,
  Intent,
  HTMLSelect,
  TextArea
} from '@blueprintjs/core';
import { Container, Row, Col } from 'react-grid-system';

import { AllMessages } from '@shared/communication'
import { IdentifiedTradeItem } from '@shared/contracts/ITradeItem'

import { MessageTracker } from '@/features/MessageTracker';
import { isResponseSuccessful, simpleErrorAlert } from '@/utils';


type IManageInventoryViewState = {
  tradeItems: IdentifiedTradeItem[];
  itemsMessageState: MessageTracker.State;
}

export class ManageInventoryView extends React.Component<{}, IManageInventoryViewState>
{
  private messageTracker = new MessageTracker(new AllMessages.Stock.GetTradeItems());
  private onItemsLoad: MessageTracker.HandlerAlias<typeof this.messageTracker> = (res, msgState) => {
    this.setState({ itemsMessageState: msgState });

    if (res == null)
      return;

    if (isResponseSuccessful(res)) {
      this.setState({ tradeItems: res.data! });
    }
    else {
      simpleErrorAlert("Failed to load trade items. Try refreshing the items using the button below.");
      this.setState({ tradeItems: [] });
    }
  }

  private refreshTradeItems = () => this.messageTracker.sendMessage();

  state: IManageInventoryViewState = {
    tradeItems: [],
    itemsMessageState: this.messageTracker.getState()
  }

  componentDidMount() {
    this.messageTracker.watch(this.onItemsLoad);
  }

  render() {
    const loadingItems = this.state.itemsMessageState.loading;
    return (
      <NavPageView title="Inventory">
        <Card className="default-card" elevation={2}>
          <h4 className="bp3-heading header-margin-b-l">
            Update Stock
          </h4>

          <Container fluid>
            <Row>
              <Col md={12}>
                <FormGroup label="Item Name" helperText={"The inventory item to update in stock"}>
                  {loadingItems ?
                    <Button disabled={true} fill={true} alignText="left" text="Loading Items..." /> :
                    <HTMLSelect
                      fill={true}
                    >
                      {this.state.tradeItems.map(item =>
                        <option key={item.id} value={item.id}>{item.name}</option>
                      )}
                    </HTMLSelect>
                  }
                </FormGroup>
                <FormGroup label="Item Arrival Count" helperText={"Number of the selected items to add to stock"}>
                  <InputGroup
                    type="number"
                    placeholder="Enter item count"
                    fill={true}
                    leftIcon='delta'
                  />
                </FormGroup>
                <Button
                  text="Update"
                  disabled={loadingItems}
                  intent="success"
                  className="margin-b-m margin-r-m"
                  icon="new-grid-item" />
                <Button
                  text="Refresh Items"
                  disabled={loadingItems}
                  onClick={this.refreshTradeItems}
                  intent="primary"
                  outlined={true}
                  className="margin-b-m"
                  icon="resolve" />
              </Col>
              <Col md={12}>
                <FormGroup label="Remarks / Description">
                  <TextArea
                    growVertically={true}
                    fill={true}
                    placeholder={"Enter description"}
                    rows={8}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Container>

        </Card>
      </NavPageView>
    );
  }
}
