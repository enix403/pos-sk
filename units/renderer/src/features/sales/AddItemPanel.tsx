import React, { useState, useEffect } from "react";

import { CartStoreContext } from "./store";

import {
  Tag,
  ControlGroup,
  InputGroup,
  Button,
  Icon,
  NonIdealState,
  Spinner,
  Tabs,
  Tab,
} from "@blueprintjs/core";

class AddByNamePanel extends React.Component {
  render() {
    const loading = false;
    const visual = loading ? <Spinner intent="success" size={90} /> : "search";

    return (
      <>
        <ControlGroup className="bp3-dark" fill={true} vertical={false}>
          <InputGroup
            type="text"
            large
            placeholder="Enter item name ..."
            fill
            leftIcon="layers"
            intent="none"
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

const AddByProductCodePanel = () => {
  enum State {
    Clean,
    NotFound,
  }

  const { invStore, cartStore } = React.useContext(CartStoreContext)!;

  const [prCode, setPrCode] = React.useState<string>("");
  const [lastPrCode, setLastPrCode] = React.useState<string>("");
  const [foundState, setFoundState] = React.useState<State>(State.Clean);

  const onAdd = React.useCallback((code) => {
    const itemRes = invStore.allItems.find((it) => it.item.pcode == code);
    setLastPrCode(code);

    if (itemRes == undefined) {
      setFoundState(State.NotFound);
      return;
    }

    setFoundState(State.Clean);
    cartStore.addItem(itemRes);
  }, []);

  return (
    <>
      <ControlGroup className="bp3-dark" fill={true} vertical={false}>
        <InputGroup
          type="text"
          large
          placeholder="Enter product code ..."
          fill
          leftIcon="layers"
          intent="none"
          value={prCode}
          onChange={(e) => setPrCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              onAdd(prCode);
              setPrCode("");
            }
          }}
        />
        <Button
          large
          outlined
          icon="add"
          intent="success"
          className="margin-l-m"
          onClick={() => {
            onAdd(prCode);
            setPrCode("");
          }}
        />
      </ControlGroup>

      {foundState == State.NotFound ? (
        <NonIdealState
          className="non-ideal"
          icon={<Icon icon="cross" intent="danger" size={90} />}
          title={"Item not found"}
          description={lastPrCode == "" ? "" : `Product Code: ${lastPrCode}`}
        />
      ) : null}
    </>
  );
};

export const AddItemPanel = () => {
  return (
    <div className="bar-panel">
      <div className="add-item bp3-dark">
        <h4 className="bp3-heading header-margin-b-s">Add Item</h4>
        <Tabs large id="TabsExample" defaultSelectedTabId="upc">
          <Tab id="appcode" title="Code" />
          <Tab id="upc" title="UPC" panel={<AddByProductCodePanel />} />
          <Tab id="name" title="Name" panel={<AddByNamePanel />} />
        </Tabs>
      </div>
      <div className="scan-status bp3-dark">
        <ScanStatusButton scanActive={true} />
      </div>
    </div>
  );
};

const ScanStatusButton = ({ scanActive }) => {
  return (
    <>
      {scanActive ? (
        <Tag fill icon="small-tick" minimal intent="success">
          <div className="scan-tag">
            <strong>Scanning</strong>
          </div>
        </Tag>
      ) : (
        <Button
          fill
          // large
          intent="danger"
          text="Click to scan"
        />
      )}
    </>
  );
};
