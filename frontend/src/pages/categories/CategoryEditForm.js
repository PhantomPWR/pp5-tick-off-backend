import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/CategoryCreateEditForm.module.css";
import { axiosRes } from "../../api/axiosDefaults";

function CategoryCreateForm(props) {
  const { setCategories } = props;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleChange = (event) => {
    setTitle(event.target.value);
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post("/categories/", {
        title,
        description
      });
      setCategories((prevCategories) => ({
        ...prevCategories,
        results: [data, ...prevCategories.results],
      }));
      setTitle("");
      setDescription("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      {/* Title */}
      <Form.Group>
        <InputGroup>
          <Form.Control
            className={styles.Form}
            placeholder="Enter category title"
            aria-label="Category Title"
            as="text"
            value={title}
            onChange={handleChange}
          />
        </InputGroup>
      </Form.Group>

      {/* Description */}
      <Form.Group>
        <InputGroup>
          <Form.Control
            className={styles.Form}
            placeholder="Enter category description"
            aria-label="Category Description"
            as="text"
            value={description}
            onChange={handleChange}
          />
        </InputGroup>
      </Form.Group>
      <button
        className={`${styles.Button} btn d-block ms-auto`}
        disabled={!title.trim()}
        type="submit"
      >
        add
      </button>
    </Form>
  );
}

export default CategoryCreateForm;