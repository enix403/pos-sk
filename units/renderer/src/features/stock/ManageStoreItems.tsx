import React from 'react'

import { NavPageView } from '@/layout/views'
import { mergeRefs, getRef, Divider, Button, Intent, Card, ControlGroup, FormGroup, HTMLSelect, InputGroup, TextArea, Tag } from '@blueprintjs/core'
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import { Form, Field } from 'react-final-form';
import { Container, Row, Col } from 'react-grid-system';

import type { Config } from 'final-form';
import type { FormRenderProps } from 'react-final-form';
import {
  composeValidators,
  processMeta,
  required,
  minValue,
  mustBeNumber
} from '@/components/fields'
import { sleep } from '@shared/commonutils';
import { StoreItemFamily } from '@shared/contracts/IStoreItem';
import { blurAllInputs } from '@/utils';

type FinalFormSubmit<T> = Config<T>['onSubmit'];

interface IAttributesRowProps {
  id: any;

  editing: boolean;
  name: string;
  value: string;

  onNameChange: (id: any, name: string) => void;
  onValueChange: (id: any, value: string) => void;

  onStatusChange: (id: any) => void;
  onRemove: (id: any) => void;
};
function AttributesRow(props: IAttributesRowProps) {
  const { editing } = props;
  const inputIntent = editing ? Intent.SUCCESS : Intent.NONE;
  return (
    <Row className="margin-b-m">
      <Col>
        <ControlGroup>
          <InputGroup
            placeholder="Enter the item name"
            fill={true}
            intent={inputIntent}
            readOnly={!editing}
            leftElement={<Tag minimal intent="success">Name: </Tag>}

            value={props.name}
            onChange={e => props.onNameChange(props.id, e.target.value)}
          />
          <InputGroup
            placeholder="Enter the item name"
            fill={true}
            intent={inputIntent}
            readOnly={!editing}
            leftElement={<Tag minimal intent="success">Value: </Tag>}

            value={props.value}
            onChange={e => props.onValueChange(props.id, e.target.value)}
          />
        </ControlGroup>
      </Col>
      <Col xs="content">
        <Button
          className="margin-r-l"
          onClick={e => props.onStatusChange(props.id)}
          text={editing ? "Save" : "Edit"}
          intent={editing ? "success" : "primary"}
          rightIcon={editing ? "floppy-disk" : "edit"} />
        <Button
          onClick={e => props.onRemove(props.id)}
          text="Remove"
          intent="danger"
          rightIcon="cross" />
      </Col>
    </Row>
  );
}

class AttributesList extends React.Component<{}, AttributesList.State> {

  public state: AttributesList.State = {
    attrs: {},
    currentlyEditingID: null
  };

