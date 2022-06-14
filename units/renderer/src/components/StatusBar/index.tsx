import React from 'react';

import styles from './style.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export const StatusBar = React.memo(() => {
    return (
        <div className={cx('statusbar-main')}>
            {/*Hello*/}
        </div>
    )
});
