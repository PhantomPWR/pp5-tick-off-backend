import React, { useEffect, useState } from "react";

import { Container, Row, Col } from "react-bootstrap";

import Task from "./Task";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/TaskList.module.css";
import { useLocation, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import ProfileList from "../profiles/ProfileList";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import SearchBar from "../../components/SearchBar";

function MyTaskList({ message, filter = "" }) {
  
  const [tasks, setTasks] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();
  const { taskStatus, taskPriority } = useParams();

  const [query, setQuery] = useState('');

  useEffect(() => {

    const fetchTasks = async () => {
      try {
        // let url = `/mytasks/?${filter}`;
        let url = `/mytasks/`;
        if (query) {
          url += `&search=${query}`;
        }
        if (taskStatus) {
          url += `&task_status=${taskStatus}`;
        }
        if (taskPriority) {
          url += `&priority=${taskPriority}`;
        }
        const { data } = await axiosReq.get(url);
        setTasks(data);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };


    setHasLoaded(false);
    // stop results flashing - fetch after 1s delay
    const timer = setTimeout(() => {
      fetchTasks();
    }, 1000);

    // Cleanup Function 
    return () => {
      clearTimeout(timer);
    };

  }, [filter, query, pathname, currentUser, taskStatus, taskPriority]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <ProfileList mobile />
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <SearchBar query={query} setQuery={setQuery} />
        {hasLoaded ? (
          <>
            {tasks.results.length ? (
              <InfiniteScroll
                children={
                  tasks.results.map((task) => (
                    <Task key={task.id} {...task} setTasks={setTasks} />
                ))}
                dataLength={tasks.results.length}
                loader={<Asset spinner />}
                hasMore={!!tasks.next}
                next={() => fetchMoreData(tasks, setTasks)}
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
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        {/* <ProfileList /> */}
      </Col>
    </Row>
  );
}

export default MyTaskList;