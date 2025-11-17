import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Form, Space, Popconfirm, message } from "antd";
import axios from "axios";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ReadTagComponent = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8001/api/Tags");
      setTags(response.data);
    } catch (error) {
      message.error("Erreur lors de la récupération des tags.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleAddTag = async (values) => {
    try {
      await axios.post("http://localhost:8001/api/addTag", values);
      message.success("Tag ajouté avec succès !");
      fetchTags();
      setIsModalOpen(false);
    } catch (error) {
      message.error("Erreur lors de l'ajout du tag.");
    }
  };

  const handleUpdateTag = async (values) => {
    try {
      await axios.put(`http://localhost:8001/api/updateTag/${editingTag._id}`, values);
      message.success("Tag modifié avec succès !");
      fetchTags();
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingTag(null);
    } catch (error) {
      message.error("Erreur lors de la modification du tag.");
    }
  };

  const handleDeleteTag = async (id) => {
    try {
      await axios.delete(`http://localhost:8001/api/deleteTag/${id}`);
      message.success("Tag supprimé avec succès !");
      fetchTags();
    } catch (error) {
      message.error("Erreur lors de la suppression du tag.");
    }
  };

  const openModal = (record = null) => {
    setIsModalOpen(true);
    if (record) {
      setIsEditing(true);
      setEditingTag(record);
      form.setFieldsValue(record);
    } else {
      setIsEditing(false);
      setEditingTag(null);
      form.resetFields();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleFinish = (values) => {
    if (isEditing) {
      handleUpdateTag(values);
    } else {
      handleAddTag(values);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredTags = tags.filter(tag => tag.nom.toLowerCase().includes(searchText.toLowerCase()));

  const columns = [
    {
      title: "Nom du Tag",
      dataIndex: "nom",
      key: "nom",
      render: (text) => <>{text}</>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => openModal(record)}
            icon={<EditOutlined />}
            style={{ color: "#1890ff", fontWeight: "500" }}
          />
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce tag ?"
            onConfirm={() => handleDeleteTag(record._id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              style={{ fontWeight: "500" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "30px", backgroundColor: "#fafafa", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{
          marginBottom: "20px",
          fontWeight: "bold",
          color: "#003a63",
        }}>Liste des Tags</h2>

      {/* Search and Add button */}
      {/* <Space style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}> */}
        <Input
          placeholder="Rechercher par nom de tag"
          value={searchText}
          onChange={handleSearch}
          style={{
            width: "300px",
            borderRadius: "8px",
            borderColor: "#d9d9d9",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
          prefix={<SearchOutlined />}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openModal}
          style={{ marginBottom: "20px" ,marginLeft:"10px"}}
        >
          Nouveau
        </Button>
      {/* </Space> */}

      {/* Table with vertical scrollbar */}
      <div style={{ maxHeight: "400px", overflowY: "auto", borderRadius: "8px", border: "1px solid #e8e8e8", padding: "10px" }}>
        <Table
          dataSource={filteredTags}
          columns={columns}
          rowKey={(record) => record._id}
          loading={loading}
          pagination={false}
          style={{ maxHeight: "400px", overflowY: "auto" }}
        />
      </div>

      {/* Modal for adding or editing a tag */}
      <Modal
        title={isEditing ? "Modifier le Tag" : "Ajouter un Tag"}
        visible={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="nom"
            label="Nom du Tag"
            rules={[{ required: true, message: "Veuillez entrer le nom du tag." }]}
          >
            <Input placeholder="Nom du Tag" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%", marginBottom: "10px" }}>
              {isEditing ? "Modifier" : "Ajouter"}
            </Button>
            <Button
              style={{
                width: "100%",
                borderRadius: "4px",
                backgroundColor: "#f0f0f0",
                color: "#1890ff",
              }}
              onClick={closeModal}
            >
              Annuler
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReadTagComponent;
