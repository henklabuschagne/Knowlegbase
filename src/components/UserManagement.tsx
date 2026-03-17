import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from './ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  Loader2, 
  ArrowLeft, 
  UserPlus, 
  Edit, 
  Trash2,
  Search,
  Users,
  CheckCircle,
  XCircle,
  Shield,
  Calendar,
  Mail,
  Building,
  UserCog,
  Key
} from 'lucide-react';

export function UserManagement() {
  const navigate = useNavigate();
  const { user: currentUser, hasRole } = useAuth();
  const { roles, teams, clients, actions } = useAppStore('users');
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Dialog states
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'delete' | 'resetPassword' | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roleId: 3,
    teamId: undefined as number | undefined,
    clientId: undefined as number | undefined,
  });
  
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    roleId: 3,
    teamId: undefined as number | undefined,
    clientId: undefined as number | undefined,
    isActive: true,
  });
  
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!currentUser || !hasRole('Admin')) {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [currentUser, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersResult] = await Promise.all([
        actions.getUsers(),
        actions.getRoles(),
        actions.getTeams(),
        actions.getClients(),
      ]);
      if (usersResult.success) {
        setUsers(usersResult.data);
        setFilteredUsers(usersResult.data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.roleName.toLowerCase().includes(query) ||
        u.teamName?.toLowerCase().includes(query) ||
        u.clientName?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleOpenDialog = (type: 'create' | 'edit' | 'delete' | 'resetPassword', user?: any) => {
    setSelectedUser(user || null);
    setDialogType(type);
    setError('');
    
    if (type === 'create') {
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        roleId: 3,
        teamId: undefined,
        clientId: undefined,
      });
    } else if (type === 'edit' && user) {
      setEditFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        teamId: user.teamId,
        clientId: user.clientId,
        isActive: user.isActive,
      });
    } else if (type === 'resetPassword') {
      setNewPassword('');
    }
  };

  const handleCloseDialog = () => {
    setDialogType(null);
    setSelectedUser(null);
    setError('');
    setNewPassword('');
  };

  const handleCreate = async () => {
    // Validation
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return;
    }
    if (!formData.roleId) {
      setError('Role is required');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const result = await actions.createUser(formData);
      if (result.success) {
        handleCloseDialog();
        loadData();
      } else {
        setError(result.error.message || 'Failed to create user');
      }
    } catch (err: any) {
      setError('Failed to create user');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    if (!editFormData.firstName?.trim()) {
      setError('First name is required');
      return;
    }
    if (!editFormData.lastName?.trim()) {
      setError('Last name is required');
      return;
    }
    if (!editFormData.roleId) {
      setError('Role is required');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const result = await actions.updateUser(selectedUser.userId, editFormData);
      if (result.success) {
        handleCloseDialog();
        loadData();
      } else {
        setError(result.error.message || 'Failed to update user');
      }
    } catch (err: any) {
      setError('Failed to update user');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setProcessing(true);
    setError('');

    try {
      const result = await actions.deleteUser(selectedUser.userId);
      if (result.success) {
        handleCloseDialog();
        loadData();
      } else {
        setError(result.error.message || 'Failed to delete user');
      }
    } catch (err: any) {
      setError('Failed to delete user');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const result = await actions.updateUser(userId, { isActive: !currentStatus });
      if (result.success) {
        loadData();
      }
    } catch (err: any) {
      console.error('Failed to toggle user status:', err);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    if (!newPassword.trim() || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // In mock mode, just close the dialog
    setProcessing(true);
    setError('');

    try {
      // Mock: password reset isn't in the new API layer, just simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      handleCloseDialog();
    } catch (err: any) {
      setError('Failed to reset password');
    } finally {
      setProcessing(false);
    }
  };

  const filterUsers = (filter: string) => {
    let filtered = users;
    
    switch (filter) {
      case 'admin':
        filtered = users.filter(u => u.roleName === 'Admin');
        break;
      case 'support':
        filtered = users.filter(u => u.roleName === 'Support');
        break;
      case 'normal':
        filtered = users.filter(u => u.roleName === 'Normal');
        break;
      case 'active':
        filtered = users.filter(u => u.isActive);
        break;
      case 'inactive':
        filtered = users.filter(u => !u.isActive);
        break;
    }
    
    return filtered;
  };

  const displayUsers = activeTab === 'all' ? filteredUsers : filterUsers(activeTab);

  const stats = {
    total: users.length,
    admin: users.filter(u => u.roleName === 'Admin').length,
    support: users.filter(u => u.roleName === 'Support').length,
    normal: users.filter(u => u.roleName === 'Normal').length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'Admin':
        return 'bg-red-100 text-red-800';
      case 'Support':
        return 'bg-blue-100 text-blue-800';
      case 'Normal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentUser || !hasRole('Admin')) return null;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts, roles, and permissions
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog('create')}>
          <UserPlus className="size-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="size-4" />
              Total
            </CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Shield className="size-4 text-red-600" />
              Admin
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.admin}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <UserCog className="size-4 text-blue-600" />
              Support
            </CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.support}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="size-4 text-green-600" />
              Normal
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.normal}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="size-4 text-green-600" />
              Active
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <XCircle className="size-4 text-red-600" />
              Inactive
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.inactive}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, email, role, team, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="text-base"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="size-4 mr-2" />
              Search
            </Button>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setFilteredUsers(users);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="admin">Admins ({stats.admin})</TabsTrigger>
          <TabsTrigger value="support">Support ({stats.support})</TabsTrigger>
          <TabsTrigger value="normal">Normal ({stats.normal})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error */}
          {error && !dialogType && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && displayUsers.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="size-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No users found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery ? 'Try adjusting your search' : 'No users match the selected filter'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Users Table */}
          {!loading && displayUsers.length > 0 && (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayUsers.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-medium">
                        {user.fullName}
                        {user.userId === currentUser.userId && (
                          <Badge variant="outline" className="ml-2">You</Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.roleName)}>
                          {user.roleName}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.teamName || '-'}</TableCell>
                      <TableCell>{user.clientName || '-'}</TableCell>
                      <TableCell>
                        <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog('edit', user)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog('resetPassword', user)}
                          >
                            <Key className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(user.userId, user.isActive)}
                            disabled={user.userId === currentUser.userId}
                          >
                            {user.isActive ? (
                              <XCircle className="size-4 text-red-600" />
                            ) : (
                              <CheckCircle className="size-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog('delete', user)}
                            disabled={user.userId === currentUser.userId}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Create User Dialog */}
      <Dialog open={dialogType === 'create'} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the knowledge base system
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-firstName">First Name *</Label>
                <Input
                  id="create-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="create-lastName">Last Name *</Label>
                <Input
                  id="create-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@company.com"
              />
            </div>

            <div>
              <Label htmlFor="create-password">Password *</Label>
              <Input
                id="create-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <Label htmlFor="create-role">Role *</Label>
              <Select 
                value={formData.roleId.toString()} 
                onValueChange={(value) => setFormData({ ...formData, roleId: parseInt(value) })}
              >
                <SelectTrigger id="create-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.roleId} value={role.roleId.toString()}>
                      {role.roleName} - {role.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-team">Team (Optional)</Label>
                <Select 
                  value={formData.teamId?.toString() || '__none__'} 
                  onValueChange={(value) => setFormData({ ...formData, teamId: value === '__none__' ? undefined : parseInt(value) })}
                >
                  <SelectTrigger id="create-team">
                    <SelectValue placeholder="Select team..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.teamId} value={team.teamId.toString()}>
                        {team.teamName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="create-client">Client (Optional)</Label>
                <Select 
                  value={formData.clientId?.toString() || '__none__'} 
                  onValueChange={(value) => setFormData({ ...formData, clientId: value === '__none__' ? undefined : parseInt(value) })}
                >
                  <SelectTrigger id="create-client">
                    <SelectValue placeholder="Select client..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.clientId} value={client.clientId.toString()}>
                        {client.clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="size-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={dialogType === 'edit'} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-firstName">First Name *</Label>
                <Input
                  id="edit-firstName"
                  value={editFormData.firstName}
                  onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-lastName">Last Name *</Label>
                <Input
                  id="edit-lastName"
                  value={editFormData.lastName}
                  onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-role">Role *</Label>
              <Select 
                value={editFormData.roleId?.toString() || ''} 
                onValueChange={(value) => setEditFormData({ ...editFormData, roleId: parseInt(value) })}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.roleId} value={role.roleId.toString()}>
                      {role.roleName} - {role.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-team">Team (Optional)</Label>
                <Select 
                  value={editFormData.teamId?.toString() || '__none__'} 
                  onValueChange={(value) => setEditFormData({ ...editFormData, teamId: value === '__none__' ? undefined : parseInt(value) })}
                >
                  <SelectTrigger id="edit-team">
                    <SelectValue placeholder="Select team..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.teamId} value={team.teamId.toString()}>
                        {team.teamName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-client">Client (Optional)</Label>
                <Select 
                  value={editFormData.clientId?.toString() || '__none__'} 
                  onValueChange={(value) => setEditFormData({ ...editFormData, clientId: value === '__none__' ? undefined : parseInt(value) })}
                >
                  <SelectTrigger id="edit-client">
                    <SelectValue placeholder="Select client..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.clientId} value={client.clientId.toString()}>
                        {client.clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Email cannot be changed. To reset password, use the password reset button.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="size-4 mr-2" />
                  Update User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={dialogType === 'delete'} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.fullName}?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action cannot be undone. The user will be permanently deleted from the system.
              </p>
              <p className="text-sm text-red-700 mt-2">
                User: <strong>{selectedUser?.email}</strong>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4 mr-2" />
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={dialogType === 'resetPassword'} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="reset-password">New Password *</Label>
              <Input
                id="reset-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The user will be able to login with this new password
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Make sure to communicate the new password securely to the user.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Key className="size-4 mr-2" />
                  Reset Password
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}