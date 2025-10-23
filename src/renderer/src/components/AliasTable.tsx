import React, { useState } from 'react';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { Chip, Tooltip, Switch, Box, Typography, Paper, TextField } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Code as CodeIcon } from '@mui/icons-material';
import { AliasTableRow } from '../types';
import { EditAliasDialog } from './EditAliasDialog';

interface AliasTableProps {
  data: AliasTableRow[];
  loading: boolean;
  onUpdateAlias: (
    oldName: string,
    newName: string,
    command: string,
    group: string
  ) => Promise<void>;
  onRemoveAlias: (name: string, group: string) => Promise<void>;
  onToggleAlias: (name: string, group: string, disabled: boolean) => Promise<void>;
  onUpdateDescription: (name: string, group: string, description: string) => Promise<void>;
  existingGroups: string[];
}

export const AliasTable: React.FC<AliasTableProps> = ({
  data,
  loading,
  onUpdateAlias,
  onRemoveAlias,
  onToggleAlias,
  onUpdateDescription,
  existingGroups,
}) => {
  const [editingAlias, setEditingAlias] = useState<AliasTableRow | null>(null);
  const [editingDescription, setEditingDescription] = useState<{
    id: string;
    value: string;
  } | null>(null);

  const handleEdit = (alias: AliasTableRow) => {
    setEditingAlias(alias);
  };

  const handleRemove = async (alias: AliasTableRow) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'alias "${alias.name}" ?`)) {
      await onRemoveAlias(alias.name, alias.group);
    }
  };

  const handleToggle = async (alias: AliasTableRow) => {
    await onToggleAlias(alias.name, alias.group, alias.enabled);
  };

  const handleDescriptionClick = (alias: AliasTableRow) => {
    setEditingDescription({ id: alias.id, value: alias.description || '' });
  };

  const handleDescriptionChange = (value: string) => {
    if (editingDescription) {
      setEditingDescription({ ...editingDescription, value });
    }
  };

  const handleDescriptionSave = async (alias: AliasTableRow) => {
    if (editingDescription) {
      await onUpdateDescription(alias.name, alias.group, editingDescription.value);
      setEditingDescription(null);
    }
  };

  const handleDescriptionCancel = () => {
    setEditingDescription(null);
  };

  const groupedData = data.reduce((acc, row) => {
    if (!acc[row.group]) {
      acc[row.group] = [];
    }
    acc[row.group].push(row);
    return acc;
  }, {} as Record<string, AliasTableRow[]>);

  const columns: GridColDef[] = [
    {
      field: 'enabled',
      headerName: 'Statut',
      width: 80,
      renderCell: (params) => (
        <Tooltip title={params.row.enabled ? 'Désactiver' : 'Activer'}>
          <Switch
            checked={params.row.enabled}
            onChange={() => handleToggle(params.row)}
            color="primary"
            size="small"
          />
        </Tooltip>
      ),
    },
    {
      field: 'name',
      headerName: 'Nom',
      width: 150,
      renderCell: (params) => (
        <Tooltip title={`Alias: ${params.value}`}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              backgroundColor: 'primary.main',
              color: 'black',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.875rem',
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'command',
      headerName: 'Commande',
      width: 300,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'group',
      headerName: 'Groupe',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color={params.value === 'default' ? 'secondary' : 'primary'}
        />
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
      renderCell: (params) => {
        const isEditing = editingDescription?.id === params.row.id;

        if (isEditing && editingDescription) {
          return (
            <TextField
              value={editingDescription.value}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              onBlur={() => handleDescriptionSave(params.row)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleDescriptionSave(params.row);
                } else if (e.key === 'Escape') {
                  handleDescriptionCancel();
                }
              }}
              size="small"
              variant="outlined"
              placeholder="Ajouter une description..."
              autoFocus
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          );
        }

        return (
          <Box
            onClick={() => handleDescriptionClick(params.row)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1,
              },
              p: 0.5,
              borderRadius: 1,
              transition: 'background-color 0.2s',
            }}
          >
            {params.value ? (
              <Tooltip title="Cliquer pour modifier">
                <Typography variant="body2" color="text.secondary">
                  {params.value}
                </Typography>
              </Tooltip>
            ) : (
              <Typography variant="body2" color="text.disabled" fontStyle="italic">
                Cliquer pour ajouter une description
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="Modifier">
              <EditIcon />
            </Tooltip>
          }
          label="Modifier"
          onClick={() => handleEdit(params.row)}
          color="primary"
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Supprimer">
              <DeleteIcon sx={{ color: 'error.main' }} />
            </Tooltip>
          }
          label="Supprimer"
          onClick={() => handleRemove(params.row)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Voir la commande">
              <CodeIcon sx={{ color: 'info.main' }} />
            </Tooltip>
          }
          label="Commande"
          onClick={() => {
            navigator.clipboard.writeText(params.row.command);
          }}
          color="inherit"
        />,
      ],
    },
  ];

  return (
    <Paper elevation={2}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Alias ({data.length} total)</Typography>
        <Typography variant="body2" color="text.secondary">
          {Object.keys(groupedData).length} groupe(s): {Object.keys(groupedData).join(', ')}
        </Typography>
      </Box>

      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          loading={loading}
          autoHeight
          pageSizeOptions={[25, 50, 100]}
          paginationMode="client"
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
            sorting: {
              sortModel: [
                { field: 'group', sort: 'asc' },
                { field: 'name', sort: 'asc' },
              ],
            },
          }}
          getRowClassName={(params) => (!params.row.enabled ? 'disabled-row' : '')}
          sx={{
            '& .disabled-row': {
              opacity: 0.6,
              backgroundColor: 'action.disabled',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-main': {
              overflow: 'visible',
            },
          }}
          disableRowSelectionOnClick
          density="comfortable"
        />
      </Box>

      {editingAlias && (
        <EditAliasDialog
          alias={editingAlias}
          open={!!editingAlias}
          onClose={() => setEditingAlias(null)}
          onSave={onUpdateAlias}
          existingGroups={existingGroups}
        />
      )}
    </Paper>
  );
};