import React, { useState, useEffect } from "react";
import {Row, Col} from "react-bootstrap";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Category from "../categories/Category";

function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: category }] = await Promise.all([
          axiosReq.get(`/categories/${id}`),
        ]);

        setCategory({ results: [category] });
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();

  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2">
        <Category {...category.results[0]} setCategories={setCategory} CategoryPage />
      </Col>
    </Row>
  );
}

export default CategoryPage;