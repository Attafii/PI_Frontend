import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Typography, Space, Input, Form, Select, Upload,Popconfirm } from "antd";
import axios from "axios";
import { SearchOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined, UploadOutlined, DeleteOutlined,EyeOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

const ReadFormateurComponent = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [searchText, setSearchText] = useState('');
  const [specialiteFilter, setSpecialiteFilter] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [form] = Form.useForm();

  // Fetch des formateurs depuis l'API
  const fetchFormateurs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8001/api/users");
      setFormateurs(data.filter(item => item.role === 'formateur').map(item => ({ ...item, key: item._id })));
    } catch (error) {
      console.error("Erreur lors du chargement des formateurs :", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch des spécialités depuis l'API
  const fetchSpecialites = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/specialites");
      setSpecialites(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des spécialités :", error.message);
    }
  };

  // Colonnes à afficher dans le tableau des formateurs
  const columns = [
    {
      title: "N° CIN",
      dataIndex: "num_cin",
      key: "num_cin",
      sorter: (a, b) => a.num_cin.localeCompare(b.num_cin),
    },
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
      sorter: (a, b) => a.nom.localeCompare(b.nom),
    },
    {
      title: "Prénom",
      dataIndex: "prenom",
      key: "prenom",
      sorter: (a, b) => a.prenom.localeCompare(b.prenom),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <Paragraph ellipsis={{ rows: 1, expandable: false }}>
          {text}
        </Paragraph>
      ),
      width: 300,
    },
    {
      title: "Numéro Téléphone",
      dataIndex: "num_tel",
      key: "num_tel",
    },
    {
      title: "CV (PDF)",
      dataIndex: "cv_pdf",
      key: "cv_pdf",
      render: (text) => text ? <a href={`http://localhost:8001/${text}`} target="_blank" rel="noopener noreferrer">Voir CV</a> : null,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="dashed" icon={<InfoCircleOutlined />} onClick={() => handleViewDetails(record)} />
          <Button type="dashed" icon={<EditOutlined style={{ color: "purple" }}/> } onClick={() => handleEdit(record)} />
         
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
      width: 200,
      align: "center",
    },
  ];

  const handleViewDetails = (record) => {
    setIsViewMode(true);
    setIsEditMode(false);
    setModalContent(record);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setIsViewMode(false);
    form.setFieldsValue({
      ...record,
      cv_pdf: record.cv_pdf
        ? [
            {
              uid: '-1',
              name: record.cv_pdf.split('/').pop(), // Nom du fichier
              status: 'done',
              url: `http://localhost:8001/${record.cv_pdf}`, // URL du fichier
            },
          ]
        : [],
    });
    
    setModalContent(record);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setIsViewMode(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalContent({});
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("nom", values.nom);
      formData.append("prenom", values.prenom);
      formData.append("email", values.email);
      formData.append("num_tel", values.num_tel);
      formData.append("num_cin", values.num_cin);
      formData.append("specialite", values.specialite);
  
      // Ajouter les fichiers photo et CV si disponibles
      if (values.photo?.[0]?.originFileObj) {
        formData.append("photo", values.photo[0].originFileObj);
      }
  
      if (values.cv_pdf?.[0]?.originFileObj) {
        formData.append("cv_pdf", values.cv_pdf[0].originFileObj);
      }
  
      // Ajouter les mots de passe
      formData.append("mot_de_passe", values.mot_de_passe);
      formData.append("confirm_mot_de_passe", values.confirm_mot_de_passe);
  
      // Requête API : POST pour ajout, PUT pour mise à jour
      if (isEditMode) {
        await axios.put(
          `http://localhost:8001/api/users/update/${modalContent._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          "http://localhost:8001/api/register",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
  
      // Recharger les formateurs et fermer la modal
      fetchFormateurs();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout ou de la modification du formateur :", error);
      if (error.response) {
        console.error("Détails de l'erreur :", error.response.data);
      }
    }
  };
  
  
  

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8001/api/users/delete/${id}`);
      fetchFormateurs();
    } catch (error) {
      console.error("Erreur lors de la suppression du formateur :", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFormateurs = formateurs.filter(formateur => {
    return (
      formateur.nom.toLowerCase().includes(searchText.toLowerCase()) || 
      formateur.prenom.toLowerCase().includes(searchText.toLowerCase()) || 
      formateur.email.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  useEffect(() => {
    fetchFormateurs();
    fetchSpecialites();
  }, []);

  return (
    <div style={{ margin: "20px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ marginBottom: "20px", fontWeight: "bold", color: "#003a63" }}>
        Liste des Formateurs
      </h2>

      <Space style={{ marginBottom: "20px" }}>
        <Input placeholder="Rechercher par nom, prénom, ou email" value={searchText} onChange={handleSearch} style={{ width: "300px", borderRadius: "8px" }} prefix={<SearchOutlined />} />
      </Space>

      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: "20px" }}>Nouveau</Button>

      <Table
        dataSource={filteredFormateurs}
        columns={columns}
        rowKey="_id"
        loading={loading}
        style={{ maxHeight: "400px", overflowY: "auto" }}
      />

      <Modal
        title={isEditMode ? "Modifier le formateur" : isViewMode ? "" : "Ajouter un formateur"}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
       {isViewMode ? (
  <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
    
    backgroundColor: "#f7f7f7",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto"
  }}>
    {/* Photo du formateur */}
    <div>
      <img
        src={`http://localhost:8001/${modalContent.photo}`}
        alt="Photo de profil"
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>

    {/* Détails du formateur */}
    <div style={{ width: "100%", maxWidth: "800px" }}>
      <Typography.Title level={4} style={{ color: "#003a63", textAlign: "center" }}>
        Détails du Formateur
      </Typography.Title>

      <div style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
      }}>
        {[{ label: "Nom", value: modalContent.nom },
          { label: "Prénom", value: modalContent.prenom },
          { label: "Email", value: modalContent.email },
          { label: "Numéro Téléphone", value: modalContent.num_tel },
          { label: "Numéro CIN", value: modalContent.num_cin },
          { label: "CV", value: <a href={`http://localhost:8001/${modalContent.cv_pdf}`} target="_blank" rel="noopener noreferrer"><EyeOutlined /></a> },
          { label: "Spécialités", value: modalContent.specialite ? modalContent.specialite.split(' ').map((spec, index) => (
            <div key={index} style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              color: "#003a63"
            }}>
              <Typography.Text style={{ marginLeft: "10px" }}>{spec}</Typography.Text>
            </div>
          )) : 'Aucune spécialité définie' },
        ].map((item, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
            <Typography.Text strong style={{
              width: "150px", marginRight: "10px", color: "#003a63"
            }}>
              {item.label} :
            </Typography.Text>
            <Paragraph style={{ marginBottom: "0", flex: 1 }}>
              {item.value}
            </Paragraph>
          </div>
        ))}
      </div>
    </div>
  </div>
) :
(
          <Form form={form} onFinish={handleSubmit} initialValues={{ nom: modalContent.nom, prenom: modalContent.prenom, email: modalContent.email, num_tel: modalContent.num_tel, num_cin: modalContent.num_cin, specialite: modalContent.specialite, cv_pdf: modalContent.cv_pdf }}>
            <Form.Item label="Nom" name="nom" rules={[{ required: true, message: "Veuillez entrer le nom du formateur" }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Prénom" name="prenom" rules={[{ required: true, message: "Veuillez entrer le prénom du formateur" }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Veuillez entrer l'email du formateur" }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Numéro Téléphone" name="num_tel">
              <Input />
            </Form.Item>
            <Form.Item label="Numéro CIN" name="num_cin">
              <Input />
            </Form.Item>
            <Form.Item label="Spécialité(es)" name="specialite">
              <Input />
            </Form.Item>
            <Form.Item
                          label="Photo"
                          name="photo"
                          valuePropName="fileList"
                          getValueFromEvent={(e) => e?.fileList}
                          rules={[{ required: true, message: "Veuillez télécharger une photo" }]}
                        >
                          <Upload
                            listType="picture"
                            accept="image/*"
                            beforeUpload={() => false} // Désactiver l'upload automatique
                          >
                            <Button icon={<UploadOutlined />}>Télécharger une photo</Button>
                          </Upload>
                        </Form.Item>
            <Form.Item
  label="CV (PDF)"
  name="cv_pdf"
  valuePropName="fileList"
  getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
>
  <Upload
    listType="picture"
    accept="application/pdf"
    beforeUpload={() => false} // Empêche le téléversement immédiat
  >
    <Button icon={<UploadOutlined />}>Télécharger un CV</Button>
  </Upload>
</Form.Item>

<Form.Item
              label="Mot de passe"
              name="mot_de_passe"
              rules={[{ required: true, message: "Veuillez entrer un mot de passe" }]}
            >
              <Input.Password />
            </Form.Item>
          
            {/* Champ Confirmer le mot de passe */}
            <Form.Item
              label="Confirmer le mot de passe"
              name="confirm_mot_de_passe"
              dependencies={['mot_de_passe']}
              rules={[
                { required: true, message: "Veuillez confirmer le mot de passe" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('mot_de_passe') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Les mots de passe ne correspondent pas');
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">{isEditMode ? "Mettre à jour" : "Ajouter"}</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ReadFormateurComponent;
