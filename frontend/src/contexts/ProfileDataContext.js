import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";

// Context objects
const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

// Custom hooks
export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    listProfiles: { results: [] },
  });

  const currentUser = useCurrentUser();

  /*
    Makes API request to the /profiles/ endpoint
    Sends profile information
    Updates profile page and listProfiles data
  */
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-task_count"
        );
        setProfileData((prevState) => ({
          ...prevState,
          listProfiles: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();

  }, [currentUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={{setProfileData}}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};