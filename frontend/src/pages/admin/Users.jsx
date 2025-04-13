import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  editUserRole,
  deleteUser,
  verifyUser,
} from "../../redux/auth/userSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { LinkToolTip } from "../learner/CourseDetails";
import CustomSpinner from "../../components/CustomSpinner";

const Users = () => {
  const dispatch = useDispatch();
  const { list: users, isLoading, error } = useSelector((state) => state.users);
  const [showUnverified, setshowUnverified] = useState(false);

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await dispatch(
        editUserRole({ id, role: newRole })
      ).unwrap();
      if (response) {
        toast.success("Role changé avec succée!");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(id)).unwrap();
        toast.success("Utilisateur supprimé !");
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleVerifyUser = async (id) => {
    try {
      const response = await dispatch(verifyUser(id)).unwrap();
      if (response) {
        toast.success("Utilisateur verifié");
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  const filteredUsers = showUnverified
    ? users.filter((user) => !user.isVerified)
    : users;
  if (isLoading) return <CustomSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="col-11 mx-auto">
      <div className=" pb-4 d-flex justify-content-between align-items-center">
        <h2>Liste des utilisateurs</h2>
        <LinkToolTip
          title={showUnverified ? "Afficher tout" : "Utilisateurs non verifié"}
          placement={"bottom"}
          className={
            "link-primary fs-5 link-offset-2 animate link-underline-opacity-25 link-underline-opacity-100-hover me-4"
          }
          onClick={() => setshowUnverified(!showUnverified)}
        >
          Filtrer <i className="bi bi-funnel"></i>
        </LinkToolTip>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive rounded">
          <table className=" table table-hover align-middle table-borderless table-striped">
            <thead className="table-light position-sticky text-center">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Cin</th>
                <th>N° telephone</th>
                <th>Role</th>
                <th>Email vérifié</th>
                <th>Vérifié</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="text-center">{user.cin}</td>
                  <td className="text-center">{user.tel}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      <option value="user">User</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="text-center">
                    {user.isEmailVerified ? "Oui" : "Non"}
                  </td>
                  <td className="text-center">
                    {user.isVerified ? "Oui" : "Non"}
                  </td>
                  <td className="text-center">
                    <Link
                      className="small link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover me-2"
                      onClick={() => handleDelete(user._id)}
                    >
                      Supprimer
                    </Link>
                    {!user.isVerified ? (
                      <>
                        <div className="vr"></div>
                        <Link
                          className=" link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover ms-2"
                          onClick={() => handleVerifyUser(user._id)}
                        >
                          Vérifier
                        </Link>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
