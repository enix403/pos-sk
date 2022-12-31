import React from 'react'

import {
  Tag,
  ControlGroup,
  InputGroup,
  Button,
  NonIdealState,
  Spinner,
  Tabs,
  Tab,
} from '@blueprintjs/core'

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

const ScanStatusButton = ({ scanActive }) => {
  return (
    <>
    {scanActive ?
      <Tag
        fill
        icon="small-tick"
        minimal
        intent="success"
      >
        <div className="scan-tag">
          <strong>Scanning</strong>
        </div>
      </Tag> :
      <Button
        fill
        // large
        intent="danger"
        text="Click to scan"
      />
     }
    </>
  );
}

export const AddItemPanel = () => {
  return (
    <div className="bar-panel">
      <div className='add-item bp3-dark'>
        <h4 className="bp3-heading header-margin-b-s">Add Item</h4>
        <Tabs large id="TabsExample" defaultSelectedTabId="name">
          <Tab id="name" title="Name" panel={<AddByNamePanel />} panelClassName="addby-name" />
          <Tab disabled id="appcode" title="Code" />
          <Tab disabled id="upc" title="UPC" />
        </Tabs>
      </div>
      <div className="scan-status bp3-dark">
        <ScanStatusButton scanActive={true} />
      </div>
    </div>
  );
};
