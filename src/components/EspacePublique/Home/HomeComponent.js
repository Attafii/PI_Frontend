import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Card, Button, Layout, Spin, Rate } from "antd";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "./HomeComponent.css"; // Fichier CSS personnalisé
import diplome from "../../Authentication/imagesISET/cover3.jpg";
import { AppstoreOutlined, TagsOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const HomeComponent = () => {
  const { t } = useTranslation("global");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/formations`, { state: { categoryId } });
  };

  const buttonStyle = {
    backgroundColor: isHovered ? "#001529" : "#003a63",
    color: "white",
    borderColor: isHovered ? "#003a63" : "#001529",
    transition: "background-color 0.3s ease",
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8001/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Témoignages simulés
  const testimonials = [
    {
      id: 1,
      name: "Ali",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      comment: "Excellente plateforme, j'ai trouvé des services adaptés à mes besoins !",
      rating: 5
    },
    {
      id: 2,
      name: "Sara",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      comment: "Les services sont très professionnels et faciles à utiliser.",
      rating: 4
    },
    {
      id: 3,
      name: "Mohamed",
      image: "https://randomuser.me/api/portraits/men/54.jpg",
      comment: "J'adore les fonctionnalités et le support est très réactif !",
      rating: 5
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Section d'introduction */}
      <div className="intro-section">
        <div className="intro-text">
          <Title level={1} style={{ color: "white" }}>
            {t("HomeComponent.welcomeTitle")}
          </Title>
          <Paragraph style={{ color: "white", fontSize: "18px" }}>
            {t("HomeComponent.welcomeParagraph")}
          </Paragraph>
          <Button
            size="large"
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {t("HomeComponent.discoverButton")}
          </Button>
        </div>
      </div>

      <Content style={{ padding: "30px", backgroundColor: "#f4f6f8" }}>
        {/* Section de présentation */}
        <section className="presentation-section">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <img
                src={diplome}
                alt={t("HomeComponent.servicesTitle")}
                className="presentation-image"
              />
            </Col>
            <Col xs={24} md={12}>
              <Title level={2}>{t("HomeComponent.servicesTitle")}</Title>
              <Paragraph style={{ fontSize: "16px", lineHeight: "1.8" }}>
                {t("HomeComponent.servicesParagraph")}
              </Paragraph>
            </Col>
          </Row>
        </section>

        {/* Section des catégories */}
        <section className="categories-section">
          <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
            {t("HomeComponent.categoriesTitle")}
          </Title>

          {loading ? (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]} justify="center">
              {categories.map((category) => (
                <Col key={category.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    onClick={() => handleCategoryClick(category.id)}
                    className="category-card"
                    cover={
                      <TagsOutlined style={{ fontSize: '24px', color: '#003a63', textAlign: 'center', marginTop: '20px' }} />
                    }
                  >
                    <Card.Meta
                      title={category.nom_categorie}
                      description={category.description || t("HomeComponent.noDescription")}
                    />
                    <Button style={{ marginTop: "10px", borderRadius: "5px", backgroundColor:"#003a63", color:"whitesmoke" }}>
                      {t("HomeComponent.discoverButton")}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </section>

        {/* Section Témoignages */}
        <section className="testimonials-section" style={{ marginTop: "50px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
            {t("") || "Ce que disent nos clients"}
          </Title>
          <Row gutter={[16, 16]} justify="center">
            {testimonials.map((testimonial) => (
              <Col key={testimonial.id} xs={24} sm={12} md={8}>
                <Card hoverable style={{ textAlign: "center" }}>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "15px" }}
                  />
                  <Title level={4}>{testimonial.name}</Title>
                  <Paragraph style={{ fontStyle: "italic" }}>"{testimonial.comment}"</Paragraph>
                  <Rate disabled defaultValue={testimonial.rating} />
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Content>
    </Layout>
  );
};

export default HomeComponent;
