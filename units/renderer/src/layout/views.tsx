import React from 'react';
import classNames from 'classnames/bind';
import styles from './style.module.scss';

import { Icon, Card } from '@blueprintjs/core';

const cx = classNames.bind(styles);

export const MockChildBlock = (props: React.PropsWithChildren<{ color?: string }>) => {
    return (
        <div style={{ minHeight: "100%", minWidth: "100%", backgroundColor: props.color || 'red' }}>
            {props.children}
        </div>
    );
}

export const SidebarPaddedView = React.memo(({ children }) => {
    return (
        <div className={cx("content")}>
            <div className={cx("content-body")}>
                {children}
            </div>
        </div>
    );
});

interface NavPageViewProps {
    title: string;
}

const NavPageViewHeader = (props: {title: string}) => {
    return (
        <Card elevation={1} className={cx('content-body-header-main')}>
            <Icon icon="full-circle" color="#0c9fcc" />
            <span style={{ fontSize: 20, fontWeight: 400, marginLeft: 7 }}>
                {props.title}
            </span>
        </Card>
    );
};


export const NavPageView = React.memo((props: React.PropsWithChildren<NavPageViewProps>) => {
    return (
        <SidebarPaddedView>
            <NavPageViewHeader title={props.title} />

            {props.children}
        </SidebarPaddedView>
    );
});
