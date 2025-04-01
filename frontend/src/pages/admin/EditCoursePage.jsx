import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearCurrentCourse,
  fetchCourseById,
} from "../../redux/auth/courseSlice";

const EditCoursePage = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { currentCourse, loading, error } = useSelector(
    (state) => state.courses
  );

  useEffect(() => {
    dispatch(fetchCourseById(courseId));

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <h1>Edit course</h1>
      <div className="container mt-4">
        {currentCourse && (
          <div className="card">
            <img
              src={`http://localhost:5000/${currentCourse.image.replace(
                /\\/g,
                "/"
              )}`}
              className="card-img-top"
              alt={currentCourse.title}
            />
            <div className="card-body">
              <h1 className="card-title">{currentCourse.title}</h1>
              <p className="card-text">{currentCourse.description}</p>
              <div className="mb-3">
                <span className="badge bg-primary me-2">
                  Instructor: {currentCourse.instructor?.name}
                </span>
                <span className="badge bg-secondary me-2">
                  Category: {currentCourse.category?.name}
                </span>
                <span className="badge bg-success">
                  Level: {currentCourse.level}
                </span>
              </div>
              <h4 className="text-primary">{currentCourse.price} TND</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCoursePage;