  private nextId = 1;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.updateAttr(
      { id: this.nextId++, name: "Color", value: "" },
      { id: this.nextId++, name: "Size", value: "" }
    );
  }

  private addAttribute = () => {
    this.updateAttr({ id: this.nextId++, name: "", value: "" });
  }

  private toArray(): AttributesList.AttrObject[] {
    return Object.values(this.state.attrs).filter(Boolean) as any;
  }

  private updateAttr(...attrs: AttributesList.AttrObject[]) {
    // this.setState({ attrs: { ...this.state.attrs, [attr.id]: attr } })
    const stateAttrs = Object.assign({}, this.state.attrs);
    for (const a of attrs)
      stateAttrs[a.id] = a;

    this.setState({ attrs: stateAttrs });
  }

  private onAttrStatusChange = (id: AttributesList.AttrObjectID) => {
    let editId = this.state.currentlyEditingID;

    if (editId == id)
      editId = null;
    else
      editId = id;

    this.setState({ currentlyEditingID: editId });
  };

  private onAttrNameChange = (id: AttributesList.AttrObjectID, name: string) => {
    const attr = Object.assign({}, this.state.attrs[id]);
    attr.name = name;
    this.updateAttr(attr);
  }

  private onAttrValueChange = (id: AttributesList.AttrObjectID, value: string) => {
    const attr = Object.assign({}, this.state.attrs[id]);
    attr.value = value;
    this.updateAttr(attr);
  }

  private onAttrRemove = (id: AttributesList.AttrObjectID) => {
    const attrs = Object.assign({}, this.state.attrs);
    delete attrs[id];
    this.setState({ attrs });
    if (this.state.currentlyEditingID == id)
      this.setState({ currentlyEditingID: null });
  }


  render() {
    return (
      <Container>

        <Row className="margin-t-m margin-b-xl">
          <Col className="center-text-flow">
            <h5 className="bp3-heading">Product Attributes</h5>
          </Col>
          <Col md="content">
            <Button
              text="New Attribute"
              intent="danger"
              outlined
              onClick={this.addAttribute}
              rightIcon="add" />
          </Col>
        </Row>

        {this.toArray().map(item => (
          <AttributesRow
            key={item.id}
            id={item.id}
            name={item.name}
            value={item.value}
            editing={item.id == this.state.currentlyEditingID}

            onNameChange={this.onAttrNameChange}
            onValueChange={this.onAttrValueChange}
            onStatusChange={this.onAttrStatusChange}
            onRemove={this.onAttrRemove}
          />
        ))}
      </Container>
    );
  }
}
namespace AttributesList {
  export type AttrObjectID = number;
  export interface AttrObject {
    id: AttrObjectID;
    name: string;
    value: string;
  }
  export interface State {
    attrs: Record<AttrObjectID, AttrObject | undefined>;
    currentlyEditingID: AttrObjectID | null;
  }
}

class StoreItemForm extends React.Component<{}, StoreItemForm.State> {

  private START_SCAN_INFO = "Click to start scanning";
  private STOP_SCAN_INFO = "Click to cancel scanning";

  private codeInputRef: React.RefObject<any>;

  public state: StoreItemForm.State = {
    pcode_enabled: false,
    pcode: "",
    scanning: false
  };

  constructor(props) {
    super(props);

    this.renderForm = this.renderForm.bind(this);
    this.codeInputRef = React.createRef();
  }

  private handleCodeStatusChange = (e: any) => {
    const enabled = e.target.value == "yes";
    this.setState({ pcode_enabled: enabled });
    if (!enabled)
      this.setState({ scanning: false });
  };

  private onScanStatusChange = () => {
    const oldStatus: boolean = this.state.scanning;
    if (oldStatus) {
      this.setState({ scanning: false });
    }
    else {
      this.setState({
        pcode_enabled: true,
        scanning: true,
        pcode: ""
      }, () => this.codeInputRef.current.focus());
    }
  };

  private onScanBlur = () => {
    setTimeout(() => this.state.scanning && this.setState({ scanning: false }), 200);
  }

  private onFormSubmit: StoreItemForm.OnSubmitType = async (values, form) => {
    blurAllInputs();
    form.restart();

    await sleep(200);
    window.alert(JSON.stringify(values, undefined, 2));
  };

  render() {
    return (
      <React.Fragment>
        <Form
          onSubmit={this.onFormSubmit}
          subscription={{ submitting: true }}
          initialValues={{
            family: StoreItemFamily.TradeItem,
            unit: 'piece'
          }}
        >
          {(rprops) => (
            <form onSubmit={rprops.handleSubmit}>
              {this.renderForm(rprops)}

              <Divider />
              <AttributesList />

              <Divider style={{ marginTop: "50px" }} />

              <Button
                type="submit"
                disabled={rprops.submitting}
                loading={rprops.submitting}
                text="Save Item"
                intent="primary"
                className="margin-t-l padding-h-l"
                rightIcon="confirm" />
            </form>
          )}
        </Form>
      </React.Fragment>
    );
  }

