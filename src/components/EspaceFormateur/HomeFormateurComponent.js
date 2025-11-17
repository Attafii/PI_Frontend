import React from "react";
import { Typography, Row, Col, Card, Button, Space } from "antd";
import { ScheduleOutlined, BookOutlined, SettingOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function HomeFormateurComponent() {
  return (
    <div style={{ padding: "30px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Title level={2}>Bienvenue sur votre tableau de bord, Formateur</Title>
        <Paragraph style={{ fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
          Gérez vos formations, vos sessions, et interagissez avec vos participants en toute simplicité.
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            bordered={false}
            style={{
              textAlign: "center",
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <BookOutlined style={{ fontSize: "40px", color: "#1890ff", marginBottom: "20px" }} />
            <Title level={4}>Vos Formations</Title>
            <Paragraph>Visualisez et mettez à jour vos formations en quelques clics.</Paragraph>
            <Button type="primary">Gérer les formations</Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            bordered={false}
            style={{
              textAlign: "center",
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <ScheduleOutlined style={{ fontSize: "40px", color: "#1890ff", marginBottom: "20px" }} />
            <Title level={4}>Sessions Programmées</Title>
            <Paragraph>Consultez les détails et suivez l'évolution des sessions.</Paragraph>
            <Button type="primary">Voir les sessions</Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            bordered={false}
            style={{
              textAlign: "center",
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <SettingOutlined style={{ fontSize: "40px", color: "#1890ff", marginBottom: "20px" }} />
            <Title level={4}>Paramètres</Title>
            <Paragraph>Configurez vos informations et personnalisez votre profil.</Paragraph>
            <Button type="primary">Accéder aux paramètres</Button>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <Space>
          <Button type="default">Retour à l'accueil</Button>
          <Button type="primary">Déconnexion</Button>
        </Space>
      </div>
    </div>
  );
}

export default HomeFormateurComponent;
