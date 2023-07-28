import React, {useState, useEffect} from "react";
import styles from "../../styles/Task.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useHistory } from "react-router-dom";
import { MoreDropdown } from "../../components/MoreDropdown";
import axios from "axios";
import { axiosRes } from "../../api/axiosDefaults";
import {
  Card,
  Media,
  Modal,
} from "react-bootstrap";


const status_choices = {
      BACKLOG: 'Backlog',
      TODO: 'To Do',
      INPROGRESS: 'In Progress',
      COMPLETED: 'Completed'
    }

const priority_choices = {
      PRIORITY1: '1',
      PRIORITY2: '2',
      PRIORITY3: '3',
    }

const Task = (props) => {
  const {
    id,
    owner,
    assigned_to,
    task_status,
    priority,
    category,
    title,
    description,
    image,
    created_date,
    due_date,
    completed_date,
    comment_count,
    taskPage,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const [assignedUser, setAssignedUser] = useState(null);
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const isDueDateInPast = new Date(due_date) < currentDate;
  const isDueDateToday = new Date(due_date).setHours(0, 0, 0, 0) === currentDate;

  const openModal = () => {
    setShowModal(true);
  };

  const handleEdit = () => {
    history.push(`/tasks/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/tasks/${id}/`);
      history.goBack();
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    if (assigned_to) {
      axios.get(`/profiles/${assigned_to}`).then((response) => {
        setAssignedUser(response.data.owner);
      });
    } else {
      setAssignedUser("No users assigned yet.");
    }
  }, [assigned_to]);

  return (
    <Card className={styles.Task}>
      <Card.Body className={styles.TaskBody}>
        <Media className="align-items-center justify-content-between">
          <Link to={`/tasks/${id}`}>
            {title && <Card.Title className="fs-2 text-center">{title}</Card.Title>}
          </Link>
          <div className="d-flex row-cols-4 justify-content-between align-items-center">
            <span className="col-md-3">Created<br/>{created_date}</span>
            {isDueDateInPast && task_status !== "COMPLETED" ? (
                <span className={`col-md-3 ms-auto ${styles.OverDue}`}>Overdue<br />{due_date}</span>
              ) : isDueDateToday && task_status !== "COMPLETED" ? (
                <span className={`col-md-3 ms-auto ${styles.DueToday}`}>Due Today<br />{due_date}</span>
              ) : (
                <span className="col-md-3 ms-auto">Due on<br />{due_date}</span>
              )}
            {/* <span className="col-md-3 ms-auto">{`${task_status === "COMPLETED" ? `Completed on<br/>${completed_date.substr(0, 10)}` : ""}`}</span> */}
            <span className="col-md-3 ms-auto" dangerouslySetInnerHTML={{ __html: `${task_status === "COMPLETED" ? `Completed on<br/>${completed_date.substr(0, 10)}` : ""}` }}></span>
            <span className="col-1 d-flex justify-content-end">
              {is_owner && taskPage && (
                <MoreDropdown
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              )}
            </span>
          </div>
        </Media>
      </Card.Body>

      <Card.Body  className={styles.TaskBody}>
        <div className={styles.TaskBar}>            
            {/* Assigned Users */}
            <div align='center'>
              <strong className="fw-bold">Assigned to: </strong>
              <div className="row">
                <p className="col-6"><i className="fas fa-crown"></i>{owner}</p>
                <p className="col-6"><i className="fas fa-user-check" />{assignedUser}</p>
              </div>
            </div>
            <div className="row">
              {/* Category */}
              <span className="col-md-3">
                <i className="far fa-folder" />
                Category: {category}
              </span>

              {/* Task Status */}
              <span className="col-md-3">
                <i className="fas fa-list-check"></i>
                Status: {status_choices[task_status]}
              </span>

              {/* Priority */}
              <span className="col-md-3">
                <i className="fas fa-triangle-exclamation"></i>
                Priority: {priority_choices[priority]}
              </span>

              {/* Comment Count */}
              <span className="col-md-3">
                <i className="far fa-comments" />
                Comments: {comment_count}
              </span>
            </div>
        </div>
      </Card.Body>
      <Card.Body>
        <div className="row row-cols-1 row-cols-lg-4 justify-content-between">
          <div className="col col-lg-8">
            {description && <Card.Text align={'left'}>{description}</Card.Text>}
          </div>
          {taskPage && (
            <div className="col col-lg-2 text-center">
              <Card.Text className="d-flex align-items-center"><i className="fas fa-paperclip"></i> Attachment</Card.Text>
                <Card.Img src={image} alt={title} onClick={openModal} className="w-50
                 mx-auto" />
              <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                closeVariant="black"
                >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                  <Card.Img src={image} alt={title} />
                </Modal.Body>
              </Modal>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Task;