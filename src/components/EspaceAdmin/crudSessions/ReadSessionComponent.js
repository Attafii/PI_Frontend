import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Space, Input, DatePicker, Select, Popconfirm, message } from "antd";
import axios from "axios";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const ReadSessionComponent = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [form] = Form.useForm();

  const [searchValue, setSearchValue] = useState("");

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8001/api/sessions");
      setSessions(response.data);
      setFilteredSessions(response.data);
    } catch (error) {
      message.error("Erreur lors de la récupération des sessions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFormations = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/formations");
      setFormations(response.data);
    } catch (error) {
      message.error("Erreur lors de la récupération des formations.");
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchFormations();
  }, []);

  const openModal = (record = null) => {
    setIsModalOpen(true);
    if (record) {
      setIsEditing(true);
      setEditingSession(record);
      form.setFieldsValue({
        ...record,
        date_debut: dayjs(record.date_debut),
        date_fin: dayjs(record.date_fin),
      });
    } else {
      setIsEditing(false);
      setEditingSession(null);
      form.resetFields();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSession(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleFinish = async (values) => {
    const payload = {
      ...values,
      date_debut: values.date_debut.format("YYYY-MM-DD"),
      date_fin: values.date_fin.format("YYYY-MM-DD"),
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8001/api/sessions/${editingSession._id}`, payload);
        message.success("Session modifiée avec succès !");
      } else {
        await axios.post("http://localhost:8001/api/sessions", payload);
        message.success("Session ajoutée avec succès !");
      }
      fetchSessions();
      closeModal();
    } catch (error) {
      message.error("Erreur lors de l'enregistrement de la session.");
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      await axios.delete(`http://localhost:8001/api/sessions/${id}`);
      message.success("Session supprimée avec succès !");
      fetchSessions();
    } catch (error) {
      message.error("Erreur lors de la suppression de la session.");
    }
  };

  const validateStartDate = (_, value) => {
    if (!value || value.isAfter(dayjs(), "day")) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("La date de début doit être après la date courante."));
  };

  const validateEndDate = (_, value) => {
    const startDate = form.getFieldValue("date_debut");
    if (!value || !startDate || value.isAfter(startDate, "day")) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("La date de fin doit être après la date de début."));
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    const filtered = sessions.filter((session) =>
      session.planning_seances.toLowerCase().includes(value) ||
      (session.formationId?.nom || "").toLowerCase().includes(value) ||
      dayjs(session.date_debut).format("DD/MM/YYYY").includes(value) ||
      dayjs(session.date_fin).format("DD/MM/YYYY").includes(value)
    );

    setFilteredSessions(filtered);
  };

  const columns = [
    {
      title: "Date de début",
      dataIndex: "date_debut",
      key: "date_debut",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Date de fin",
      dataIndex: "date_fin",
      key: "date_fin",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Planning des séances",
      dataIndex: "planning_seances",
      key: "planning_seances",
    },
    {
      title: "Formation",
      dataIndex: ["formationId", "nom"],
      key: "formationId",
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
            title="Êtes-vous sûr de vouloir supprimer cette session ?"
            onConfirm={() => handleDeleteSession(record._id)}
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
        }}>Liste des Sessions</h2>
      {/* <Space style={{ marginBottom: "20px", width: "100%" }} direction="vertical"> */}
        <Input
          placeholder="Rechercher une session"
          value={searchValue}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
        //   allowClear
        style={{
            width: "300px",
            borderRadius: "8px",
            borderColor: "#d9d9d9",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          style={{ marginBottom: "20px" ,marginLeft:"10px"}}
        >
          Nouveau
        </Button>
      {/* </Space> */}

      <Table
        dataSource={filteredSessions}
        columns={columns}
        rowKey={(record) => record._id}
        loading={loading}
        style={{ maxHeight: "400px", overflowY: "auto" }}
      />

      <Modal
        title={isEditing ? "Modifier la session" : "Ajouter une session"}
        visible={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="date_debut"
            label="Date de début"
            rules={[
              { required: true, message: "Veuillez entrer la date de début." },
              { validator: validateStartDate },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="date_fin"
            label="Date de fin"
            rules={[
              { required: true, message: "Veuillez entrer la date de fin." },
              { validator: validateEndDate },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="planning_seances"
            label="Planning des séances"
            rules={[{ required: true, message: "Veuillez entrer le planning des séances." }]}
          >
            <Input placeholder="URL ou fichier du planning" />
          </Form.Item>
          <Form.Item
            name="formationId"
            label="Formation"
            rules={[{ required: true, message: "Veuillez sélectionner une formation." }]}
          >
            <Select placeholder="Sélectionner une formation">
              {formations.map((formation) => (
                <Option key={formation._id} value={formation._id}>
                  {formation.titre}
                  {console.log(formation.titre)}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {isEditing ? "Modifier" : "Ajouter"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReadSessionComponent;
