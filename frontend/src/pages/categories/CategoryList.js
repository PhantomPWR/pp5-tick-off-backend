import React, { useEffect, useState } from "react";

import { Container, Row, Col, Form } from "react-bootstrap";

import Category from "../categories/Category";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/CategoryList.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function CategoryList({ message, filter = "" }) {
  const [categories, setCategories] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();

  const [query, setQuery] = useState('');

  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const { data } = await axiosReq.get(`/categories/?${filter}&search=${query}`);
          setCategories(data);
          setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    setHasLoaded(false);
    // stop results flashing - fetch after 1s delay
    const timer = setTimeout(() => {
      fetchCategories();
    }, 1000);

    // Cleanup Function 
    return () => {
      clearTimeout(timer);
    };

  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="me-sm-2"
            placeholder="Search tasks"
            aria-label="Search Bar"
          />
        </Form>
        {hasLoaded ? (
          <>
            {categories.results.length ? (
              <InfiniteScroll
                children={
                  categories.results.map((category) => (
                    <Category key={category.id} {...category} setCategories={setCategories} />
                ))}
                dataLength={categories.results.length}
                loader={<Asset spinner />}
                hasMore={!!categories.next}
                next={() => fetchMoreData(categories, setCategories)}
              />
              
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
    </Row>
  );
}

export default CategoryList;