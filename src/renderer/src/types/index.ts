export interface AliasData {
  name: string;
  cmd: string;
  disabled: boolean;
  description?: string;
}

export interface AliasGroup {
  [aliasName: string]: AliasData;
}

export interface AliasGroups {
  [groupName: string]: AliasGroup;
}

export interface AliasTableRow {
  id: string;
  name: string;
  command: string;
  group: string;
  enabled: boolean;
  description?: string;
}

export interface AliasDataInput {
  name: string;
  command: string;
  group: string;
  description?: string;
}

export interface AliasUpdateInput {
  oldName: string;
  newName: string;
  command: string;
  group: string;
  description?: string;
}

export interface AliasRemoveInput {
  name: string;
  group: string;
}

export interface AliasToggleInput {
  name: string;
  group: string;
  disabled: boolean;
}

export interface AliasDescriptionInput {
  name: string;
  group: string;
  description: string;
}

export interface GroupStats {
  name: string;
  aliasCount: number;
  activeCount: number;
  disabledCount: number;
  isDeletable: boolean;
  isRenamable: boolean;
}

export interface GroupInfo extends GroupStats {
  aliases: { [aliasName: string]: AliasData };
}

export interface GroupCreateInput {
  groupName: string;
}

export interface GroupRenameInput {
  oldName: string;
  newName: string;
}

export interface GroupDeleteInput {
  groupName: string;
  deleteAliases?: boolean;
}

export interface GroupInfoInput {
  groupName: string;
}

export interface RenameGroupResponse {
  success: boolean;
  message: string;
  aliasCount: number;
}

export interface DeleteGroupResponse {
  success: boolean;
  message: string;
  deletedAliasCount: number;
  transferredAliasCount: number;
}