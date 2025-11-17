import React from "react";
import { Layout, Typography, Row, Col, Space } from "antd";
import { FacebookOutlined, TwitterOutlined, LinkedinOutlined, InstagramOutlined } from "@ant-design/icons";

const { Footer } = Layout;
const { Text } = Typography;

const FooterComponent = () => {
  return (
    <Footer style={{ backgroundColor: "#001529", color: "white", padding: "40px 20px" }}>
      <Row justify="space-between" align="middle">
        {/* Copyright */}
        <Col>
          <Text style={{ color: "white" }}>© 2025 Gamgam Amine. Tous droits réservés.</Text>
        </Col>

        {/* Liens sociaux */}
        <Col>
          <Space size="middle">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FacebookOutlined style={{ color: "white", fontSize: "20px" }} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <TwitterOutlined style={{ color: "white", fontSize: "20px" }} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <LinkedinOutlined style={{ color: "white", fontSize: "20px" }} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <InstagramOutlined style={{ color: "white", fontSize: "20px" }} />
            </a>
          </Space>
        </Col>
      </Row>
    </Footer>
  );
};

export default FooterComponent;
