import React, { useEffect } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, setFormErrors } from "./formSlice";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [t] = useTranslation("global");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Extraire le rôle depuis l'URL
  const params = new URLSearchParams(location.search);
  const role = params.get("role");

  // Accéder aux données du formulaire et aux erreurs depuis le Redux state
  const { email, password, errors } = useSelector((state) => state.form);

  const [successAlert, setSuccessAlert] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ email, password });
  }, [form, email, password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateForm({ name, value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value) {
        error = t("LoginPage.adressEmailPlaceholder");
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = t("LoginPage.EmailErrorMessage");
      }
    } else if (name === "password") {
      if (!value) {
        error = t("LoginPage.PasswordErrorMessage");
      }
    }
    dispatch(setFormErrors({ name, error }));
  };

  const onFinish = async () => {
    try {
      const response = await axios.post("http://localhost:8001/api/login", {
        email,
        mdp: password,
      });

      localStorage.setItem("nom", response.data.user.nom);
      localStorage.setItem("email", response.data.user.email);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("token", response.data.token);

      setSuccessAlert(true);
      setTimeout(() => setSuccessAlert(false), 2000);

      const { role } = response.data.user;
      if (role === "formateur") navigate("/formateur");
      else if (role === "candidat") navigate("/dashboard-freelance");
      else navigate("/dashboard-client");
    } catch (error) {
      setErrorAlert(true);
      setTimeout(() => setErrorAlert(false), 2000);
    }
  };

  return (
    <div className="login-page">
      <div className="background-image full-screen" />
      <div className="login-form-container">
        <div className="login-form-box">
          <Title level={3}>{t("LoginPage.titreForm")}</Title>

          {successAlert && (
            <Alert
              message={t("LoginPage.ConnexionReussie")}
              type="success"
              showIcon
              closable
              style={{ marginBottom: "16px" }}
            />
          )}
          {errorAlert && (
            <Alert
              message={t("LoginPage.ConnexionErreur")}
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
            className="login-form"
          >
            <Form.Item
              label={t("LoginPage.adressEmail")}
              name="email"
              help={
                errors.email && (
                  <div className="ant-form-item-explain">{errors.email}</div>
                )
              }
              validateStatus={errors.email ? "error" : ""}
            >
              <Input
                name="email"
                placeholder={t("LoginPage.adressEmailPlaceholder")}
                value={email}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item
              label={t("LoginPage.Password")}
              name="password"
              help={
                errors.password && (
                  <div className="ant-form-item-explain">{errors.password}</div>
                )
              }
              validateStatus={errors.password ? "error" : ""}
            >
              <Input.Password
                name="password"
                placeholder="********"
                value={password}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item>
              <a href="/forgot-password" className="forgot-password">
                {t("LoginPage.ForgotPassword")}
              </a>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {t("LoginPage.SeConnecterBtn")}
              </Button>
            </Form.Item>
          </Form>

          {/* Afficher ou cacher l'option d'inscription selon le rôle */}
          {role !== "formateur" && (
            <div className="signup-footer">
              <Text>
                {t("LoginPage.PasCompte")}{" "}
                <a href="/signup">{t("LoginPage.InscrivezVous")}</a>
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
