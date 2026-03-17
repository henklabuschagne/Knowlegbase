import { useState, useEffect } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Loader2, Plus, Users, Shield, Trash2, UserPlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface Team {
  teamId: number;
  teamName: string;
  description?: string;
  members: { userId: number; userName: string; teamRole: string }[];
}

interface CustomRole {
  roleId: number;
  roleName: string;
  description?: string;
  permissions: { resource: string; action: string; scope: string; conditions?: string }[];
}

interface CreateTeam {
  teamName: string;
  description?: string;
}

interface CreateCustomRole {
  roleName: string;
  description?: string;
  permissions: CreateRolePermission[];
}

interface CreateRolePermission {
  resource: string;
  action: string;
  scope: string;
  conditions?: string;
}

interface AddTeamMember {
  userId: number;
  teamRole: string;
}

export function PermissionManager() {
  const { teams: storeTeams, roles: storeRoles, actions } = useAppStore('users');
  const [teams, setTeams] = useState<Team[]>([]);
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Teams
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeam, setNewTeam] = useState<CreateTeam>({
    teamName: '',
    description: '',
  });
  const [newMember, setNewMember] = useState<AddTeamMember>({
    userId: 0,
    teamRole: 'Member',
  });

  // Roles
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState<CreateCustomRole>({
    roleName: '',
    description: '',
    permissions: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        actions.getTeams(),
        actions.getRoles(),
      ]);
      // Build mock teams/roles from store data
      const mockTeams: Team[] = (storeTeams || []).map((t: any) => ({
        teamId: t.teamId,
        teamName: t.teamName,
        description: t.description || '',
        members: [],
      }));
      const mockRoles: CustomRole[] = (storeRoles || []).map((r: any) => ({
        roleId: r.roleId,
        roleName: r.roleName,
        description: r.description || '',
        permissions: [],
      }));
      setTeams(mockTeams);
      setRoles(mockRoles);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update teams/roles when store data changes
  useEffect(() => {
    if (storeTeams) {
      setTeams((storeTeams || []).map((t: any) => ({
        teamId: t.teamId,
        teamName: t.teamName,
        description: t.description || '',
        members: [],
      })));
    }
    if (storeRoles) {
      setRoles((storeRoles || []).map((r: any) => ({
        roleId: r.roleId,
        roleName: r.roleName,
        description: r.description || '',
        permissions: [],
      })));
    }
  }, [storeTeams, storeRoles]);

  const handleCreateTeam = async () => {
    // Mock: add to local state
    const newTeamObj: Team = {
      teamId: Date.now(),
      teamName: newTeam.teamName,
      description: newTeam.description,
      members: [],
    };
    setTeams(prev => [...prev, newTeamObj]);
    setShowCreateTeamDialog(false);
    setNewTeam({ teamName: '', description: '' });
  };

  const handleAddMember = async () => {
    if (!selectedTeam) return;
    // Mock: add member to local state
    setTeams(prev => prev.map(t => 
      t.teamId === selectedTeam.teamId 
        ? { ...t, members: [...t.members, { userId: newMember.userId, userName: `User ${newMember.userId}`, teamRole: newMember.teamRole }] }
        : t
    ));
    setShowAddMemberDialog(false);
    setNewMember({ userId: 0, teamRole: 'Member' });
  };

  const handleCreateRole = async () => {
    // Mock: add to local state
    const newRoleObj: CustomRole = {
      roleId: Date.now(),
      roleName: newRole.roleName,
      description: newRole.description,
      permissions: newRole.permissions,
    };
    setRoles(prev => [...prev, newRoleObj]);
    setShowCreateRoleDialog(false);
    setNewRole({ roleName: '', description: '', permissions: [] });
  };

  const addPermission = () => {
    setNewRole({
      ...newRole,
      permissions: [
        ...newRole.permissions,
        {
          resource: 'Articles',
          action: 'Read',
          scope: 'All',
          conditions: '',
        },
      ],
    });
  };

  const removePermission = (index: number) => {
    setNewRole({
      ...newRole,
      permissions: newRole.permissions.filter((_, i) => i !== index),
    });
  };

  const updatePermission = (index: number, updates: Partial<CreateRolePermission>) => {
    const updatedPermissions = [...newRole.permissions];
    updatedPermissions[index] = { ...updatedPermissions[index], ...updates };
    setNewRole({ ...newRole, permissions: updatedPermissions });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1>Permission Management</h1>
        <p className="text-muted-foreground">
          Manage teams, custom roles, and permissions
        </p>
      </div>

      <Tabs defaultValue="teams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="roles">Custom Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="size-5" />
                    Teams
                  </CardTitle>
                  <CardDescription>Organize users into teams</CardDescription>
                </div>
                <Button onClick={() => setShowCreateTeamDialog(true)}>
                  <Plus className="size-4 mr-2" />
                  Create Team
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-8 animate-spin" />
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No teams found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow key={team.teamId}>
                        <TableCell>{team.teamName}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {team.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{team.members.length}</Badge>
                        </TableCell>
                        <TableCell>{(team as any).createdByName || 'System'}</TableCell>
                        <TableCell>
                          <Badge variant={(team as any).isActive !== false ? 'default' : 'secondary'}>
                            {(team as any).isActive !== false ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTeam(team);
                                setShowAddMemberDialog(true);
                              }}
                            >
                              <UserPlus className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="size-5" />
                    Custom Roles
                  </CardTitle>
                  <CardDescription>
                    Define custom roles with specific permissions
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCreateRoleDialog(true)}>
                  <Plus className="size-4 mr-2" />
                  Create Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-8 animate-spin" />
                </div>
              ) : roles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No custom roles found
                </div>
              ) : (
                <div className="space-y-4">
                  {roles.map((role) => (
                    <Card key={role.roleId}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{role.roleName}</CardTitle>
                            {role.description && (
                              <CardDescription>{role.description}</CardDescription>
                            )}
                          </div>
                          <Badge variant={(role as any).isActive !== false ? 'default' : 'secondary'}>
                            {(role as any).isActive !== false ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <Label className="mb-2 block">Permissions</Label>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.length === 0 ? (
                              <span className="text-sm text-muted-foreground">
                                No permissions
                              </span>
                            ) : (
                              role.permissions.map((perm, pIdx) => (
                                <Badge key={pIdx} variant="outline">
                                  {perm.resource} - {perm.action} ({perm.scope})
                                </Badge>
                              ))
                            )}
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-muted-foreground">
                          Created by System
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Team Dialog */}
      <Dialog open={showCreateTeamDialog} onOpenChange={setShowCreateTeamDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>Create a new team to organize users</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={newTeam.teamName}
                onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })}
                placeholder="e.g., Engineering Team"
              />
            </div>
            <div>
              <Label htmlFor="teamDescription">Description</Label>
              <Textarea
                id="teamDescription"
                value={newTeam.description}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, description: e.target.value })
                }
                placeholder="Brief description of the team"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateTeamDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeam}>Create Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Team Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a user to {selectedTeam?.teamName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="number"
                value={newMember.userId || ''}
                onChange={(e) =>
                  setNewMember({ ...newMember, userId: parseInt(e.target.value) || 0 })
                }
                placeholder="Enter user ID"
              />
            </div>
            <div>
              <Label htmlFor="teamRole">Team Role</Label>
              <Select
                value={newMember.teamRole}
                onValueChange={(value) => setNewMember({ ...newMember, teamRole: value })}
              >
                <SelectTrigger id="teamRole">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Role Dialog */}
      <Dialog open={showCreateRoleDialog} onOpenChange={setShowCreateRoleDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Custom Role</DialogTitle>
            <DialogDescription>
              Define a custom role with specific permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={newRole.roleName}
                onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })}
                placeholder="e.g., Content Editor"
              />
            </div>
            <div>
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea
                id="roleDescription"
                value={newRole.description}
                onChange={(e) =>
                  setNewRole({ ...newRole, description: e.target.value })
                }
                placeholder="Brief description of this role"
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Permissions</Label>
                <Button variant="outline" size="sm" onClick={addPermission}>
                  <Plus className="size-4 mr-2" />
                  Add Permission
                </Button>
              </div>

              {newRole.permissions.map((perm, index) => (
                <Card key={index} className="p-4 mb-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Resource</Label>
                      <Select
                        value={perm.resource}
                        onValueChange={(value) =>
                          updatePermission(index, { resource: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Articles">Articles</SelectItem>
                          <SelectItem value="Users">Users</SelectItem>
                          <SelectItem value="Tags">Tags</SelectItem>
                          <SelectItem value="Feedback">Feedback</SelectItem>
                          <SelectItem value="Analytics">Analytics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Action</Label>
                      <Select
                        value={perm.action}
                        onValueChange={(value) =>
                          updatePermission(index, { action: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Read">Read</SelectItem>
                          <SelectItem value="Create">Create</SelectItem>
                          <SelectItem value="Update">Update</SelectItem>
                          <SelectItem value="Delete">Delete</SelectItem>
                          <SelectItem value="Approve">Approve</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Scope</Label>
                      <Select
                        value={perm.scope}
                        onValueChange={(value) =>
                          updatePermission(index, { scope: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Own">Own</SelectItem>
                          <SelectItem value="Team">Team</SelectItem>
                          <SelectItem value="None">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removePermission(index)}
                    className="mt-2"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Remove
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole}>Create Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}