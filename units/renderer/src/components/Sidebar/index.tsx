import React from 'react';
import styles from './style.module.scss';
import classnames from 'classnames/bind';
import { Icon, IconName } from '@blueprintjs/core';
import { appRoutes, devAppRoutes, RouteConf } from '@/routing/route_list';
import { InputGroup } from '@blueprintjs/core';
import { Link, useLocation } from 'react-router-dom';

const cx = classnames.bind(styles);

const SidebarHome = React.memo(() => {
    return (
        <div className={cx('sidebar-home')}>
            <InputGroup
                placeholder="Search"
                intent="none"
                fill={true}
                leftIcon="search"
            />
        </div>
    );
});

interface SidebarNavSectionProps {
    icon?: IconName;
    label: string;
}

const SidebarNavSection: React.FC<SidebarNavSectionProps> = props =>
{
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    return (
        <React.Fragment>
            <div className={cx('nav-label')} onClick={() => setIsCollapsed(!isCollapsed)}>
                {props.icon && <Icon icon={props.icon} iconSize={18} />}
                <span className={cx('txt')}>{props.label}</span>
                <div className={cx('arrow-container', { 'collapsed': isCollapsed })}>
                    <Icon icon={isCollapsed ? "caret-left" : "caret-down"} iconSize={19} />
                </div>
            </div>
            <ul className={cx("sidebar-nav", { 'collapsed': isCollapsed })}>
                {props.children}
            </ul>
        </React.Fragment>
    );
};

interface SidebarNavLinkProps {
    label: string;
    active?: boolean;
    target: string
};

const SidebarNavLink = React.memo((props: SidebarNavLinkProps) => {
    return (
        <li className={cx('nav-item', { 'active': props.active })}>
            <Link to={props.target}>
                {props.label}
            </Link>
        </li>
    );
});

const SidebarRouteEntry: React.FC<{
    conf: RouteConf
}> = ({ conf }) => {
    const location = useLocation();
    const active = location.pathname.startsWith(conf.path)

    return (
        <SidebarNavLink
            active={active}
            label={conf.name}
            target={conf.path}
        />
    );
};

const SidebarBody = () => {
    return (
        <div className={cx('sidebar-body')}>
            <SidebarNavSection
                icon="oil-field"
                label="Inventory"
            >
                <SidebarRouteEntry conf={appRoutes.home} />
                <SidebarRouteEntry conf={appRoutes.stock.updateStock} />
                <SidebarRouteEntry conf={appRoutes.stock.storeItems} />
                <SidebarRouteEntry conf={appRoutes.customer.cart} />
            </SidebarNavSection>


            <SidebarNavSection
                icon="key-delete"
                label="Developement"
            >
                <SidebarRouteEntry conf={devAppRoutes.scratch} />
            </SidebarNavSection>
        </div>
    );
};

export const Sidebar = React.memo(() => {
    return (
        <div className={cx("sidebar")}>
            <SidebarHome />
            <SidebarBody />
        </div>
    );
});
