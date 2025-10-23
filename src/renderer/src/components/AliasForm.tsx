import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  Chip
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface AliasFormProps {
  onAddAlias: (name: string, command: string, group: string) => Promise<void>;
  existingGroups: string[];
}

export const AliasForm: React.FC<AliasFormProps> = ({ onAddAlias, existingGroups }) => {
  const [name, setName] = useState('');
  const [command, setCommand] = useState('');
  const [group, setGroup] = useState('default');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setLoading(true);
      await onAddAlias(name.trim(), command.trim(), group.trim());
      setName('');
      setCommand('');
      setGroup('default');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
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
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ajouter un nouvel alias
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Box sx={{ minWidth: 200, flex: '0 0 auto' }}>
            <TextField
              fullWidth
              label="Nom de l'alias"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="mon-alias"
              size="small"
              error={name.length > 0 && !validateAliasName(name)}
              helperText={
                name.length > 0 && !validateAliasName(name)
                  ? "Lettres, chiffres, _ et - uniquement. Ne peut commencer par un chiffre."
                  : "Le nom de l'alias dans le terminal"
              }
            />
          </Box>

          <Box sx={{ minWidth: 300, flex: 1 }}>
            <TextField
              fullWidth
              label="Commande"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="ls -la"
              size="small"
              multiline
              maxRows={3}
              helperText={`${command.length}/1000 caractères`}
              error={command.length > 1000}
            />
          </Box>

          <Box sx={{ minWidth: 150, flex: '0 0 auto' }}>
            <Autocomplete
              freeSolo
              options={existingGroups.length > 0 ? existingGroups : ['default']}
              value={group}
              onChange={(_, newValue) => setGroup(newValue || 'default')}
              onInputChange={(_, newValue) => setGroup(newValue)}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Groupe"
                  error={group.length > 0 && !validateGroupName(group)}
                  helperText={
                    group.length > 0 && !validateGroupName(group)
                      ? "Format invalide"
                      : "Groupe d'organisation"
                  }
                />
              )}
            />
          </Box>

          <Box sx={{ minWidth: 120, flex: '0 0 auto' }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              disabled={!isFormValid || loading}
              size="large"
              sx={{ height: 40 }}
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};