import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin } from "antd";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { UserOutlined, IdcardOutlined, UnorderedListOutlined } from "@ant-design/icons";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from "recharts";

const StatisticsComponent = () => {
  const [loading, setLoading] = useState(true);
  const [candidatsTotal, setCandidatsTotal] = useState(0);
  const [formateursTotal, setFormateursTotal] = useState(0);
  const [formationsByCategory, setFormationsByCategory] = useState([]); // Nouvelle donnée
  const [sessionsByFormation, setSessionsByFormation] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const COLORS = ["#59a89c", "#082a54", "#e02b35", "#f0c571"];

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Récupérer le total des candidats
        const candidatsResponse = await axios.get("http://localhost:8001/api/users/candidatsTotal");
        setCandidatsTotal(candidatsResponse.data.count);

        // Récupérer le total des formateurs
        const formateursResponse = await axios.get("http://localhost:8001/api/users/formateursTotal");
        setFormateursTotal(formateursResponse.data.count || 0);

        // Récupérer les formations par catégorie (nouveau)
        const formationsCategoryResponse = await axios.get("http://localhost:8001/api/formations/countByCategory");
        setFormationsByCategory(formationsCategoryResponse.data); // Mettre à jour avec les données récupérées

        // Récupérer les formations
        const formationsResponse = await axios.get("http://localhost:8001/api/formations");
        const formationsData = formationsResponse.data;

        // Utiliser directement les données pour récupérer le nombre de sessions
        const sessionPromises = formationsData.map((formation) =>
          axios.get(`http://localhost:8001/api/sessions/getCountSessionsByFormation/${formation._id}`)
        );

        const sessionResponses = await Promise.all(sessionPromises);

        const sessionData = sessionResponses.map((response, index) => ({
          name: formationsData[index].titre, // Nom de la formation
          sessions: response.data.count,
        }));

        setSessionsByFormation(sessionData);

      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      } finally {
        setLoading(false);
        setLoadingSessions(false); // Changer le statut du chargement des sessions
      }
    };

    fetchStatistics();
  }, []);

  if (loading || loadingSessions) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", height: "90vh" }}>
      {/* Conteneur pour le fond whitesmoke et le défilement avec taille fixe */}
      <div
        style={{
          backgroundColor: "#f4f4f4",  // Whitesmoke background color
          flex: 1,
          height: "calc(100vh - 80px)", // Hauteur fixe pour le conteneur
          overflowY: "auto", // Permettre le scroll vertical
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          marginTop: "10px",  // Ajout d'un espace si une navbar existe
        }}
      >
        <Row gutter={[24, 24]}>

          {/* Card for Total Candidats */}
          <Col xs={24} sm={12} lg={8}>
            <Card
              title={<><UserOutlined style={{ marginRight: "10px" }} />Total Candidats</>}
              bordered={false}
              style={{
                textAlign: "center",
                backgroundColor: "#f7f7f7",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px"
              }}
            >
              <h1 style={{ fontSize: "48px", color: "#082a54" }}>{candidatsTotal}</h1>
            </Card>
          </Col>

          {/* Card for Total Formateurs */}
          <Col xs={24} sm={12} lg={8}>
            <Card
              title={<><IdcardOutlined style={{ marginRight: "10px" }} />Total Formateurs</>}
              bordered={false}
              style={{
                textAlign: "center",
                backgroundColor: "#f7f7f7",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px"
              }}
            >
              <h1 style={{ fontSize: "48px", color: "#082a54" }}>{formateursTotal}</h1>
            </Card>
          </Col>

          {/* Pie Chart - Nombre de Formations par Catégorie */}
          <Col xs={24} lg={12}>
            <Card
              title={<><UnorderedListOutlined style={{ marginRight: "10px" }} />Nombre de Formations par Catégorie</>}
              bordered={false}
              style={{
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px"
              }}
            >
              <PieChart width={400} height={400}>
      <Pie
        data={formationsByCategory}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ categorieName, count }) => `${categorieName}: ${count}`}
        outerRadius={120}
        fill="#8884d8"
        dataKey="count"
      >
        {formationsByCategory.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value, name, props) => [`${value} formations`, props.payload.categorieName]} />
    </PieChart>
            </Card>
          </Col>

          {/* Bar Chart - Nombre de Sessions par Formation */}
          <Col xs={24} lg={12}>
          <Card
  title={<><UnorderedListOutlined style={{ marginRight: "10px" }} />Nombre de Sessions par Formation</>}
  bordered={false}
  style={{
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px"
  }}
>
  {console.log(sessionsByFormation)}
  <BarChart width={400} height={300} data={sessionsByFormation}>
  <Legend layout="horizontal"  // Disposer les éléments de la légende horizontalement
      verticalAlign="top"  // Placer la légende en haut
      align="right"  />
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey="name" 
      angle={20} // Incliner les titres à 45 degrés
      textAnchor="start" // Alignement du texte pour une meilleure lisibilité
    />
    <YAxis />
    <RechartsTooltip />
    {/* <Legend /> */}
    <Bar dataKey="sessions" fill="#8884d8" />
  </BarChart>
</Card>

          </Col>

        </Row>
      </div>
    </div>
  );
};

export default StatisticsComponent;
