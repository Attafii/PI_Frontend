import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, TextField, Button, Box, IconButton, Skeleton,
  Grid, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Chip, Avatar, Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import debounce from 'lodash.debounce';
// import Sidebar from '../../Header/SideBar';  

const TableCellStyled = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  padding: theme.spacing(2),
  fontSize: '0.875rem',
}));

export default function ListFormations() {
  const [formations, setFormations] = useState([]);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // États pour les dialogues
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'add', 'edit', 'view'
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);

  // États pour le formulaire
  const [formationData, setFormationData] = useState({
    titre: '',
    description: '',
    horaire: '',
    categorieId: '',
    niveau_difficulte: '',
    tags: [],
    programme: null, // Ajout du programme (fichier)
  });

  // Récupération des formations
  const fetchFormations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8001/api/formations');
      setFormations(response.data);
      setFilteredFormations(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des formations');
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/categories'); 
      console.log(response.data); // Ajoutez cette ligne pour vérifier les données
 // Assurez-vous que l'URL est correcte pour récupérer les catégories
      setCategories(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories', err);
    }
  };
  useEffect(() => {
    fetchFormations();
    fetchCategories();

  }, []);
 
  
 

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredFormations(
      formations.filter(
        (formation) =>
          formation.titre.toLowerCase().includes(value) ||
          (formation.description && formation.description.toLowerCase().includes(value))
      )
    );
  };
  
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getDescriptionRéduite = (description) =>
    description && description.length > 100 ? description.substring(0, 150) + '...' : description || 'Aucune description disponible';

  // Gestion des dialogues
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedFormation(null);
    setFormationData({
      titre: '',
      description: '',
      horaire: '',
      categorieId: '',
      niveau_difficulte: '',
      tags: [],
      programme: null,
    });
  };

  const handleAddFormation = () => {
    setActionType('add');
    setDialogOpen(true);
  };

  const handleEditFormation = (formation) => {
    setActionType('edit');
    setSelectedFormation(formation);
    setFormationData(formation);
    setDialogOpen(true);
  };

  const handleViewDetails = (formation) => {
    setActionType('view');
    setSelectedFormation(formation);
    setDialogOpen(true);
  };

  const handleDeleteFormation = async () => {
    try {
      await axios.delete(`http://localhost:8001/api/formations/delete/${selectedFormation._id}`);
      fetchFormations();
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };



const [tags, setTags] = useState([]); // État pour stocker les tags disponibles

// Récupérer les tags depuis la base de données
const fetchTags = async () => {
  try {
    const response = await axios.get('http://localhost:8001/api/tags');
    setTags(response.data); // Stocker les tags dans l'état
  } catch (err) {
    console.error('Erreur lors du chargement des tags:', err);
  }
};

// Appeler fetchTags dans useEffect
useEffect(() => {
  fetchTags();
}, []);
const [tagInput, setTagInput] = useState(''); // État pour stocker la valeur du tag saisi
const [filteredTags, setFilteredTags] = useState([]); // État pour stocker les tags filtrés
const handleDeleteTag = (tagId) => {
  setFormationData({
    ...formationData,
    tags: formationData.tags.filter((id) => id !== tagId), // Supprimer le tag par son ID
  });
};
// Filtrer les tags en fonction de la saisie
const handleTagInputChange = (e) => {
  const value = e.target.value;
  setTagInput(value);

  if (value.trim()) {
    const filtered = tags.filter((tag) =>
      tag.nom.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTags(filtered);
  } else {
    setFilteredTags([]);
  }
};

// Ajouter un tag sélectionné
const handleAddTag = (tag) => {
  if (!formationData.tags.includes(tag._id)) {
    setFormationData({
      ...formationData,
      tags: [...formationData.tags, tag._id], // Ajouter l'ID du tag
    });
  }
  setTagInput(''); // Réinitialiser le champ de saisie
  setFilteredTags([]); // Réinitialiser la liste des tags filtrés
};



const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('titre', formationData.titre);
  formData.append('description', formationData.description);
  formData.append('changehorraire', formationData.horaire);
  formData.append('niveau_difficulte', formationData.niveau_difficulte);
  formData.append('categorieId', formationData.categorieId); 
  formData.append('tags', JSON.stringify(formationData.tags)); 
  if (formationData.programme) {
    formData.append('programme', formationData.programme); 
  }
for (let [key, value] of formData.entries()) {
  console.log(key, value);
}  
try {
    if (actionType === 'add') {
      await axios.post('http://localhost:8001/api/formations/addFormation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
    } else if (actionType === 'edit') {
      await axios.put(`http://localhost:8001/api/formations/${selectedFormation._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    fetchFormations();
    handleDialogClose();
  } catch (err) {
    console.error('Erreur lors de la soumission:', err);
  }
};
  if (error) return <Typography>{error}</Typography>;

  return (
    <Box display="flex" flexDirection="row" width="100%">
      {/* Sidebar Section */}
      {/* <Sidebar />   */}

      {/* Table Section */}
      <Grid container item xs={12} sm={10} md={10} p={2} spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ padding: 3, borderRadius: '15px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', marginTop: '6%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <TextField
                label="Rechercher une formation"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddFormation}>
                Ajouter
              </Button>
            </Box>

            <TableContainer>
              <Table stickyHeader aria-label="table des formations">
                <TableHead>
                  <TableRow>
                    <TableCellStyled sx={{fontWeight:'bold'}}>Titre</TableCellStyled>
                    <TableCellStyled sx={{fontWeight:'bold'}}>Description</TableCellStyled>
                    <TableCellStyled sx={{fontWeight:'bold'}}>Niveau</TableCellStyled>
                    <TableCellStyled sx={{fontWeight:'bold'}}>Tags</TableCellStyled>
                    <TableCellStyled sx={{fontWeight:'bold'}}>Actions</TableCellStyled>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    [...Array(10)].map((_, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredFormations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((formation) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={formation._id}>
                        <TableCell>{formation.titre}</TableCell>
                        <TableCell>{getDescriptionRéduite(formation.description)}</TableCell>
                        <TableCell>{formation.niveau_difficulte}</TableCell>
                        <TableCell>{formation.tags.map((tag) => tag.nom).join(', ')}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleViewDetails(formation)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton color="secondary" onClick={() => handleEditFormation(formation)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => { setSelectedFormation(formation); setDeleteDialogOpen(true); }}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={filteredFormations.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Dialogue pour ajouter/modifier une formation */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
  <DialogTitle>{actionType === 'add' ? 'Ajouter une formation' : actionType === 'edit' ? 'Modifier la formation' : 'Détails de la formation'}</DialogTitle>
  <DialogContent>
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        margin="normal"
        fullWidth
        label="Titre"
        value={formationData.titre}
        onChange={(e) => setFormationData({ ...formationData, titre: e.target.value })}
        required
        disabled={actionType === 'view'}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Description"
        value={formationData.description}
        onChange={(e) => setFormationData({ ...formationData, description: e.target.value })}
        required
        multiline
        rows={4}
        disabled={actionType === 'view'}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Horaire"
        type="number"
        value={formationData.horaire}
        onChange={(e) => setFormationData({ ...formationData, horaire: e.target.value })}
        InputLabelProps={{ shrink: true }}
        required
        disabled={actionType === 'view'}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Niveau de difficulté</InputLabel>
        <Select
          value={formationData.niveau_difficulte}
          onChange={(e) => setFormationData({ ...formationData, niveau_difficulte: e.target.value })}
          label="Niveau de difficulté"
          required
          disabled={actionType === 'view'}
        >
          <MenuItem value="DEBUTANT">Débutant</MenuItem>
          <MenuItem value="INTERMEDIAIRE">Intermédiaire</MenuItem>
          <MenuItem value="AVANCE">Avancé</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Catégorie</InputLabel>
        <Select
          value={formationData.categorieId}
          onChange={(e) => setFormationData({ ...formationData, categorieId: e.target.value })}
          label="Catégorie"
          required
          disabled={actionType === 'view'}
        >
          {categories.map((categorie) => (
            <MenuItem key={categorie._id} value={categorie._id}>
              {categorie.nom_categorie}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Champ pour ajouter des tags */}
      <TextField
        margin="normal"
        fullWidth
        label="Ajouter un tag"
        value={tagInput}
        onChange={handleTagInputChange}
      />
      {filteredTags.length > 0 && (
        <Box sx={{ maxHeight: 150, overflowY: 'auto', border: '1px solid #ccc', borderRadius: 1, mt: 1 }}>
          {filteredTags.map((tag) => (
            <MenuItem
              key={tag._id}
              onClick={() => handleAddTag(tag)}
              sx={{ cursor: 'pointer' }}
            >
              {tag.nom}
            </MenuItem>
          ))}
        </Box>
      )}

      {/* Afficher les tags sélectionnés */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
        {formationData.tags.map((tagId, index) => {
          const tag = tags.find((t) => t._id === tagId); // Trouver le tag par son ID
          return (
            <Chip
              key={index}
              label={tag ? tag.nom : 'Tag inconnu'} // Afficher le nom du tag
              onDelete={() => handleDeleteTag(tagId)} // Supprimer le tag
              sx={{ margin: 0.5 }}
            />
          );
        })}
      </Box>

      {/* Champ pour télécharger un fichier */}
      <TextField
        margin="normal"
        fullWidth
        type="file"
        onChange={(e) => setFormationData({ ...formationData, programme: e.target.files[0] })}
        required={actionType !== 'view'}
        disabled={actionType === 'view'}
      />
      {actionType !== 'view' && (
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
          {actionType === 'add' ? 'Ajouter' : 'Modifier'}
        </Button>
      )}
    </Box>
  </DialogContent>
</Dialog>

      {/* Dialogue pour confirmer la suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cette formation ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Annuler</Button>
          <Button onClick={handleDeleteFormation} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
