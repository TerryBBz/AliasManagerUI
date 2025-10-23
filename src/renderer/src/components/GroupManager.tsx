import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Snackbar,
  Stack,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  GroupStats,
  GroupInfo,
  GroupCreateInput,
  GroupRenameInput,
  GroupDeleteInput,
  GroupInfoInput,
} from '../types';

interface GroupManagerProps {
  onDataChange: () => Promise<void>;
}

export const GroupManager: React.FC<GroupManagerProps> = ({ onDataChange }) => {
  const [groups, setGroups] = useState<GroupStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<GroupStats | null>(null);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);

  const [newGroupName, setNewGroupName] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [deleteAliases, setDeleteAliases] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.getGroupsStats();
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des groupes');
    } finally {
      setLoading(false);
    }
  };

  const validateGroupName = (name: string): boolean => {
    return /^[a-zA-Z0-9_-]+$/.test(name) && name.length <= 30;
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !validateGroupName(newGroupName.trim())) {
      setError('Nom de groupe invalide');
      return;
    }

    try {
      const data: GroupCreateInput = { groupName: newGroupName.trim() };
      const result = await window.electronAPI.createGroup(data);
      if (result.success) {
        setSuccess(result.message);
        setCreateDialogOpen(false);
        setNewGroupName('');
        await loadGroups();
        await onDataChange();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du groupe');
    }
  };

  const handleRenameGroup = async () => {
    if (!selectedGroup || !renameValue.trim() || !validateGroupName(renameValue.trim())) {
      setError('Nouveau nom de groupe invalide');
      return;
    }

    try {
      const data: GroupRenameInput = {
        oldName: selectedGroup.name,
        newName: renameValue.trim(),
      };
      const result = await window.electronAPI.renameGroup(data);
      if (result.success) {
        setSuccess(`${result.message} (${result.aliasCount} alias(es) déplacé(s))`);
        setRenameDialogOpen(false);
        setRenameValue('');
        setSelectedGroup(null);
        await loadGroups();
        await onDataChange();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du renommage du groupe');
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    try {
      const data: GroupDeleteInput = {
        groupName: selectedGroup.name,
        deleteAliases,
      };
      const result = await window.electronAPI.deleteGroup(data);
      if (result.success) {
        setSuccess(result.message);
        setDeleteDialogOpen(false);
        setDeleteAliases(false);
        setSelectedGroup(null);
        await loadGroups();
        await onDataChange();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du groupe');
    }
  };

  const handleViewGroup = async (group: GroupStats) => {
    try {
      const data: GroupInfoInput = { groupName: group.name };
      const info = await window.electronAPI.getGroupInfo(data);
      setGroupInfo(info);
      setViewDialogOpen(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la récupération des informations'
      );
    }
  };

  const openRenameDialog = (group: GroupStats) => {
    setSelectedGroup(group);
    setRenameValue(group.name);
    setRenameDialogOpen(true);
  };

  const openDeleteDialog = (group: GroupStats) => {
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Gestion des Groupes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Nouveau Groupe
        </Button>
      </Box>

      {loading ? (
        <Typography>Chargement...</Typography>
      ) : (
        <Stack spacing={2}>
          {groups.map((group) => (
            <Card key={group.name} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <GroupIcon color="primary" />
                    <Box>
                      <Typography variant="h6" component="div">
                        {group.name}
                        {group.name === 'default' && (
                          <Chip size="small" label="Par défaut" sx={{ ml: 1 }} />
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {group.aliasCount} alias(es) • {group.activeCount} actif(s) •{' '}
                        {group.disabledCount} désactivé(s)
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Voir les détails">
                      <IconButton
                        size="small"
                        onClick={() => handleViewGroup(group)}
                        color="info"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    {group.isRenamable && (
                      <Tooltip title="Renommer">
                        <IconButton
                          size="small"
                          onClick={() => openRenameDialog(group)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {group.isDeletable && (
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => openDeleteDialog(group)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Dialog de création */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Créer un nouveau groupe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du groupe"
            fullWidth
            variant="outlined"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            error={newGroupName.length > 0 && !validateGroupName(newGroupName)}
            helperText={
              newGroupName.length > 0 && !validateGroupName(newGroupName)
                ? 'Lettres, chiffres, _ et - uniquement (max 30 caractères)'
                : 'Utilisez des lettres, chiffres, _ et -'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleCreateGroup}
            variant="contained"
            disabled={!newGroupName.trim() || !validateGroupName(newGroupName.trim())}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de renommage */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle>Renommer le groupe "{selectedGroup?.name}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nouveau nom"
            fullWidth
            variant="outlined"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            error={renameValue.length > 0 && !validateGroupName(renameValue)}
            helperText={
              renameValue.length > 0 && !validateGroupName(renameValue)
                ? 'Lettres, chiffres, _ et - uniquement (max 30 caractères)'
                : 'Nouveau nom pour le groupe'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleRenameGroup}
            variant="contained"
            disabled={!renameValue.trim() || !validateGroupName(renameValue.trim())}
          >
            Renommer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Supprimer le groupe "{selectedGroup?.name}"</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Ce groupe contient {selectedGroup?.aliasCount} alias(es).
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={deleteAliases}
                onChange={(e) => setDeleteAliases(e.target.checked)}
                color="error"
              />
            }
            label="Supprimer définitivement tous les alias de ce groupe"
          />

          {!deleteAliases && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Les alias seront transférés vers le groupe "default".
            </Alert>
          )}

          {deleteAliases && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              ⚠️ Cette action est irréversible ! Tous les alias seront perdus.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteGroup} variant="contained" color="error">
            {deleteAliases ? 'Supprimer définitivement' : 'Supprimer et transférer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de visualisation */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Détails du groupe "{groupInfo?.name}"</DialogTitle>
        <DialogContent>
          {groupInfo && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>
              <Typography variant="body2" paragraph>
                Total: {groupInfo.aliasCount} alias(es) • Actifs: {groupInfo.activeCount} •
                Désactivés: {groupInfo.disabledCount}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Liste des alias
              </Typography>
              <List dense>
                {Object.entries(groupInfo.aliases).map(([aliasName, alias]) => (
                  <ListItem key={aliasName}>
                    <ListItemText
                      primary={aliasName}
                      secondary={alias.cmd}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                        },
                        '& .MuiListItemText-secondary': {
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        size="small"
                        label={alias.disabled ? 'Désactivé' : 'Actif'}
                        color={alias.disabled ? 'error' : 'success'}
                        variant="outlined"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess(null)}>
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};