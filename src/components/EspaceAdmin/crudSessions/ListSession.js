import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Button, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Box, Grid, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Sidebar from "../../Header/SideBar";  // Assurez-vous que la sidebar est bien importée

export default function ListSessions() {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionData, setSessionData] = useState({
    date_debut: "",
    date_fin: "",
    planning_seances: "",
    formationId: "",
  });
  const [formations, setFormations] = useState([]);  // Ajouter un état pour les formations

  // Récupérer les sessions
  const fetchSessions = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/sessions");
      setSessions(response.data);
      setFilteredSessions(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des sessions", err);
    }
  };

  // Récupérer les formations
  const fetchFormations = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/formations");  // Remplacez cette URL si nécessaire
      setFormations(response.data);  // Assurez-vous que vous avez la bonne structure de données
    } catch (err) {
      console.error("Erreur lors du chargement des formations", err);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchFormations();  // Récupérer les formations quand le composant se charge
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredSessions(
      sessions.filter(
        (session) => session.formationId.titre.toLowerCase().includes(value)
      )
    );
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(+event.target.value);

  const handleEditSession = (session) => {

    const formatDateForInput = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
  //formatage de la date avant l'affichage des données dans l'input
    setSessionData({
      _id: session._id,
      date_debut: formatDateForInput(session.date_debut),  
      date_fin: formatDateForInput(session.date_fin),     
      planning_seances: session.planning_seances,
      formationId: session.formationId._id,  
    });
  
    setDialogOpen(true);
  };
  

  const handleDeleteSession = async () => {
    try {
      await axios.delete(`http://localhost:8001/api/sessions/delete/${sessionData._id}`);
      fetchSessions();
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Erreur lors de la suppression de la session", err);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSessionData({ date_debut: "", date_fin: "", planning_seances: "", formationId: "" });
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Les mois sont indexés à partir de 0
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  return (
    <Box display="flex" width="100%">
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content Section */}
      <Grid container item xs={12} sm={10} md={10} p={2} spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ padding: 3, borderRadius: '15px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', marginTop: '6%' }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <TextField
                label="Rechercher une session"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
                Ajouter
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Formation ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date de début</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date de fin</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSessions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((session) => (
                    <TableRow key={session._id}>
                      <TableCell>{session.formationId ? session.formationId.titre : "Formation inconnue"}</TableCell>
                      <TableCell>{formatDate(session.date_debut)}</TableCell> 
  <TableCell>{formatDate(session.date_fin)}</TableCell> 
                      <TableCell>
                        <IconButton color="secondary" onClick={() => handleEditSession(session)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => { setSessionData(session); setDeleteDialogOpen(true); }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10]}
              count={filteredSessions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Dialog for Adding or Editing Session */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
              <DialogTitle>{sessionData._id ? "Modifier la session" : "Ajouter une session"}</DialogTitle>
              <DialogContent>
                <TextField
                  label="Date de début"
                  type="date"
                  value={sessionData.date_debut}
                  onChange={(e) => setSessionData({ ...sessionData, date_debut: e.target.value })}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Date de fin"
                  type="date"
                  value={sessionData.date_fin}
                  onChange={(e) => setSessionData({ ...sessionData, date_fin: e.target.value })}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Planning des séances"
                  value={sessionData.planning_seances}
                  onChange={(e) => setSessionData({ ...sessionData, planning_seances: e.target.value })}
                  fullWidth
                  margin="normal"
                />

                {/* Sélection de la formation */}
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="formation-label">Formation</InputLabel>
                  <Select
                    labelId="formation-label"
                    value={sessionData.formationId}
                    onChange={(e) => setSessionData({ ...sessionData, formationId: e.target.value })}
                    label="Formation"
                  >
                    {formations.map((formation) => (
                      <MenuItem key={formation._id} value={formation._id}>
                        {formation.titre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Annuler</Button>
                <Button
                  onClick={() => {
                    if (sessionData._id) {
                      axios.put(`http://localhost:8001/api/sessions/update/${sessionData._id}`, sessionData).then(fetchSessions);
                    } else {
                      axios.post("http://localhost:8001/api/addSession", sessionData).then(fetchSessions);
                    }
                    setDialogOpen(false);
                  }}
                  variant="contained"
                  color="primary"
                >
                  {sessionData._id ? "Modifier" : "Ajouter"}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
              <DialogTitle>Supprimer la session</DialogTitle>
              <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleDeleteSession} color="error" variant="contained">Supprimer</Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
