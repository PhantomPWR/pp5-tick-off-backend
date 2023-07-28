import React, { useRef } from "react";
import { Button, Form } from "react-bootstrap";

import styles from '../styles/SearchBar.module.css';

function SearchBar({ query, setQuery }) {

    const formRef = useRef(null);
    const clearForm = () => {
        formRef.current.reset();
        setQuery("");
    };

  return (
    <Form
      ref={formRef}
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

      <div className="row mb-3">
        {/* Task Status */}
        <div className="col-4">
          <Form.Control
            className="col-4"
            as="select"
            name="task_status"
            onChange={(event) => setQuery(event.target.value)}
            aria-label="task status"
          >
            <option value="">Select task status</option>
            <option key="BACKLOG" value="BACKLOG">Backlog</option>
            <option key="TODO" value="TODO">To Do</option>
            <option key="INPROGRESS" value="INPROGRESS">In Progress</option>
            <option key="COMPLETED" value="COMPLETED">Completed</option>
          </Form.Control>
        </div>

        {/* Task Priority */}
        <div className="col-4">
          <Form.Control
            as="select"
            name="priority"
            onChange={(event) => setQuery(event.target.value)}
            aria-label="task priority"
          >
            <option value="">Select task priority</option>
            <option key="PRIORITY1" value="PRIORITY1">Priority 1</option>
            <option key="PRIORITY2" value="PRIORITY2">Priority 2</option>
            <option key="PRIORITY3" value="PRIORITY3">Priority 3</option>
          </Form.Control>
        </div>
        {/* Clear filters */}
        <Button className="col-4" type="button" onClick={clearForm}>
          Clear filters
        </Button>
      </div>
    </Form>
  );
}

export default SearchBar;
