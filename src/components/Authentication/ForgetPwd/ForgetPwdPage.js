import React, { useEffect } from "react";
import { Form, Input, Button, Typography } from "antd";
import './ForgetPwdPage.css';
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const ForgetPwdPage = () => {
  const [t, i18n] = useTranslation("global");
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [i18n.language]);

  const onFinish = (values) => {
    console.log("Email Submitted for Password Reset:", values.email);
    // Ici, vous pouvez ajouter une logique pour envoyer l'email au backend
  };

  return (
    <div className="login-page"> {/* Utilisation de la classe de page de login */} 
      <div className="background-image full-screen" /> {/* Image de fond */}
      <div className="login-form-container"> {/* Formulaire container similaire à LoginPage */}
        <div className="login-form-box"> {/* Boîte de formulaire */}
          <Title level={3}>{t("ForgetPwdPage.titreForm")}</Title> {/* Titre */}
          <Text>{t("ForgetPwdPage.description")}</Text> {/* Description */}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="login-form" 
          >
            <Form.Item
              label={t("ForgetPwdPage.emailLabel")}
              name="email"
              rules={[
                {
                  required: true,
                  message: t("ForgetPwdPage.emailError"),
                },
                {
                  type: "email",
                  message: t("ForgetPwdPage.emailInvalid"),
                },
              ]}
            >
              <Input placeholder={t("ForgetPwdPage.emailPlaceholder")} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {t("ForgetPwdPage.submitButton")}
              </Button>
            </Form.Item>
          </Form>
          <div className="back-to-login">
            <Text>
              <a href="/signin">{t("ForgetPwdPage.backToLogin")}</a>
            </Text>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPwdPage;
