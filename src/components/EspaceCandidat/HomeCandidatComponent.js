import React, { useEffect, useState } from "react";
import { Card, Spin, Typography, Row, Col } from "antd";
import axios from "axios";

const { Title, Paragraph } = Typography;

function HomeCandidatComponent() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fonction pour récupérer les sessions du candidat par email
    const fetchSessions = async () => {
      try {
        const candidateEmail = localStorage.getItem("email"); // Identifiant du candidat
        const response = await axios.get(`http://localhost:8001/api/sessions?email=${candidateEmail}`);
        setSessions(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des sessions :", error);
      }
    };

    // Appel API pour récupérer les sessions
    fetchSessions().finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Mes Sessions</Title>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin size="large" />
        </div>
      ) : sessions.length > 0 ? (
        <Row gutter={[16, 16]}>
          {sessions.map((session) => (
            <Col xs={24} sm={12} md={8} lg={6} key={session.id}>
              <Card
                title={session.formationId ? session.formationId.titre : "Formation inconnue"}
                bordered={false}
                style={{ borderRadius: "8px" }}
                hoverable
              >
                {console.log(session)}
                <Paragraph>
                  <strong>Date de début:</strong> {new Date(session.date_debut).toLocaleDateString()}
                </Paragraph>
                <Paragraph>
                  <strong>Date de fin :</strong> {new Date(session.date_fin).toLocaleDateString()}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Paragraph>Aucune session trouvée.</Paragraph>
        </div>
      )}
    </div>
  );
}

export default HomeCandidatComponent;
