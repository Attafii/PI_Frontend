import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8001/api/users")
      .then((response) => {
        setUsers(response.data); // dépend de ce que renvoie ton API
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des utilisateurs :", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
