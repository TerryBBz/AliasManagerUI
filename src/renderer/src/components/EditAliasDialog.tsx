import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Typography,
  Box,
  Chip,
  Stack
} from '@mui/material';
import { AliasTableRow } from '../types';

interface EditAliasDialogProps {
  alias: AliasTableRow;
  open: boolean;
  onClose: () => void;
  onSave: (oldName: string, newName: string, command: string, group: string) => Promise<void>;
  existingGroups: string[];
}

export const EditAliasDialog: React.FC<EditAliasDialogProps> = ({
  alias,
  open,
  onClose,
  onSave,
  existingGroups
}) => {
  const [name, setName] = useState('');
  const [command, setCommand] = useState('');
  const [group, setGroup] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (alias) {
      setName(alias.name);
      setCommand(alias.command);
      setGroup(alias.group);
    }
  }, [alias]);

  const handleSave = async () => {
    if (!isFormValid) return;

    try {
      setLoading(true);
      await onSave(alias.name, name.trim(), command.trim(), group.trim());
      onClose();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateAliasName = (value: string): boolean => {
    const aliasNameRegex = /^[a-zA-Z0-9_-]+$/;
    const maxLength = 50;
    const startsWithDigit = /^\d/;

    return aliasNameRegex.test(value) &&
           value.length <= maxLength &&
           !startsWithDigit.test(value);
  };

  const validateGroupName = (value: string): boolean => {
    const groupNameRegex = /^[a-zA-Z0-9_-]+$/;
    const maxLength = 30;

    return groupNameRegex.test(value) && value.length <= maxLength;
  };

  const isFormValid =
    name.length > 0 &&
    command.length > 0 &&
    group.length > 0 &&
    validateAliasName(name) &&
    validateGroupName(group) &&
    command.length <= 1000;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Modifier l'alias "{alias?.name}"
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Nom de l'alias"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="nom-alias"
              helperText={
                name.length > 0 && !validateAliasName(name)
                  ? "Lettres, chiffres, _ et - uniquement"
                  : "Le nom de l'alias dans le terminal"
              }
              error={name.length > 0 && !validateAliasName(name)}
              sx={{ flex: 1 }}
            />

            <Autocomplete
              freeSolo
              options={existingGroups.length > 0 ? existingGroups : ['default']}
              value={group}
              onChange={(_, newValue) => setGroup(newValue || 'default')}
              onInputChange={(_, newValue) => setGroup(newValue)}
              sx={{ flex: 1 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Groupe"
                  error={group.length > 0 && !validateGroupName(group)}
                  helperText={
                    group.length > 0 && !validateGroupName(group)
                      ? "Format de groupe invalide"
                      : "Groupe d'organisation"
                  }
                />
              )}
            />
          </Box>

          <TextField
            fullWidth
            label="Commande"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            multiline
            rows={4}
            helperText={`${command.length}/1000 caractères`}
            error={command.length > 1000}
            placeholder="La commande qui sera exécutée..."
          />

          {alias.description && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Description actuelle:</strong> {alias.description}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isFormValid || loading}
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};