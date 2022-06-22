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
import { formatResponseErrorLog, formatResponseErrorUser, isResponseSuccessful, simpleErrorAlert, simpleSuccessAlert } from '@/utils';


type IManageInventoryViewState = {
  tradeItems: IdentifiedTradeItem[];
  itemsMessageState: MessageTracker.State;

  selectedItemId?: string;
  delta?: string;
  desc: string;
}

export class ManageInventoryView extends React.Component<{}, IManageInventoryViewState>
{
  private itemTracker = new MessageTracker(new AllMessages.Stock.GetTradeItems());
  private onItemsLoad: MessageTracker.HandlerAlias<typeof this.itemTracker> = (res, msgState) => {
    this.setState({
      itemsMessageState: msgState,
      selectedItemId: undefined,
      delta: undefined
    });

    if (res == null)
      return;

    if (isResponseSuccessful(res)) {
      const items = res.data!;
      this.setState({
        tradeItems: items,
        selectedItemId: items.length > 0 ? items[0].id.toString() : undefined
      });
    }
    else {
      simpleErrorAlert("Failed to load trade items. Try refreshing the items using the button below.");
      this.setState({ tradeItems: [], selectedItemId: undefined });
    }
  }

  private refreshTradeItems = () => this.itemTracker.sendMessage();

  state: IManageInventoryViewState = {
    tradeItems: [],
    itemsMessageState: this.itemTracker.getState(),
    selectedItemId: undefined,
    delta: undefined,
    desc: "",
  }

  private onUpdate = async () => {
    const { selectedItemId, delta, desc  } = this.state;

    let deltaN = +delta!;
    let selectedItemIdN = +selectedItemId!;

    if (!selectedItemId || !deltaN || !desc) {
      simpleErrorAlert("Please fill all the fields");
      return;
    }

    if (deltaN <= 0) {
      simpleErrorAlert("Please fill all the fields");
      return;
    }

    const result = await window.SystemBackend.sendMessage(new AllMessages.Stock.Update(selectedItemIdN, deltaN, desc));

    if (!isResponseSuccessful(result)) {
      simpleErrorAlert(formatResponseErrorUser(result));
      console.log(formatResponseErrorLog(result));
      return;
    }

    simpleSuccessAlert("Update performed successfully");
    this.refreshTradeItems();
  }

  componentDidMount() {
    this.itemTracker.watch(this.onItemsLoad);
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
                      value={this.state.selectedItemId || undefined}
                      onChange={e => this.setState({ selectedItemId: e.target.value })}
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
                    value={this.state.delta?.toString() ?? ""}
                    onChange={e => this.setState({ delta: e.target.value })}
                  />
                </FormGroup>
                <Button
                  text="Update"
                  disabled={loadingItems}
                  onClick={this.onUpdate}
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
                    value={this.state.desc?.toString()}
                    onChange={e => this.setState({ desc: e.target.value })}
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
