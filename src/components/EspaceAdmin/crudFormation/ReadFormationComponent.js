import React, { useEffect, useState } from "react";
import moment from "moment";

import {
  Table,
  Button,
  Modal,
  Typography,
  Space,
  Input,
  Form,
  Select,
  Upload,
  message,
  DatePicker,
} from "antd";
import axios from "axios";
import {
  EditOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Paragraph } = Typography;

const ReadFormationsComponent = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [form] = Form.useForm();

  // Données pour les listes déroulantes
  const [tags, setTags] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [categories, setCategories] = useState([]);

  const niveauDifficulteOptions = ["DEBUTANT", "INTERMEDIAIRE", "AVANCE"];

  const columns = [
    {
      title: "Titre de la formation",
      dataIndex: "titre",
      key: "titre",
      sorter: (a, b) => a.titre.localeCompare(b.titre),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Paragraph ellipsis={{ rows: 2, expandable: false }} style={{ maxWidth: "300px" }}>
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
          <Button type="link" icon={<InfoCircleOutlined />} onClick={() => handleViewDetails(record)}>
            Détails
          </Button>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Modifier
          </Button>
        </Space>
      ),
      width: 200,
      align: "center",
    },
  ];

  const fetchFormations = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8001/api/formations");
      setFormations(data.map((item) => ({ ...item, key: item._id })));
    } catch (error) {
      console.error("Erreur lors du chargement des formations :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [tagData, categoryData] = await Promise.all([
        axios.get("http://localhost:8001/api/tags"),
        axios.get("http://localhost:8001/api/categories"),
      ]);

      setTags(tagData.data || []);
      setCategories(categoryData.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  };

  const fetchSessionsByFormation = async (formationId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8001/api/sessions/getSessionsByFormation/${formationId}`
      );
      setSessions(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des sessions :", error);
    }
  };

  const handleViewDetails = (record) => {
    setIsViewMode(true);
    setIsEditMode(false);
    setModalContent(record);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setIsViewMode(false);
    form.resetFields();
    setSessions([]);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setIsViewMode(false);
    form.setFieldsValue({
      titre: record.titre,
      description: record.description,
      programme: null,
      niveau_difficulte: record.niveau_difficulte,
      tags: record.tags.map((tag) => tag._id),
      categorieId: record.categorieId ? record.categorieId._id : null,
      changehorraire: record.changehorraire ? moment(record.changehorraire) : null, // Ajout de la gestion du champ changehoraire
      image: record.image || null, // Ajout de l'image
    });
    fetchSessionsByFormation(record._id);
    setModalContent(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalContent({});
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} image téléchargée avec succès`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} image téléchargement échoué.`);
    }
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("titre", values.titre);
    formData.append("description", values.description);
    formData.append("niveau_difficulte", values.niveau_difficulte);
    formData.append('tags', JSON.stringify(values.tags)); // Ajoutez tags
    formData.append("categorieId", values.categorieId);
    formData.append("changehorraire", values.changehorraire ? values.changehorraire.format() : null);
  console.log(values)
    // Ajout de l'image si présente
    if (values.image) {
      formData.append("image", values.image.file.originFileObj);
    }
  
    if (values.programme) {
      formData.append("programme", values.programme.file.originFileObj);
    }
  
    try {
      if (isEditMode) {
        // Vérifiez que modalContent._id est bien défini avant de mettre à jour
        if (!modalContent._id) {
          message.error("ID de la formation invalide.");
          return;
        }
        await axios.put(
          `http://localhost:8001/api/updateFormation/${modalContent._id}`, // Utilisation de _id pour l'édition
          formData
        );
        message.success("Formation mise à jour avec succès !");
      } else {
        await axios.post("http://localhost:8001/api/formations/addFormation", formData);
        message.success("Formation ajoutée avec succès !");
      }
      fetchFormations();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur :", error);
      message.error("Une erreur est survenue lors de la soumission.");
    }
  };
  

  useEffect(() => {
    fetchFormations();
    fetchDropdownData();
  }, []);

  const filteredFormations = formations.filter((formation) =>
    formation.titre.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ margin: "20px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px" }}>
      <h2 style={{ marginBottom: "20px", fontWeight: "bold", color: "#003a63" }}>Liste des Formations</h2>
      <Input
        placeholder="Rechercher par titre de formation"
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: "20px", width: "300px" }}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: "20px" }}
      >
        Ajouter une formation
      </Button>
      <Table
        dataSource={filteredFormations}
        columns={columns}
        rowKey="_id"
        loading={loading}
        bordered
        size="middle"
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ["5", "10", "20"] }}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title={isEditMode ? "Modifier la formation" : isViewMode ? "Détails de la formation" : "Ajouter une formation"}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        {isViewMode ? (
          <div>
            <p>
              <strong>Titre :</strong> {modalContent.titre}
            </p>
            <p>
              <strong>Description :</strong> {modalContent.description}
            </p>
            <p>
              <strong>Niveau de difficulté :</strong> {modalContent.niveau_difficulte}
            </p>
            <p>
              <strong>Programme :</strong>{" "}
              <a href={modalContent.programme} target="_blank" rel="noopener noreferrer">
                Télécharger
              </a>
            </p>
            <p>
              <strong>Tags :</strong>{" "}
              {modalContent.tags && modalContent.tags.map((tag) => tag.nom).join(", ")}
            </p>
            <p>
              <strong>Catégorie :</strong>{" "}
              {modalContent.categorieId && modalContent.categorieId.nom_categorie}
            </p>
            <p>
              <strong>Changement d'horaire :</strong> {modalContent.changehorraire}
            </p>
            {modalContent.image && (
              <div>
                <strong>Image de la formation :</strong>
                <img
                  src={modalContent.image}
                  alt="Image de la formation"
                  style={{ width: '100%', maxWidth: '400px', marginTop: '10px' }}
                />
              </div>
            )}
          </div>
        ) : (
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item label="Titre" name="titre" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Niveau de difficulté"
              name="niveau_difficulte"
              rules={[{ required: true }]}
            >
              <Select>
                {niveauDifficulteOptions.map((niveau) => (
                  <Select.Option key={niveau} value={niveau}>
                    {niveau}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Tags" name="tags" rules={[{ required: true }]}>
              <Select mode="multiple" placeholder="Sélectionner des tags">
                {tags.map((tag) => (
                  <Select.Option key={tag._id} value={tag._id}>
                    {tag.nom}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {isEditMode && (
              <Form.Item label="Sessions" name="sessions">
                <Select mode="multiple" placeholder="Sélectionner des sessions">
                  {sessions.map((session) => (
                    <Select.Option key={session._id} value={session._id}>
                      {session.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item label="Catégorie" name="categorieId" rules={[{ required: true }]}>
              <Select placeholder="Sélectionner une catégorie">
                {categories.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.nom_categorie}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Changement d'horaire" name="changehoraire">
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
            <Form.Item label="Image de la formation" name="image" valuePropName="file">
              <Upload
                beforeUpload={() => false} // Empêche le téléchargement automatique
                onChange={handleImageChange}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Téléverser une image</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Programme" name="programme" valuePropName="file">
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Téléverser un programme</Button>
              </Upload>
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

export default ReadFormationsComponent;
