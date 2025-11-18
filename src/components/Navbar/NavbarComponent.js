import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import {
  HomeOutlined,
  ReadOutlined,
  LoginOutlined,
  UserAddOutlined,
  GlobalOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./Navbar.css";

const { Header } = Layout;

const NavbarComponent = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Utilisateur",
    photo: null, // Remplacez par une URL dynamique si disponible
  });

  useEffect(() => {
    // Détecter la taille de l'écran
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Simuler l'état de connexion
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setUserProfile({
        name: localStorage.getItem("nom") || "Utilisateur",
        photo: localStorage.getItem("photo") || null, // Ajouter une photo si disponible
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserProfile({ name: "Utilisateur", photo: null });
    // Actions supplémentaires pour la déconnexion
  };

  const getMenuItems = () => {
    if (isAuthenticated) {
      return [
        {
          key: "home",
          icon: <HomeOutlined />,
          label: <a href="/">{t("Accueil")}</a>,
        },
        {
          key: "form",
          icon: <ReadOutlined />,
          label: <a href="/dashboard-freelance">{t("Mon Espace")}</a>,
        },
        {
          key: "language",
          label: <DropdownLanguage />,
        },
        {
          key: "profile",
          label: (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: (
                      <a onClick={handleLogout} style={{ color: "red" }}>
                        {t("Déconnexion")}
                      </a>
                    ),
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Space>
                <Avatar
                  src={userProfile.photo}
                  icon={!userProfile.photo && <UserOutlined />}
                />
                {userProfile.name}
              </Space>
            </Dropdown>
          ),
        },
      ];
    } else {
      return [
        {
          key: "home",
          icon: <HomeOutlined />,
          label: <a href="/">{t("Accueil")}</a>,
        },
        {
          key: "form",
          icon: <ReadOutlined />,
          label: <a href="/formations">{t("Projets")}</a>,
        },
        {
          key: "trainers",
          icon: <UserAddOutlined />,
          label: <a href="/signin?role=formateur">{t("Espace Freelancer")}</a>,
        },
        {
          key: "candidates",
          icon: <UserAddOutlined />,
          label: <a href="/signin?role=candidat">{t("Espace Client")}</a>,
        },

        {
          key: "login",
          icon: <LoginOutlined />,
          label: <a href="/signin">{t("Se connecter")}</a>,
        },
        {
          key: "register",
          icon: <UserAddOutlined />,
          label: <a href="/signup">{t("S'inscrire")}</a>,
        },
        {
          key: "language",
          label: <DropdownLanguage />,
        },
      ];
    }
  };

  return (
    <Layout>
      <Header style={{ backgroundColor: "#003a63", padding: "0 20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <div style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
            <a href="/" style={{ color: "white", textDecoration: "none" }}>
              Freelancers Workspace
            </a>
          </div>

          {/* Menu principal ou menu déroulant pour mobile */}
          {!isMobile ? (
            <Menu
              mode="horizontal"
              theme="dark"
              style={{
                backgroundColor: "#003a63",
                flexGrow: 1,
                borderBottom: "none",
              }}
              items={getMenuItems()}
            />
          ) : (
            <Dropdown
              menu={{
                items: getMenuItems(),
              }}
              trigger={["click"]}
            >
              <MenuOutlined
                style={{ fontSize: "24px", color: "white", cursor: "pointer" }}
              />
            </Dropdown>
          )}
        </div>
      </Header>
    </Layout>
  );
};

// Composant DropdownLanguage pour changer la langue
const DropdownLanguage = () => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;

  const languages = {
    en: "English",
    fr: "Français",
    ar: "العربية",
  };

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  const languageItems = Object.entries(languages).map(([key, label]) => ({
    key,
    label,
    onClick: () => handleChangeLanguage(key),
  }));

  return (
    <Dropdown menu={{ items: languageItems }}>
      <Space style={{ cursor: "pointer", color: "white" }}>
        <GlobalOutlined />
        {languages[currentLang]}
      </Space>
    </Dropdown>
  );
};

export default NavbarComponent;
