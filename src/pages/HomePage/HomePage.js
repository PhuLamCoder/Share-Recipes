import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';

import styles from './HomePage.module.scss';
import FoodItem from '~/pages/HomePage/components/FoodItem';
import Pagination from '~/components/Pagination';
import images from '~/assets/images';
import axios from '~/utils/api';
// Search context
import useSearch from '~/hooks/useSearch';
import { useSearchParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [page, setPage] = useState(() => {
        return Number.parseInt(searchParams.get('page')) || 1;
    });

    const [totalPage, setTotalPage] = useState(0);
    const per_page = 8;

    const [totalItem, setTotalItem] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [recipeList, setRecipeList] = useState([]);
    const [isLoading, setIsloading] = useState(false);

    // Search context
    const { keyword } = useSearch();

    const [category, setCategory] = useState(() => {
        return searchParams.get('category') || '';
    });

    const [sort, setSort] = useState(() => {
        return searchParams.get('sort_by') || 'date';
    });

    useEffect(() => {
        setIsloading(true);
        axios
            .get(
                `recipes?category=${category}&page=${page}&per_page=${per_page}&sort_by=${sort}&keyword=${keyword}`,
            )
            .then((response) => {
                const data = response.data;
                setPage(data.page);
                setTotalPage(data.total_page);
                setRecipeList(data.data);
            })
            .catch((err) => {
                // console.log(err);
            });
        setIsloading(false);
    }, [keyword, page, category, sort]);

    useEffect(() => {
        axios
            .get(`recipe-categories`)
            .then((response) => {
                const data = response.data;
                setCategoryList(data.data);
            })
            .catch((err) => {
                // console.log(err);
            });
        axios
            .get(`recipes/count`)
            .then((response) => {
                const data = response.data.data;
                setTotalItem(data.count);
            })
            .catch((err) => {
                // console.log(err);
            });
    }, []);

    function handleChangeCategory(e) {
        setCategory(e.target.value);
        setSearchParams((prev) => {
            prev.set('category', e.target.value);
            return prev;
        });
    }

    function handleChangeSort(e) {
        setSort(e.target.value);
        setSearchParams((prev) => {
            prev.set('sort_by', e.target.value);
            return prev;
        });
    }

    function handlePageChange(page) {
        setPage(page);
        setSearchParams((prev) => {
            prev.set('page', page);
            return prev;
        });
    }

    return (
        <Container className={`${cx('wrapper')}`}>
            <div
                className={cx('brand')}
                style={{
                    backgroundImage: `url(${images.background})`,
                }}
            >
                <h1 className={cx('slogan')}>HỌC, NẤU & THƯỞNG THỨC</h1>
                <div className={cx('info')}>
                    <div className={cx('info-item')}>
                        <p className={cx('info-item-number')}>{totalItem}</p>
                        <p className={cx('info-item-title')}>Công thức</p>
                    </div>
                    <div className={cx('info-item')}>
                        <p className={cx('info-item-number')}>{categoryList.length - 1}</p>
                        <p className={cx('info-item-title')}>Loại</p>
                    </div>
                </div>
            </div>

            <div className={cx('filter')}>
                <p className={cx('filter-name')}>
                    {keyword !== '' ? `Từ khóa "${keyword}"` : 'TẤT CẢ CÔNG THỨC'}
                </p>

                <div className={cx('filter-group')}>
                    <div className={cx('filter-control')}>
                        <label className={cx('filter-label')} htmlFor="category">
                            Loại:
                        </label>

                        <select
                            onChange={handleChangeCategory}
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

                    <div className={cx('filter-control')}>
                        <label className={cx('filter-label')} htmlFor="sort-food">
                            Sắp xếp:
                        </label>

                        <select
                            onChange={handleChangeSort}
                            className={cx('filter-select')}
                            id="sort-food"
                        >
                            <option value="date">Ngày đăng</option>
                            <option value="rating">Đánh giá</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <Row>
                    {isLoading ? (
                        <Spinner animation="grow" variant="success" />
                    ) : (
                        recipeList.map((recipe) => (
                            <Col xs={6} md={4} lg={3} key={recipe.recipeid}>
                                <FoodItem {...recipe} />
                            </Col>
                        ))
                    )}
                </Row>

                {totalPage > 1 ? (
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

export default HomePage;
