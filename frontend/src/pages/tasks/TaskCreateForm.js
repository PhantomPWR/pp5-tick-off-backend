import React, { useRef, useState, useEffect } from "react";
import Upload from "../../assets/upload.png";
import { Container, Row, Col, Form, Button, Image, Alert } from "react-bootstrap"
import styles from "../../styles/TaskCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from '../../hooks/useRedirect';
import "react-datepicker/dist/react-datepicker.css";


function TaskCreateForm() {
  useRedirect('loggedOut');

  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [
    taskCategoryChoices,
    setTaskCategoryChoices
    ] = useState([{'value': '', 'label': ''}]);


  // Fetch profiles from the API
  useEffect(() => {
      axios
        .get("/profile-list/")
        .then((response) => setUsers(response.data))
        .catch(
          (error) => {
            console.error('Error fetching profiles:', error)
          });
    }, []);

    // Fetch task category choices from the API
    useEffect(() => {
      const fetchTaskCategoryChoices = async () => {
        try {
          const response = await axiosReq.get('/category-choices/');
          const categoryChoices = response.data.map(category => ({
            key: category.id,
            value: category.value,
            label: category.label
          }));
          setTaskCategoryChoices(categoryChoices);
        } catch (error) {
          console.error('Error fetching category options:', error);
        }
      };

      fetchTaskCategoryChoices();
    }, []);
 

  const [taskData, setTaskData] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    task_status: '',
    priority: '',
    owner: '',
    created_date: '',
    due_date: '',
    updated_date: '',
    completed_date: '',
    assigned_to: '',
  });

  const {
    title,
    description,
    image,
    category,
    task_status,
    owner,
    priority,
    due_date,
    assigned_to,
  } = taskData;

  const imageInput = useRef(null);
  const history = useHistory();

  const handleChange = (event) => {
    setTaskData({
      ...taskData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setTaskData({
        ...taskData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleChangeDate = (event) => {
    setSelectedDate(event.target.value);
    setTaskData({
      ...taskData,
      due_date: event.target.value,
    });
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if assigned_to is empty
    if (!assigned_to) {
      setErrors({ assigned_to: ['Please select a user'] });
      return;
    }
    const formData = new FormData();

    formData.append('title', title);
    formData.append('category', taskData.category);
    formData.append('description', description);
    if (imageInput?.current?.files.length > 0) { // Check if an image file is selected
      formData.append('image', imageInput.current.files[0]);
    }
    formData.append('task_status', taskData.task_status);
    formData.append('priority', taskData.priority);
    formData.append('owner', owner);
    formData.append('due_date', due_date);
    formData.append('assigned_to', assigned_to);
  
    try {
        const {data} = await axiosReq.post('/tasks/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        history.push(`/tasks/${data.id}`)
    } catch(err){
        if (err.response?.status !== 401){
          // console.log(err.response?.data);
          setErrors(err.response?.data);
        }
    }

  }


  const textFields = (
    <div className="text-center">
      
      {/* Title */}
      <Form.Group>
        <Form.Label>Task Title</Form.Label>
        <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      
      {/* Category */}
      <Form.Group>
        <Form.Label>Task Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          value={category.id}
          onChange={handleChange}
          aria-label="task category"
        >
          <option value="">Select task category</option>
          {taskCategoryChoices.map((categoryChoice) => (
            <option 
            key={categoryChoice.value} 
            value={categoryChoice.value}>
              {categoryChoice.label}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {errors?.category?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      {/* Due Date */}
      <Form.Group>
        <Form.Label>Due Date</Form.Label>
        <Form.Control
            type="date"
            name="due_date"
            value={selectedDate}
            onChange={handleChangeDate}
        /> 
      </Form.Group>
      {errors?.description?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      
      {/* Description */}
      <Form.Group>
        <Form.Label>Task Description</Form.Label>
        <Form.Control
            as="textarea"
            rows={6}
            name="description"
            value={description}
            onChange={handleChange}
        /> 
      </Form.Group>
      {errors?.description?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      {/* Task Status */}
      <Form.Group>
        <Form.Label>Task Status</Form.Label>
        <Form.Control
          as="select"
          name="task_status"
          value={task_status}
          onChange={handleChange}
          aria-label="task status"
        >
          <option value="">Select task status</option>
          <option key="BACKLOG" value="BACKLOG">Backlog</option>
          <option key="TODO" value="TODO">To Do</option>
          <option key="INPROGRESS" value="INPROGRESS">In Progress</option>
          <option key="COMPLETED" value="COMPLETED">Completed</option>
        </Form.Control>
      </Form.Group>
      {errors?.task_status?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      {/* Task Priority */}
      <Form.Group>
        <Form.Label>Task Priority</Form.Label>
        <Form.Control
          as="select"
          name="priority"
          value={priority}
          onChange={handleChange}
          aria-label="task priority"
        >
          <option value="">Select task priority</option>
          <option key="PRIORITY1" value="PRIORITY1">1</option>
          <option key="PRIORITY2" value="PRIORITY2">2</option>
          <option key="PRIORITY3" value="PRIORITY3">3</option>
        </Form.Control>
      </Form.Group>
      {errors?.priority?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      {/* Assigned to */}
      <Form.Group>
        <Form.Label>Assigned to</Form.Label>
        <Form.Control
          as="select"
          name="assigned_to"
          className={appStyles.Input}
          value={assigned_to}
          onChange={handleChange}
          aria-label="assigned to"
        >
          <option>Select a user</option>
          {users.map((user) => (
            
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {errors?.assigned_to?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
    
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        create
      </Button>
    </div>
  );

  

  return (

    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={7} lg={7} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
        <Col className="py-2 p-0 p-md-2" md={5} lg={5}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                      htmlFor="image-upload"
                    >
                      Update image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="image-upload"
                >
                  <Asset
                    src={Upload}
                    message="Click or tap to upload an image"
                  />
                </Form.Label>
              )}

              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default TaskCreateForm;