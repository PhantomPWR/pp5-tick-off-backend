import React from "react";
import { Media } from "react-bootstrap";
import { MoreDropdown } from "../../components/MoreDropdown";
import { axiosRes } from "../../api/axiosDefaults";

const Category = (props) => {
  const {
    id,
    title,
    description,
    setCategories,
  } = props;
//   const [showEditForm, setShowEditForm] = useState(false);

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/categories/${id}/`);
      setCategories((prevCategories) => ({
        ...prevCategories,
        results: prevCategories.results.filter((category) => category.id !== id),
      }));
    } catch (err) {}
  };

  return (
    <>
      <hr />
      <Media className="row">
        <div className="row align-items-center">
            {/* Category Description */}
            <Media.Body className="align-self-center">
                <span>{id}</span>
                <h3>{title}</h3>
                <p>{description}</p>
            {/* )} */}
            </Media.Body>
        </div>
        {/* MoreDropdown */}
        <div className="col d-flex justify-content-end">
            <MoreDropdown
            handleDelete={handleDelete}
            />
        </div>
      </Media>
    </>
  );
};

export default Category;