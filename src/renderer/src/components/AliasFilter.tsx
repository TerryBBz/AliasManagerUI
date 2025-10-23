import React from 'react';
import {
  Paper,
  TextField,
  Box,
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  FilterListOff as FilterListOffIcon
} from '@mui/icons-material';

interface AliasFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterBy: 'all' | 'name' | 'command' | 'group';
  onFilterChange: (value: 'all' | 'name' | 'command' | 'group') => void;
  totalResults: number;
  filteredResults: number;
  availableGroups: string[];
  selectedGroup: string;
  onGroupChange: (value: string) => void;
  onClearFilters: () => void;
}

export const AliasFilter: React.FC<AliasFilterProps> = ({
  searchTerm,
  onSearchChange,
  filterBy,
  onFilterChange,
  totalResults,
  filteredResults,
  availableGroups,
  selectedGroup,
  onGroupChange,
  onClearFilters,
}) => {
  const hasActiveFilters = searchTerm || selectedGroup || filterBy !== 'all';
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6">
            Filtrer les alias
          </Typography>
          <Chip
            label={`${filteredResults} / ${totalResults} alias`}
            color={filteredResults === totalResults ? 'primary' : 'secondary'}
            variant="outlined"
            size="small"
          />
        </Box>

        {hasActiveFilters && (
          <Tooltip title="Réinitialiser tous les filtres">
            <IconButton
              onClick={onClearFilters}
              color="secondary"
              size="small"
            >
              <FilterListOffIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Champ de recherche */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <TextField
            fullWidth
            label="Rechercher"
            placeholder="Tapez pour rechercher un alias, commande ou groupe..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <Tooltip title="Effacer la recherche">
                    <IconButton
                      size="small"
                      onClick={() => onSearchChange('')}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>

        {/* Filtre par type */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Rechercher dans</InputLabel>
          <Select
            value={filterBy}
            label="Rechercher dans"
            onChange={(e) => onFilterChange(e.target.value as 'all' | 'name' | 'command' | 'group')}
          >
            <MenuItem value="all">Tout</MenuItem>
            <MenuItem value="name">Nom d'alias</MenuItem>
            <MenuItem value="command">Commande</MenuItem>
            <MenuItem value="group">Groupe</MenuItem>
          </Select>
        </FormControl>

        {/* Filtre par groupe */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Groupe</InputLabel>
          <Select
            value={selectedGroup}
            label="Groupe"
            onChange={(e) => onGroupChange(e.target.value)}
          >
            <MenuItem value="">Tous les groupes</MenuItem>
            {availableGroups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Aide contextuelle */}
      {searchTerm && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredResults === 0 ? (
              <>❌ Aucun résultat pour "<strong>{searchTerm}</strong>"</>
            ) : (
              <>✅ {filteredResults} résultat{filteredResults > 1 ? 's' : ''} trouvé{filteredResults > 1 ? 's' : ''} pour "<strong>{searchTerm}</strong>"</>
            )}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};