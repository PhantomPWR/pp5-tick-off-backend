import axios from 'axios';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCurrentUser } from '../contexts/CurrentUserContext';

export const useRedirect = (userAuthStatus) => {
  const history = useHistory();
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post('/dj-rest-auth/token/refresh/');
        // user IS logged in
        if (userAuthStatus === 'loggedIn') {
          const profileId = currentUser.profile_id;
          history.push(`/profiles/${profileId}`);
          // history.push('/');
        }
      } catch (err) {
        // user is NOT logged in
        if (userAuthStatus === 'loggedOut') {
          history.push('/signin');
        }
      }
    };

    handleMount();
  }, [history, userAuthStatus, currentUser]);
};