import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, addCategory } from "../redux/auth/categorySlice";
import { addCourse, fetchCourses } from "../redux/auth/courseSlice";
import { fetchUsers } from "../redux/auth/userSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddCourseForm = () => {
  const dispatch = useDispatch();

  // Redux States
  const { categories } = useSelector((state) => state.categories);
  const { list: users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);

  // Local State
  const [formData, setFormData] = useState({
    title: "",
    level: "",
    category: "",
    description: "",
    instructor: "",
    price: "",
    longDescription: "",
    goals: "",
    image: null,
  });
  const [newCategory, setNewCategory] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.role === "admin") {
      dispatch(fetchCategories());
      dispatch(fetchUsers());
    }
  }, [dispatch, user?.role]);

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Change
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Add new category if needed
    if (newCategory && !categories.some((cat) => cat.name === newCategory)) {
      dispatch(addCategory(newCategory));
      setNewCategory("");
    }

    // Submit Course
    const courseData = new FormData();
    Object.keys(formData).forEach((key) => {
      courseData.append(key, formData[key]);
    });
    courseData.append("createdBy", user?._id);
    dispatch(addCourse(courseData))
      .unwrap()
      .then(() => {
        dispatch(fetchCourses());
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      {/* Button to open the modal */}
      <button
        className="mb-3 btn btn-secondary"
        onClick={() => setShowModal(true)}
      >
        Ajouter une nouvelle catégorie
      </button>

      {/* Modal for Adding a New Category */}
      <div
        className={`modal ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="categoryModalLabel"
        // aria-hidden={!showModal}
        onClick={(e) => {
          if (e.target.classList.contains("modal")) {
            setShowModal(false);
          }
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="categoryModalLabel">
                Ajouter une nouvelle catégorie
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>

            <div className="modal-body">
              <form>
                <input
                  type="text"
                  className="form-control focus-ring focus-ring-warning border"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Entrez une nouvelle catégorie"
                />
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Fermer
              </button>

              <button
                type="button"
                className="btn btn-warning"
                onClick={() => {
                  if (newCategory) {
                    dispatch(addCategory(newCategory));
                    setNewCategory("");
                    setShowModal(false);
                  } else {
                    toast.error("Champ obligatoire !");
                  }
                }}
              >
                Ajouter catégorie
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <input type="hidden" name="createdBy" value={user?._id} required />

          {/* FirstRow */}
          <div className="d-flex flex-wrap">
            {/* Category Selection */}
            <div className="mb-2 me-2">
              <select
                name="category"
                onChange={handleInputChange}
                defaultValue=""
                className="form-select mb-2 focus-ring focus-ring-warning border"
              >
                <option value="" disabled>
                  Selectionner Categorie
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Selection */}
            <div className="mb-2 me-2">
              <select
                name="level"
                onChange={handleInputChange}
                className="form-select form-select-secondary mb-2 focus-ring focus-ring-warning border"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Selectionner niveau
                </option>

                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Instructor Selection */}
            <div className="mb-2 me-2">
              <select
                name="instructor"
                onChange={handleInputChange}
                className="form-select mb-2 focus-ring focus-ring-warning border"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Selectionner formateur
                </option>
                {users
                  .filter((user) => user.role === "instructor")
                  .map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* title field */}
          <div className="d-flex flex-wrap">
            <div className=" col-md me-2 mb-2">
              <label className=" form-label text-wrap">
                Titre de formation
              </label>
              <input
                name="title"
                type="text"
                className="form-control focus-ring focus-ring-warning border"
                placeholder="Ecrire quelque chose..."
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Description field */}
            <div className=" col-md mb-2">
              <label className="  form-label text-wrap">Description</label>

              <input
                name="description"
                type="text"
                className="form-control focus-ring focus-ring-warning border"
                placeholder="Ecrire quelque chose..."
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* imagePrice field */}
          <div className="d-flex flex-wrap">
            {/* Price field */}
            <div className="mb-2 col-md me-2">
              <label htmlFor="file" className="form-label  ">
                Prix de formation
              </label>
              <input
                name="price"
                className="form-control focus-ring focus-ring-warning border"
                type="number"
                placeholder="Prix"
                step={10}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Image field */}
            <div className="mb-2 col-md">
              <label htmlFor="file" className="form-label  ">
                Choisir image de couverture
              </label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="form-control focus-ring focus-ring-warning border"
                id="file"
              />
            </div>
          </div>

          {/* TextArea field */}
          <div className="d-flex flex-wrap">
            {/* DetailedDescription field */}
            <div className=" col-md me-2 mb-2">
              <label className="form-label   text-wrap">
                Description détaillée
              </label>
              <textarea
                name="longDescription"
                className="form-control focus-ring focus-ring-warning border"
                placeholder="Ecrire quelque chose..."
                onChange={handleInputChange}
                style={{ height: "100px" }}
                required
              ></textarea>
            </div>

            {/* Goals field */}
            <div className=" col-md mb-2">
              <label className="form-label   text-wrap">Objectifs</label>
              <textarea
                name="goals"
                className="form-control focus-ring focus-ring-warning border"
                placeholder="Ecrire quelque chose..."
                onChange={handleInputChange}
                style={{ height: "100px" }}
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* SubmitButton */}
        <div className="d-grid col-6 mx-auto my-4">
          <button className="btn btn-warning" type="submit">
            Ajouter la formation
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
