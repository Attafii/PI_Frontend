import React, { useState, useEffect } from "react";
import { Card, Table, Button, Typography, Space, Tag, Spin, notification } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const FormationDetailComponent = () => {
  const { id } = useParams(); // Retrieve the formation id from the URL
  const navigate = useNavigate(); // For navigation
  const [formation, setFormation] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // User state for authentication

  useEffect(() => {
    // Fetch the current user (simulate authentication check)
    const fetchUser = () => {
      const loggedUser = localStorage.getItem("user");
      setUser(loggedUser ? JSON.parse(loggedUser) : null);
    };
    fetchUser();

    const fetchFormationDetail = async () => {
      try {
        const formationResponse = await axios.get(`http://localhost:8001/api/formations/${id}`);
        setFormation(formationResponse.data);

        const sessionsResponse = await axios.get(`http://localhost:8001/api/sessions/getSessionsByFormation/${id}`);
        setSessions(sessionsResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la formation :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormationDetail();
  }, [id]);

  const handleRegister = async (sessionId) => {
    if (!user) {
      // If not logged in, redirect to login page
      localStorage.setItem("targetSession", sessionId); // Store the target session
      navigate("/signin");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8001/api/candidats/subscribe", {
        candidatId: user._id,
        sessionId,
      });

      // Success notification
      notification.success({
        message: "Inscription réussie",
        description: "Vous êtes inscrit à cette session avec succès.",
      });

      // Update sessions to reflect changes (if needed)
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session._id === sessionId ? { ...session, inscrits: session.inscrits + 1 } : session
        )
      );
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      notification.error({
        message: "Erreur d'inscription",
        description: error.response?.data?.message || "Une erreur est survenue lors de l'inscription.",
      });
    }
  };

  const handleDownload = () => {
    if (formation.programme) {
      const fileUrl = `http://localhost:8001${formation.programme}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", formation.programme.split("/").pop()); // Add download attribute
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Le programme de formation n'est pas disponible.");
    }
  };

  const sessionColumns = [
    {
      title: "Date de début",
      dataIndex: "date_debut",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Date de fin",
      dataIndex: "date_fin",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Planning des séances",
      dataIndex: "planning_seances",
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <EyeOutlined />
        </a>
      ),
    },
    {
      title: "Inscription",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleRegister(record._id)}
          disabled={record.inscrits >= 15} // Disable button if session is full
          style={{ backgroundColor: record.inscrits >= 15 ? "#d9d9d9" : "#4CAF50", borderColor: "#4CAF50" }}
        >
          {record.inscrits >= 15 ? "Complet" : "S'inscrire"}
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "0 auto" }} />;
  }

  if (!formation) {
    return <div>Formation non trouvée</div>;
  }

  return (
    <div style={{ padding: "30px", display: "flex", justifyContent: "center", position: "relative" }}>
      <Card
        style={{
          width: "80%",
          maxWidth: "900px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Title level={2} style={{ textAlign: "center" }}>
          {formation.titre}
        </Title>
        <p>{formation.description}</p>
        <Space wrap style={{ marginBottom: "15px" }}>
          {formation.tags &&
            formation.tags.map((tag) => (
              <Tag key={tag._id} color="blue">
                {tag.nom}
              </Tag>
            ))}
        </Space>

        <div style={{ marginBottom: "20px" }}>
          <strong>Niveau de difficulté:</strong> {formation.niveau_difficulte}
        </div>

        {formation.programme && (
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            style={{
              width: "100%",
              maxWidth: "300px",
              margin: "20px auto",
              backgroundColor: "#1890ff",
              color: "white",
              fontSize: "16px",
              padding: "12px 24px",
            }}
          >
            Télécharger le Programme
          </Button>
        )}

        <Title level={4}>Sessions disponibles</Title>
        <Table
          columns={sessionColumns}
          dataSource={sessions}
          rowKey="_id"
          pagination={false}
          bordered
        />
      </Card>
    </div>
  );
};

export default FormationDetailComponent;
