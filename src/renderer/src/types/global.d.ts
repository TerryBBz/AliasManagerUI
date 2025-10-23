import {
  AliasDataInput,
  AliasUpdateInput,
  AliasRemoveInput,
  AliasToggleInput,
  AliasDescriptionInput,
  GroupCreateInput,
  GroupRenameInput,
  GroupDeleteInput,
  GroupInfoInput,
  AliasGroups,
  GroupStats,
  GroupInfo,
} from './index';

export interface ElectronAPI {
  getAllAliases(): Promise<AliasGroups>;
  getGroups(): Promise<string[]>;
  addAlias(data: AliasDataInput): Promise<{ success: boolean; message: string }>;
  updateAlias(data: AliasUpdateInput): Promise<{ success: boolean; message: string }>;
  removeAlias(data: AliasRemoveInput): Promise<{ success: boolean; message: string }>;
  toggleAlias(data: AliasToggleInput): Promise<{ success: boolean; message: string }>;
  updateAliasDescription(data: AliasDescriptionInput): Promise<{ success: boolean; message: string }>;

  createGroup(data: GroupCreateInput): Promise<{ success: boolean; message: string }>;
  renameGroup(data: GroupRenameInput): Promise<{ success: boolean; message: string; aliasCount: number }>;
  deleteGroup(data: GroupDeleteInput): Promise<{ success: boolean; message: string; deletedAliasCount: number; transferredAliasCount: number }>;
  getGroupInfo(data: GroupInfoInput): Promise<GroupInfo>;
  getGroupsStats(): Promise<GroupStats[]>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}