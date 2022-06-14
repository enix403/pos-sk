import React from 'react'
import classnames from 'classnames/bind';
import styles from './rc.module.scss';

const cx = classnames.bind(styles);

export function RenderCount() {
  const renders = React.useRef(0);

  return <i className={cx('circle')}>{++renders.current}</i>;
}
