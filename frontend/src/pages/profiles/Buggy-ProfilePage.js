import React, { useEffect, useState } from "react";

import { Container, Row, Col, Image } from "react-bootstrap";

import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";

// import ProfileList from "./ProfileList";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Task from "../tasks/Task";
import { fetchMoreData } from "../../utils/utils";
import NoResults from '../../assets/no-results.png';
import { ProfileEditDropdown } from "../../components/MoreDropdown";
// import { useCurrentUser } from "../../contexts/CurrentUserContext";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileTasks, setProfileTasks] = useState({ results: [] });
  // const currentUser = useCurrentUser;
  const {id} = useParams();
  console.log(id);
  const setProfileData = useSetProfileData();
  const { pageProfile } = useProfileData();

  const [profile] = pageProfile.results;
  // const is_owner = currentUser?.username === profile?.owner;
  console.log(pageProfile, profileTasks);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [{ data: pageProfile}, { data: profileTasks } ] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/tasks/?owner__profile=${id}`),
          ]);
          setProfileData((prevState) => ({
            ...prevState,
            pageProfile: { results: [pageProfile] },
          }));
          if (isMounted) {
            setProfileTasks(profileTasks);
            setHasLoaded(true);
          }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    }
  }, [id, setProfileData]);

  const mainProfile = (
    <>
    {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={profile?.image}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <Row className='justify-content-center no-gutters'>
            <Col sm={6} className="my-2">
                <div>{profile?.task_count}</div>
                <div>tasks total</div>
            </Col>
          </Row>
        </Col>
        { profile?.content && (<Col className="p-3">{profile.content}</Col>) }
      </Row>
    </>
  );

  const mainProfileTasks = (
    <>
      <hr />
      <h2 className="text-center">My tasks</h2>
      <hr />
      {profileTasks.results.length ? (
        <InfiniteScroll
          children={profileTasks.results.map((task) => (
            <Task key={task.id} {...task} setTasks={setProfileTasks} />
          ))}
          dataLength={profileTasks.results.length}
          loader={<Asset spinner />}
          hasMore={!!profileTasks.next}
          next={() => fetchMoreData(profileTasks, setProfileTasks)}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} has no tasks yet.`}
        />
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {/* <ProfileList mobile /> */}
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainProfile}
              {mainProfileTasks}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        {/* <ProfileList /> */}
      </Col>
    </Row>
  );
}

export default ProfilePage;