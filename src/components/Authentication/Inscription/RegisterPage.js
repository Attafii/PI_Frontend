import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Row, Col, Upload, Alert } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import "./RegisterPage.css";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [t, i18n] = useTranslation("global");
  const [form] = Form.useForm();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]); // État pour les fichiers téléchargés

  useEffect(() => {
    form.resetFields();
  }, [i18n.language]);

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("nom", values.firstName);
    formData.append("prenom", values.lastName);
    formData.append("email", values.email);
    formData.append("mdp", values.password);
    formData.append("role", "candidat");
    formData.append("num_cin", values.numCIN);
    if (fileList.length > 0) {
      formData.append("photo", fileList[0].originFileObj);
    }

    try {
      // Requête vers l'API backend pour enregistrer l'utilisateur
      const response = await axios.post("http://localhost:8001/api/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("User registered successfully:", response.data);
      setSuccessAlert(true);
      setTimeout(() => setSuccessAlert(false), 3000);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Registration error:", error);
      setErrorAlert(error.response?.data?.error || "An error occurred");
      setTimeout(() => setErrorAlert(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <div className="login-page">
      <div className="background-image full-screen" />
      <div className="login-form-container">
        <div className="login-form-box">
          <Title level={4} className="form-title">
            {t("RegisterPage.titreForm")}
          </Title>

          {/* Alertes de succès ou d'erreur */}
          {successAlert && (
            <Alert
              message={t("RegisterPage.successMessage")}
              type="success"
              showIcon
              closable
              style={{ marginBottom: "16px" }}
            />
          )}
          {errorAlert && (
            <Alert
              message={errorAlert}
              type="error"
              showIcon
              closable
              style={{ marginBottom: "16px" }}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="register-form compact"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  rules={[
                    { required: true, message: t("RegisterPage.firstNameError") },
                  ]}
                >
                  <Input placeholder={t("RegisterPage.firstNamePlaceholder")} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  rules={[
                    { required: true, message: t("RegisterPage.lastNameError") },
                  ]}
                >
                  <Input placeholder={t("RegisterPage.lastNamePlaceholder")} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: t("RegisterPage.emailError") },
                { type: "email", message: t("RegisterPage.emailInvalid") },
              ]}
            >
              <Input placeholder={t("RegisterPage.emailPlaceholder")} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: t("RegisterPage.passwordError") }]}
            >
              <Input.Password
                placeholder={t("RegisterPage.passwordPlaceholder")}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: t("RegisterPage.confirmPasswordError"),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t("RegisterPage.passwordMismatch"))
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder={t("RegisterPage.confirmPasswordPlaceholder")}
              />
            </Form.Item>

            <Form.Item
              name="numCIN"
              rules={[
                { required: true, message: t("RegisterPage.numCINError") },
                {
                  pattern: /^\d{8}$/,
                  message: t("RegisterPage.numCINInvalid"),
                },
              ]}
            >
              <Input placeholder={t("RegisterPage.numCINPlaceholder")} />
            </Form.Item>

            <Form.Item
              label={t("RegisterPage.photoLabel")}
              rules={[{ required: true, message: t("RegisterPage.photoError") }]}
            >
              <Upload
                listType="picture"
                fileList={fileList}
                beforeUpload={() => false} // Désactiver l'upload automatique
                onChange={handleFileChange}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>
                  {t("RegisterPage.uploadButton")}
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                {t("RegisterPage.registerButton")}
              </Button>
            </Form.Item>
          </Form>
          <div className="signup-footer">
            <Text>
              {t("RegisterPage.alreadyHaveAccount")}{" "}
              <a href="/signin">{t("RegisterPage.loginLink")}</a>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
