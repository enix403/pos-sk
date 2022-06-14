import React from 'react';
import { NavPageView } from "@/layout/views";
import { Card, Icon, Button, Checkbox } from '@blueprintjs/core';
import Flags from 'country-flag-icons/react/3x2';

import './style.scss';

const TableColumnHeader: React.FC<any> = ({ children, ...restProps }) => {
    return (
        <th {...restProps}>
            <div className="center-text-flow" style={{ margin: '0 10px' }}>
                <span>{children}</span>
                <Icon intent="danger" style={{ marginLeft: 6 }} icon="filter" />
                <Icon intent="danger" style={{ marginLeft: 6 }} icon="sort" />
            </div>
        </th>
    );
};

export const MyTable = React.memo(() => {
    return (
        <div className="table-wrapper">
            <div className="table-header">
                <span className="title center-text-flow">
                    <Icon icon='heatmap' size={20} style={{ color: '#ffc107' }} />
                    <span className="icon-text-lg">List of Customers</span>
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
                        <tr>
                            <th></th>
                            <TableColumnHeader>Name</TableColumnHeader>
                            <TableColumnHeader>Country</TableColumnHeader>
                            <TableColumnHeader>Date</TableColumnHeader>
                            <TableColumnHeader>Agent</TableColumnHeader>
                            <TableColumnHeader>Balance</TableColumnHeader>
                            <TableColumnHeader>Status</TableColumnHeader>
                            <TableColumnHeader>Activity</TableColumnHeader>
                        </tr>
                        <tr>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><div className="center-everything"><Checkbox/></div></td>
                            <td>James Match</td>
                            <td>
                                <div className="no-idea">
                                    <div className="flag-holder">
                                        <Flags.US style={{ height: 20 }} />
                                    </div>
                                    United States
                                </div>
                            </td>
                            <td>Tony Bowcher</td>
                            <td>09/13/2015</td>
                            <td>$70,663.00</td>
                            <td>Unqualified</td>
                            <td>14%</td>
                        </tr>
                        <tr>
                            <td><div className="center-everything"><Checkbox/></div></td>
                            <td>James Match</td>
                            <td>
                                <div className="no-idea">
                                    <div className="flag-holder">
                                        <Flags.AR style={{ height: 20 }} />
                                    </div>
                                    Argentina
                                </div>
                            </td>
                            <td>Tony Bowcher</td>
                            <td>09/13/2015</td>
                            <td>$70,663.00</td>
                            <td>Unqualified</td>
                            <td>14%</td>
                        </tr>

                        <tr>
                            <td><div className="center-everything"><Checkbox/></div></td>
                            <td>James Match</td>
                            <td>
                                <div className="no-idea">
                                    <div className="flag-holder">
                                        <Flags.BS style={{ height: 20 }} />
                                    </div>
                                    Algeria
                                </div>
                            </td>
                            <td>Tony Bowcher</td>
                            <td>09/13/2015</td>
                            <td>$70,663.00</td>
                            <td>Unqualified</td>
                            <td>14%</td>
                        </tr>

                        <tr>

                            <td><div className="center-everything"><Checkbox/></div></td>
                            <td>James Match</td>
                            <td>
                                <div className="no-idea">
                                    <div className="flag-holder">
                                        <Flags.AG style={{ height: 20 }} />
                                    </div>
                                    Antigua and Barbuda
                                </div>
                            </td>
                            <td>Tony Bowcher</td>
                            <td>09/13/2015</td>
                            <td>$70,663.00</td>
                            <td>Unqualified</td>
                            <td>14%</td>
                        </tr>

                        <tr>
                            <td><Checkbox/></td>
                            <td>James Match</td>
                            <td>Canada</td>
                           {/* <td>
                                <div className="no-idea">
                                    <div className="flag-holder">
                                        <Flags.CA style={{ height: 20 }} />
                                    </div>
                                    Canada
                                </div>
                            </td>*/}
                            <td>Tony Bowcher</td>
                            <td>09/13/2015</td>
                            <td>$70,663.00</td>
                            <td>Unqualified</td>
                            <td>14%</td>
                        </tr>
                        <tr>
                            <td><div className="center-everything"><Checkbox/></div></td>
                            <td>James Match</td>
                            <td>
                                <div className="no-idea">
                                    <div className="flag-holder">
                                        <Flags.SV style={{ height: 20 }} />
                                    </div>
                                    El Salvador
                                </div>
                            </td>
                            <td>Tony Bowcher</td>
                            <td>09/13/2015</td>
                            <td>$70,663.00</td>
                            <td>Unqualified</td>
                            <td>14%</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    );
});

export const TableExample = () => {
    return (
        <NavPageView title="Table Example">
            <Card elevation={2} style={{ margin: "15px 25px" }}>
                <MyTable />
            </Card>
        </NavPageView>
    );
};
