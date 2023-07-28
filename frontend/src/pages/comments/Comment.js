import React, { useState } from "react";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import styles from "../../styles/Comment.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import { axiosRes } from "../../api/axiosDefaults";
import CommentEditForm from "./CommentEditForm";

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_date,
    content,
    id,
    setTask,
    setComments,
  } = props;
  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setTask((prevTask) => ({
        results: [
          {
            ...prevTask.results[0],
            comments_count: prevTask.results[0].comments_count - 1,
          },
        ],
      }));

      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {}
  };

  return (
    <>
      <hr />
      <Media className="row">
        <div className="row align-items-center">
          {/* Date */}
          <div className="col-2">
            <span className={styles.Date}>{updated_date}</span>
          </div>
          <div className="col d-flex justify-content-start">
            {/* Profile Image */}
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={profile_image}  height={70}/>
            </Link>
            <div className="col mt-2">
              {/* Username */}
              <span className={styles.Owner}>{owner}</span>
              {/* Comment Content */}
              <Media.Body className="align-self-center">
                {showEditForm ? (
                  <CommentEditForm
                  id={id}
                  profile_id={profile_id}
                  content={content}
                  profileImage={profile_image}
                  setComments={setComments}
                  setShowEditForm={setShowEditForm}
                  />
                  ) : (
                  <p>{content}</p>
                )}
              </Media.Body>
            </div>
          </div>
          {/* MoreDropdown */}
          <div className="col d-flex justify-content-end">
            {is_owner && !showEditForm && (
              <MoreDropdown
                handleEdit={() => setShowEditForm(true)}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </Media>
    </>
  );
};

export default Comment;