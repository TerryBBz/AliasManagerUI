import React, { useState, useEffect } from 'react';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Alert,
  Snackbar,
  Tabs,
  Tab,
} from '@mui/material';
import { AliasTable } from './components/AliasTable';
import { AliasForm } from './components/AliasForm';
import { GroupManager } from './components/GroupManager';
import {
  AliasGroups,
  AliasGroup,
  AliasData,
  AliasTableRow,
  AliasDataInput,
  AliasUpdateInput,
  AliasRemoveInput,
  AliasToggleInput,
  AliasDescriptionInput,
} from './types';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff88',
    },
    secondary: {
      main: '#ff6b6b',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [aliases, setAliases] = useState<AliasGroups>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadAliases();
  }, []);

  const loadAliases = async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.getAllAliases();
      setAliases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const getTableRows = (): AliasTableRow[] => {
    const rows: AliasTableRow[] = [];

    Object.entries(aliases).forEach(([groupName, group]: [string, AliasGroup]) => {
      Object.entries(group).forEach(([aliasName, alias]: [string, AliasData]) => {
        rows.push({
          id: `${groupName}-${aliasName}`,
          name: aliasName,
          command: alias.cmd,
          group: groupName,
          enabled: !alias.disabled,
          description: alias.description,
        });
      });
    });

    return rows;
  };

  const handleAddAlias = async (name: string, command: string, group: string) => {
    try {
      const aliasData: AliasDataInput = { name, command, group };
      const result = await window.electronAPI.addAlias(aliasData);
      if (result.success) {
        setSuccess(result.message);
        await loadAliases();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
    }
  };

  const handleUpdateAlias = async (
    oldName: string,
    newName: string,
    command: string,
    group: string
  ) => {
    try {
      const updateData: AliasUpdateInput = { oldName, newName, command, group };
      const result = await window.electronAPI.updateAlias(updateData);
      if (result.success) {
        setSuccess(result.message);
        await loadAliases();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
    }
  };

  const handleRemoveAlias = async (name: string, group: string) => {
    try {
      const removeData: AliasRemoveInput = { name, group };
      const result = await window.electronAPI.removeAlias(removeData);
      if (result.success) {
        setSuccess(result.message);
        await loadAliases();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const handleToggleAlias = async (name: string, group: string, disabled: boolean) => {
    try {
      const toggleData: AliasToggleInput = { name, group, disabled };
      const result = await window.electronAPI.toggleAlias(toggleData);
      if (result.success) {
        setSuccess(result.message);
        await loadAliases();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du changement d'état");
    }
  };

  const handleUpdateDescription = async (name: string, group: string, description: string) => {
    try {
      const descriptionData: AliasDescriptionInput = { name, group, description };
      const result = await window.electronAPI.updateAliasDescription(descriptionData);
      if (result.success) {
        setSuccess(result.message);
        await loadAliases();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la description'
      );
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestionnaire d'alias moderne
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="Interface tabs">
            <Tab label="Gestion des Alias" />
            <Tab label="Gestion des Groupes" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box>
            <Box sx={{ mb: 4 }}>
              <AliasForm onAddAlias={handleAddAlias} existingGroups={Object.keys(aliases)} />
            </Box>

            <AliasTable
              data={getTableRows()}
              loading={loading}
              onUpdateAlias={handleUpdateAlias}
              onRemoveAlias={handleRemoveAlias}
              onToggleAlias={handleToggleAlias}
              onUpdateDescription={handleUpdateDescription}
              existingGroups={Object.keys(aliases)}
            />
          </Box>
        )}

        {activeTab === 1 && <GroupManager onDataChange={loadAliases} />}
      </Container>

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
    </ThemeProvider>
  );
}

export default App;