  renderForm(rprops: StoreItemForm.FormRenderPropType) {
    const currentlyScanning = this.state.scanning;

    return (
      <Container>
        <Row>
          <Col>
            <Field name="name" validate={required}>
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
            <FormGroup label={<>Description <small className="bp3-text-muted">(Optional)</small> </>}>
              <Field name="description">
                {({ input }) => (<TextArea
                  growVertically={true}
                  fill={true}
                  placeholder={"Enter description"}
                  rows={6}
                  {...input}
                />)}
              </Field>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={7}>
            <FormGroup label="Product Type">
              <Field name="family">
                {({ input: { multiple, ...restInput } }) => (<HTMLSelect fill={true} {...restInput}>
                  <option value="trade_item">Trade Item</option>
                  <option value="self_brand">Self Branded</option>
                </HTMLSelect>)}
              </Field>
            </FormGroup>
          </Col>
          <Col md={16} lg={10}>
            <FormGroup label="Product Code" helperText={"Enable product code and enter code, or press \"Scan\" and physically scan the item to automatically read the code"}>
              <ControlGroup>
                <HTMLSelect
                  value={this.state.pcode_enabled ? "yes" : "no"}
                  onChange={this.handleCodeStatusChange}
                >
                  <option value="no">Disabled</option>
                  <option value="yes">Enabled</option>
                </HTMLSelect>
                <InputGroup
                  placeholder={currentlyScanning ? "Use the scanner to scan the code...." : "Enter the code"}
                  intent={currentlyScanning ? "warning" : "none"}
                  disabled={!this.state.pcode_enabled}
                  fill={true}
                  leftIcon="tag"
                  value={this.state.pcode}
                  onChange={e => this.setState({ pcode: e.target.value })}
                  onBlur={this.onScanBlur}
                  inputRef={this.codeInputRef}
                />
                <Tooltip2
                  content={currentlyScanning ? this.STOP_SCAN_INFO : this.START_SCAN_INFO}
                  inheritDarkTheme
                  openOnTargetFocus={false}
                  intent={currentlyScanning ? "warning" : "primary"}
                  position="top"
                  renderTarget={({ isOpen, ref, ...tooltipProps }) => (
                    <Button
                      {...tooltipProps}
                      elementRef={getRef(ref)}
                      intent="success"
                      icon="barcode"
                      onClick={this.onScanStatusChange}
                      outlined={currentlyScanning}
                    >
                      {currentlyScanning ? "Sanning..." : "Scan"}
                    </Button>
                  )}
                />
              </ControlGroup>
            </FormGroup>
          </Col>
          <Col lg={7}>
            <FormGroup label="Selling Unit">
              <Field name="unit">
                {({ input: { multiple, ...restInput } }) => (<HTMLSelect fill={true} {...restInput}>
                  <option value="piece">Piece</option>
                  <option value="mt">Meters</option>
                  <option value="in">Inches</option>
                  <option value="kg">Kilograms</option>
                  <option value="gm">Grams</option>
                  <option value="lt">Litres</option>
                  <option value="oz">Ounces</option>
                </HTMLSelect>)}
              </Field>
            </FormGroup>
          </Col>
          <Col md={16} lg={9}>
            <Field name="price_per_unit" validate={composeValidators(mustBeNumber, required, minValue(1))}>
              {({ input, meta }) => {
                const { intent, hasError } = processMeta(meta);
                return (
                  <FormGroup label="Sale Price per Unit" intent={intent} helperText={hasError && meta.error}>
                    <InputGroup
                      type="number"
                      placeholder="Enter sale price"
                      fill
                      leftIcon='dollar'
                      intent={intent}
                      {...input}
                    />
                  </FormGroup>
                );
              }}
            </Field>
          </Col>
        </Row>
      </Container>
    );
  }
}

namespace StoreItemForm {
  export interface Values {
    name?: string;
    description?: string;
    family?: StoreItemFamily;
    unit?: string;
    price_per_unit?: number;
  }

  export interface State {
    pcode_enabled: boolean;
    pcode: string;
    scanning: boolean;
  }

  export type OnSubmitType = FinalFormSubmit<Values>;
  export type FormRenderPropType = FormRenderProps<Values>;
}


export class ManageStoreItemsView extends React.Component {
  render() {
    return (
      <NavPageView title="Store Items">
        <Card className="default-card" elevation={2}>
          <h4 className="bp3-heading header-margin-b-l">
            Add Store Item
          </h4>

          <StoreItemForm />
        </Card>
      </NavPageView>
    );
  }
}
