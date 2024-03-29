import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMagnifyingGlass, faHouse } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import Pagination from '~/components/Pagination';
import FavouriteItem from './components/FavouriteItem';
import styles from './FavouritePage.module.scss';
import axios from '~/utils/api';
import useAuth from '~/hooks/useAuth';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function FavouritePage() {
    const { auth } = useAuth();
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const per_page = 4;

    const [category, setCategory] = useState('');

    const [keyword, setKeyword] = useState('');
    const keywordRef = useRef();
    const [favouriteList, setFavouriteList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        axios
            .get(
                `/user/favourites?page=${page}&per_page=${per_page}&keyword=${keyword}&category=${category}`,
                {
                    headers: {
                        Authorization: auth.token,
                    },
                },
            )
            .then((response) => {
                const data = response.data;
                setPage(data.page);
                setTotalPage(data.total_page);
                setFavouriteList(data.data);
            })
            .catch((err) => {
                // console.log(err);
            });
    }, [page, keyword, category, auth]);

    useEffect(() => {
        axios
            .get(`recipe-categories`)
            .then((response) => {
                const data = response.data;
                setCategoryList(data.data);
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message | 'Lỗi server!');
            });
    }, []);

    function handlePageChange(page) {
        setPage(page);
    }

    function handleSubmitSearch(e) {
        e.preventDefault();
        setKeyword(keywordRef.current.value);
    }

    function handleDeleteFavourite(recipeId) {
        axios
            .delete(`user/favourites/${recipeId}`, {
                headers: {
                    Authorization: auth.token,
                },
            })
            .then((response) => {
                const data = response.data;
                toast.warning(data.message);
                if (favouriteList.length === 1 && page > 1) {
                    setPage(page - 1);
                } else {
                    setFavouriteList((prev) =>
                        prev.filter((recipe) => recipe.recipeid !== recipeId),
                    );
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    }

    return (
        <Container className={cx('wrapper')}>
            <div className={cx('title-wrapper')}>
                <h1 className={cx('title')}>
                    Công Thức Yêu Thích <FontAwesomeIcon icon={faStar} />
                </h1>
            </div>
            <div className={cx('main')}>
                <div className={cx('control')}>
                    <form id="search-form" className={cx('search')} onSubmit={handleSubmitSearch}>
                        <input
                            ref={keywordRef}
                            placeholder="Tìm kiếm ..."
                            spellCheck={false}
                            name="search"
                        />
                        <button className={cx('search-btn')}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </form>

                    <div className={cx('filter-control')}>
                        <label className={cx('filter-label')} htmlFor="category">
                            Loại:
                        </label>

                        <select
                            onChange={(e) => setCategory(e.target.value)}
                            className={cx('filter-select')}
                            id="category"
                        >
                            <option value="all">Tất cả</option>
                            {categoryList.map((category) => (
                                <option key={category.categoryid} value={category.categoryid}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <Row className="gx-3">
                    {favouriteList.length > 0 ? (
                        favouriteList.map((recipe) => (
                            <Col xs={12} md={6} lg={4} xl={3} key={recipe.recipeid}>
                                <FavouriteItem onDelete={handleDeleteFavourite} {...recipe} />
                            </Col>
                        ))
                    ) : category === '' && keyword.trim() === '' ? (
                        <div className={cx('alert-no-items')}>
                            <span className={cx('alert-content')}>
                                Bạn chưa có công thức yêu thích nào!
                            </span>
                            <Button
                                center
                                primary
                                rightIcon={
                                    <FontAwesomeIcon className={cx('icon-custom')} icon={faHouse} />
                                }
                                to={'/'}
                            >
                                Về trang chủ
                            </Button>
                        </div>
                    ) : (
                        <div className={cx('alert-no-items')}>
                            <span className={cx('alert-content')}>Không tìm thấy công thức!</span>
                        </div>
                    )}
                </Row>
                {totalPage >= 2 ? (
                    <div className={cx('pagination-wrapper')}>
                        <Pagination
                            page={page}
                            total_page={totalPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                ) : (
                    false
                )}
            </div>
        </Container>
    );
}

export default FavouritePage;
