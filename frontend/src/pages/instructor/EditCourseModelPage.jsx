/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearCurrentCourse,
  fetchCourseDetailsById,
} from "../../redux/auth/courseSlice";
import VideoPlayer from "../../components/VideoPlayer";
import CustomSpinner from "../../components/CustomSpinner";

const EditCourseModelPage = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { currentCourse, courseModules, loading, error } = useSelector(
    (state) => state.courses
  );

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetailsById(courseId));
    }

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch]);

  if (loading) return <CustomSpinner />;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="container">
      <h1>Edit course Modules</h1>
      {currentCourse && (
        <div className=" mt-4">
          <div className="col-12 card">
            <img
              src={`http://localhost:5000/${currentCourse?.image.replace(
                /\\/g,
                "/"
              )}`}
              className="card-img-top"
              alt={currentCourse.title}
              style={{ width: "100px" }}
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
          <div className="col-12 ">
            {courseModules?.length > 0 ? (
              courseModules.map((module) => (
                <ModuleCard key={module?._id} module={module} />
              ))
            ) : (
              <p>No modules available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ModuleCard = ({ module }) => (
  <div className="container card">
    <h1 className="card-title">{module?.title}</h1>
    <div className=" container col-12 gap-4 d-flex">
      <div className="col-4 card">
        <h5>test</h5>
        <p>Minimum Score: {module?.test?.minimum_score}</p>
        {module?.test?.questions.map((question) => (
          <div key={question?._id}>
            <h3 className="card-text">{question?.question}</h3>
            {question?.options.map((option, index) => (
              <p key={index} className="card-text">
                {option}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div className="col-8 card">
        <h5>Videos</h5>
        {module?.videos.map((video) => (
          <div key={video?._id}>
            <VideoPlayer video={video} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default EditCourseModelPage;
