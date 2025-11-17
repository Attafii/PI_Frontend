import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Typography, Space, Input, Form, Select,Upload } from "antd";
import axios from "axios";
import {SearchOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined,UploadOutlined,DeleteOutlined } from "@ant-design/icons";
import { DeleteOutlineRounded, DeleteOutlineSharp, DeleteOutlineTwoTone } from "@mui/icons-material";

const { Paragraph } = Typography;

const ReadCandidatComponent = () => {
  const [candidats, setCandidats] = useState([]);
  const [specialites, setSpecialites] = useState([]); // État pour les spécialités
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [searchText, setSearchText] = useState('');
  const [specialiteFilter, setSpecialiteFilter] = useState(''); // État pour le filtre de spécialité
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [form] = Form.useForm();

  // Fetch des candidats depuis l'API
  const fetchCandidats = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8001/api/users");
      setCandidats(data.map((item) => ({ ...item, key: item._id }))); // Ajout d'une clé unique
    } catch (error) {
      console.error("Erreur lors du chargement des candidats :", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch des spécialités depuis l'API
  const fetchSpecialites = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/specialites");
      const specialites = response.data; // Extraire le tableau de spécialités depuis response.data
      console.log("Specialités reçues :", specialites); // Vérifiez les données reçues dans la console
      setSpecialites(specialites); // Mettre à jour l'état
    } catch (error) {
      console.error("Erreur lors du chargement des spécialités :", error.message);
    }
  };
  
  

  // Colonnes à afficher dans le tableau des candidats
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
        <Paragraph
          ellipsis={{
            rows: 1,
            expandable: false,
          }}
        >
          {text}
        </Paragraph>
      ),
      width: 300,
    },
    {
        title: "Photo",
        dataIndex: "photo",
        key: "photo",
        render: (text) => (
            <img src={`http://localhost:8001/${text}`} alt="photo de profile" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
          ),
        width: 100,
      },
      
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="dashed"
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
          <Button
          type="dashed"
          icon={<DeleteOutlined style={{ color: "darkred" }} />}
          onClick={() => {
            Modal.confirm({
              title: "Confirmez la suppression",
              content: `Êtes-vous sûr de vouloir supprimer le candidat ${record.nom} ${record.prenom} ?`,
              okText: "Oui",
              okType: "danger",
              cancelText: "Non",
              onOk: () => handleDelete(record._id),
            });
          }}
        >
        </Button>
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

  const handleAdd = () => {
    setIsEditMode(false);
    setIsViewMode(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setIsViewMode(false);
    form.setFieldsValue({
      nom: record.nom,
      prenom: record.prenom,
      email: record.email,
      num_tel: record.num_tel,
      num_cin: record.num_cin,
      specialite: record.specialite,
    });
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

  const handleSubmit = async (values) => {
    setLoading(true);
  
    try {
      if (isEditMode) {
        // Extract data and update existing candidate
        const updateData = {
          nom: values.nom,
          prenom: values.prenom,
          email: values.email,
          num_cin: values.num_cin,
          specialite: values.specialite,
          photo: values.photo ? values.photo[0]?.url || values.photo[0]?.response?.url : null,
        };
  
        // Update existing candidate
        await axios.put(
          `http://localhost:8001/api/users/update/${modalContent._id}`,
          updateData,
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        // Call the register function if it's not in edit mode
        await handleRegister(values);
      }
  
      fetchCandidats(); // Refresh candidate list
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout ou de la modification du candidat :", error);
      alert("Erreur lors de la mise à jour, consultez la console pour plus d'informations.");
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async (values) => {
    setLoading(true);
    
    try {
      // Extract the values from the form
      const registerData = {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        role:"candidat",
        num_cin: values.num_cin,
        specialite: values.specialite,
        photo: values.photo ? values.photo[0]?.url || values.photo[0]?.response?.url : null, // Extract URL for photo
        mot_de_passe: values.mot_de_passe, // Adding password for registration
      };
  
      // Call the /api/register API to register the new candidate
      await axios.post("http://localhost:8001/api/register", registerData, {
        headers: { "Content-Type": "application/json" },
      });
  
      // After registration, fetch the candidates list again
      fetchCandidats();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout du candidat :", error);
      alert("Erreur lors de l'ajout, consultez la console pour plus d'informations.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8001/api/users/delete/${id}`);
      // Recharger les données après la suppression
      fetchCandidats();
    } catch (error) {
      console.error("Erreur lors de la suppression du candidat :", error);
      alert("Erreur lors de la suppression, consultez la console pour plus d'informations.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const filteredCandidats = candidats.filter(candidat => {
    return (
      candidat.role === 'candidat' && // Filtrer uniquement les candidats
      (candidat.nom.toLowerCase().includes(searchText.toLowerCase()) || 
      candidat.prenom.toLowerCase().includes(searchText.toLowerCase()) || 
      candidat.email.toLowerCase().includes(searchText.toLowerCase())) &&
      (specialiteFilter === '' || candidat.specialite === specialiteFilter) // Filtrer par spécialité
    );
  });

  useEffect(() => {
    fetchCandidats();
    fetchSpecialites(); // Récupérer les spécialités lors du chargement du composant
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
        Liste des Candidats
      </h2>

      <Space style={{ marginBottom: "20px" }}>
        <Input
          placeholder="Rechercher par nom, prénom, ou email"
          value={searchText}
          onChange={handleSearch}
          style={{
            width: "300px",
            borderRadius: "8px", 
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Ajout d'ombre pour plus de profondeur
          }}
          prefix={<SearchOutlined />}
        />
        <Select
          style={{
            width: "200px",
            borderRadius: "8px", 
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Ajout d'ombre pour plus de profondeur
          }}
          placeholder="Filtrer par spécialité"
          onChange={(value) => setSpecialiteFilter(value)}
          value={specialiteFilter}
          allowClear
        >
          <Select.Option value="">Toutes</Select.Option>
          {specialites.map((specialite) => (
            <Select.Option key={specialite.id} value={specialite}>
              {specialite}
            </Select.Option>
            
          ))}
        </Select>
      </Space>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: "20px" ,marginLeft:"10px"}}
      >
        Nouveau
      </Button>

      <Table
        dataSource={filteredCandidats}
        columns={columns}
        rowKey="_id"
        loading={loading}
       
        style={{ maxHeight: "400px", overflowY: "auto" }}
      />

      <Modal
        title={isEditMode ? "Modifier le candidat" : isViewMode ? "" : "Ajouter un candidat"}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
      {isViewMode ? (
  <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", padding: "20px", backgroundColor: "#f7f7f7", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
    {/* Photo du candidat */}
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

    {/* Détails du candidat */}
    <div style={{ width: "100%", maxWidth: "800px" }}>
      <Typography.Title level={4} style={{ color: "#003a63", textAlign: "center" }}>
        Détails du Candidat
      </Typography.Title>

      <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        {[
          { label: "Nom", value: modalContent.nom },
          { label: "Prénom", value: modalContent.prenom },
          { label: "Email", value: modalContent.email },
          { label: "Numéro CIN", value: modalContent.num_cin },
          { label: "Spécialité", value: modalContent.specialite },
          { label: "Rôle", value: modalContent.role },
        ].map((item, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
            <Typography.Text strong style={{ width: "120px", marginRight: "15px", color: "#003a63" }}>
              {item.label} :
            </Typography.Text>
            <Paragraph style={{ marginBottom: "0", flex: 1 }}>{item.value}</Paragraph>
          </div>
        ))}
      </div>
    </div>
  </div>
) :
 (
            <Form
            form={form}
            onFinish={handleSubmit}
            initialValues={{
              nom: modalContent.nom,
              prenom: modalContent.prenom,
              email: modalContent.email,
              num_cin: modalContent.num_cin,
              specialite: modalContent.specialite,
            }}
          >
            <Form.Item
              label="Nom"
              name="nom"
              rules={[{ required: true, message: "Veuillez entrer le nom du candidat" }]}
            >
              <Input />
            </Form.Item>
          
            <Form.Item
              label="Prénom"
              name="prenom"
              rules={[{ required: true, message: "Veuillez entrer le prénom du candidat" }]}
            >
              <Input />
            </Form.Item>
          
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Veuillez entrer l'email du candidat" }]}
            >
              <Input />
            </Form.Item>
          
            {/* Suppression du champ num_tel */}
          
            <Form.Item
              label="Numéro CIN"
              name="num_cin"
              rules={[{ required: true, message: "Veuillez entrer le numéro CIN" }]}
            >
              <Input />
            </Form.Item>
          
            {/* <Form.Item
              label="Spécialité"
              name="specialite"
              rules={[{ required: true, message: "Veuillez entrer la spécialité" }]}
            > */}
              {/* <Select>
                {specialites.map((specialite) => (
                  <Select.Option key={specialite.id} value={specialite.nom}>
                    {specialite.nom}
                  </Select.Option>
                ))}
              </Select> */}
              {/* <Input />
            </Form.Item> */}
          
            {/* Champ photo pour télécharger une photo */}
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
          
            {/* Champ Mot de passe */}
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
              <Button type="primary" htmlType="submit">
                {isEditMode ? "Mettre à jour" : "Ajouter"}
              </Button>
            </Form.Item>
          </Form>
          
        )}
      </Modal>
    </div>
  );
};

export default ReadCandidatComponent;