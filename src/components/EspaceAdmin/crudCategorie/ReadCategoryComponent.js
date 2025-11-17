import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Typography, Space, Input, Form,Popconfirm ,message} from "antd";
import axios from "axios";
import { EditOutlined, InfoCircleOutlined, PlusOutlined ,DeleteOutlined} from "@ant-design/icons";

const { Paragraph } = Typography;

const ReadCategoryComponent = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [searchText, setSearchText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);  // Mode ajout ou édition
  const [isViewMode, setIsViewMode] = useState(false);  // Mode lecture
  const [form] = Form.useForm();

  // Fetch des catégories depuis l'API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8001/api/categories");
      setCategories(data.map((item) => ({ ...item, key: item._id }))); // Ajout d'une clé unique
    } catch (error) {
      console.error("Erreur lors du chargement des catégories :", error);
    } finally {
      setLoading(false);
    }
  };

  // Colonnes à afficher dans le tableau
  const columns = [
    {
      title: "Nom catégorie",
      dataIndex: "nom_categorie",
      key: "titre",
      sorter: (a, b) => a.nom_categorie.localeCompare(b.nom_categorie), // Tri ascendant/descendant
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Paragraph
          ellipsis={{
            rows: 2, // Limite à deux lignes avec "..."
            expandable: true,
          }}
          style={{ maxWidth: "300px" }} // Largeur définie
        >
          {text}
        </Paragraph>
      ),
      width: 300,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<InfoCircleOutlined />}
            onClick={() => handleViewDetails(record)}
          >
          </Button>
          <Button
            type="dashed"
            icon={<EditOutlined style={{ color: "purple" }}/>}
            onClick={() => handleEdit(record)}
          > 
          </Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
            onConfirm={() => handleDelete(record._id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="dashed"
          icon={<DeleteOutlined style={{ color: "darkred" }} />}>
              
            </Button>
            
          </Popconfirm>
        </Space>
      ),
      width: 200, // Largeur fixe
      align: "center",
    },
  ];

  // Fonction pour afficher les détails de la catégorie
  const handleViewDetails = (record) => {
    setIsViewMode(true);  // Mode lecture
    setIsEditMode(false);  // Désactive le mode édition
    setModalContent(record);
    setIsModalVisible(true);
  };

  // Fonction pour afficher le formulaire en mode ajout
  const handleAdd = () => {
    setIsEditMode(false);  // Mode ajout
    setIsViewMode(false);  // Désactive le mode lecture
    form.resetFields();  // Réinitialiser les champs du formulaire
    setIsModalVisible(true);
  };

  // Fonction pour afficher le formulaire en mode modification
  const handleEdit = (record) => {
    setIsEditMode(true);  // Mode édition
    setIsViewMode(false);  // Désactive le mode lecture
    form.setFieldsValue({
      nom_categorie: record.nom_categorie,
      description: record.description,
    });
    setModalContent(record);
    setIsModalVisible(true);
  };

  // Fonction pour fermer le modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalContent({});
  };

  // Fonction de recherche
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Fonction pour soumettre le formulaire d'ajout ou de modification
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditMode) {
        // Modifier la catégorie via l'API PUT
        await axios.put(`http://localhost:8001/api/categories/update/${modalContent._id}`, values);
        message.success("Catégorie mis à jour avec succès !");
      } else {
        // Ajouter une nouvelle catégorie via l'API POST
        await axios.post("http://localhost:8001/api/create", values);
        message.success("Catégorie créé avec succès !")
      }
      fetchCategories();  // Recharger les catégories après ajout ou modification
      handleCloseModal();  // Fermer le modal
    } catch (error) {
      message.error("Erreur lors de l'ajout ou de la modification  ");
      console.error("Erreur lors de l'ajout ou de la modification :", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8001/api/categories/delete/${id}`);
      message.success("Tag supprimé avec succès !");
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la suppression du catégorie :", error);
    } finally {
      setLoading(false);
    }
  };
  // Fonction pour filtrer les catégories selon le nom
  const filteredCategories = categories.filter(category =>
    category.nom_categorie.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div
      style={{
        margin: "20px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontWeight: "bold",
          color: "#003a63",
        }}
      >
        Liste des Catégories
      </h2>

      {/* Barre de recherche */}
      <Input
        placeholder="Rechercher par nom de catégorie"
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: "20px", width: "300px" }}
      />

      {/* Bouton d'ajout */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: "20px",marginLeft:"10px" }}
      >
       Nouveau 
      </Button>

      <Table
        dataSource={filteredCategories}
        columns={columns}
        rowKey="_id"
        loading={loading}
        style={{ maxHeight: "400px", overflowY: "auto" }}
      />

      {/* Modal pour ajouter, modifier ou lire une catégorie */}
      <Modal
        title={isEditMode ? "Modifier la catégorie" : isViewMode ? "Détails de la catégorie" : "Ajouter une catégorie"}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        {isViewMode ? (
          // Mode lecture - Affichage des détails
          <>
            <Typography.Text strong>Nom de la catégorie :</Typography.Text>
            <p>{modalContent.nom_categorie}</p>
            <Typography.Text strong>Description :</Typography.Text>
            <p>{modalContent.description}</p>
          </>
        ) : (
          // Mode ajout ou modification - Formulaire
          <Form
            form={form}
            onFinish={handleSubmit}
            initialValues={{
              nom_categorie: modalContent.nom_categorie,
              description: modalContent.description,
            }}
          >
            <Form.Item
              label="Nom de la catégorie"
              name="nom_categorie"
              rules={[{ required: true, message: "Veuillez entrer le nom de la catégorie" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Veuillez entrer une description" }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              {isEditMode ? "Modifier" : "Ajouter"}
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ReadCategoryComponent;
