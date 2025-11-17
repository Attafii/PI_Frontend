import React, { useState, useEffect } from "react";
import { Input, Select, Row, Col, Card, Spin, Space, Tag, Button, Typography, Divider } from "antd";
import { ToolOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const { Title, Paragraph } = Typography;

const ServicesComponent = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sessions, setSessions] = useState({});
  const [expanded, setExpanded] = useState({});
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [tagsFilter, setTagsFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalServices, setTotalServices] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchServicesAndCategories = async () => {
      try {
        const [servicesResponse, categoriesResponse, freelancersTotal, clientsTotal] = await Promise.all([
          axios.get("http://localhost:8001/api/services"),
          axios.get("http://localhost:8001/api/categories"),
          axios.get("http://localhost:8001/api/users/freelancersTotal"),
          axios.get("http://localhost:8001/api/users/clientsTotal"),
        ]);
        setServices(servicesResponse.data);
        setCategories(categoriesResponse.data);
        setTotalServices(servicesResponse.data.length);
        setTotalUsers(freelancersTotal.data.count + clientsTotal.data.count);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesAndCategories();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setKeyword(queryParams.get("search") || "");
    setCategory(queryParams.get("category") || "");
    setTagsFilter(queryParams.get("tags") ? queryParams.get("tags").split(",") : []);
  }, [location.search]);

  const fetchSessionsByService = async (serviceId) => {
    if (!serviceId) return;
    try {
      const response = await axios.get(`http://localhost:8001/api/sessions/getSessionsByService/${serviceId}`);
      setSessions((prevSessions) => ({
        ...prevSessions,
        [serviceId]: response.data,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des sessions :", error);
    }
  };

  const toggleExpand = (serviceId) => {
    setExpanded((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
    if (!sessions[serviceId]) fetchSessionsByService(serviceId);
  };

  const handleVoirDetailClick = (serviceId) => {
    navigate(`/services/${serviceId}`);
  };

  const handleSearch = () => {
    const filteredServices = services.filter((service) =>
      service.tags.some((tag) => tag.nom.toLowerCase().includes(keyword.toLowerCase()))
    );
    setServices(filteredServices);
  };

  const filteredServices = services.filter((service) => {
    const matchesKeyword =
      service.titre.toLowerCase().includes(keyword.toLowerCase()) ||
      service.description.toLowerCase().includes(keyword.toLowerCase());
    const matchesCategory = category ? service.categoryId === category : true;
    const matchesTags = tagsFilter.every((tag) => service.tags.some((serviceTag) => serviceTag.nom === tag));
    return matchesKeyword && matchesCategory && matchesTags;
  });

  return (
    <div style={{ padding: "30px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Title level={2}>
          <br />
          Bienvenue sur Freelancers Workspace</Title>
        <Paragraph style={{ fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
          <br />
          Découvrez des services et projets adaptés à vos compétences. Collaborez, apprenez et développez votre carrière de freelance.
        </Paragraph>
      </div>

      <Row justify="center" gutter={[16, 16]} style={{ marginBottom: "30px" }}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ textAlign: "center", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
            <Title level={3} style={{ color: "#1890ff" }}>
              +{totalServices}
            </Title>
            <Paragraph>Total des services</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ textAlign: "center", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
            <Title level={3} style={{ color: "#1890ff" }}>
              +{totalUsers}
            </Title>
            <Paragraph>Utilisateurs inscrits</Paragraph>
          </Card>
        </Col>
      </Row>

      <Divider />

      <div style={{ marginBottom: "30px", display: "flex", justifyContent: "center", gap: "15px" }}>
        <Input
          placeholder="Rechercher par mot-clé"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #d9d9d9",
          }}
        />
        <Select
          placeholder="Filtrer par catégorie"
          value={category}
          onChange={(value) => setCategory(value || "")}
          style={{ width: "200px" }}
          allowClear
        >
          <Select.Option value="">Toutes les catégories</Select.Option>
          {categories.map((cat, index) => (
            <Select.Option key={cat.id || index} value={cat.id}>
              {cat.nom_categorie}
            </Select.Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          placeholder="Filtrer par tags"
          value={tagsFilter}
          onChange={(tags) => setTagsFilter(tags)}
          style={{ width: "300px" }}
          allowClear
        >
          {services.flatMap((service) => 
            service.tags.map((tag) => (
              <Select.Option key={tag._id} value={tag.nom}>
                {tag.nom}
              </Select.Option>
            ))
          )}
        </Select>
        <Button type="primary" onClick={handleSearch}>
          Rechercher
        </Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "0 auto" }} />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredServices.map((service) => (
            <Col xs={24} sm={12} md={8} lg={6} key={service._id}>
              <Card
                hoverable
                cover={<ToolOutlined style={{ fontSize: "24px", color: "#1890ff", margin: "20px auto" }} />}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Card.Meta
                  title={service.titre}
                  description={
                    <Paragraph
                      ellipsis={{
                        rows: expanded[service._id] ? 0 : 2,
                        expandable: false,
                      }}
                      style={{ maxWidth: "300px" }}
                    >
                      {service.description || "Description non disponible"}
                    </Paragraph>
                  }
                />
                <Space wrap style={{ gap: "10px", marginTop: "10px" }}>
                  {service.tags.map((tag) => (
                    <Tag key={tag._id} color="blue">
                      {tag.nom}
                    </Tag>
                  ))}
                </Space>
                {expanded[service._id] && sessions[service._id] && (
                  <div style={{ marginTop: "15px" }}>
                    <Title level={5}>Sessions :</Title>
                    <p>{sessions[service._id].length} sessions disponibles</p>
                  </div>
                )}
                <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
                  <Button type="link" onClick={() => toggleExpand(service._id)}>
                    {expanded[service._id] ? "Réduire" : "Afficher plus"} {expanded[service._id] ? <UpOutlined /> : <DownOutlined />}
                  </Button>
                  <Button type="primary" onClick={() => handleVoirDetailClick(service._id)}>
                    Voir Détail
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Divider />

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <Title level={3}>Témoignages de nos utilisateurs</Title>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false}>
              <Paragraph>
                "Freelancers Workspace m'a permis de développer mon réseau et mes compétences !" - <strong>Ali</strong>
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ServicesComponent;
