import classNames from 'classnames/bind';

import styles from './Menu.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function MenuItem({ data }) {
    const classes = cx('menu-item', {
        separate: data.separate,
    });
    return (
        <Button className={classes} leftIcon={data.icon} to={data.to} onClick={data.onClick}>
            {data.title}{' '}
            {data?.alert > 0 ? <span className={cx('menu-item-alert')}>{data?.alert}</span> : ''}
        </Button>
    );
}

export default MenuItem;
