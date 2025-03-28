import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Main_container_head from '../components/Main_container_head';
import Layout from '../components/Layout';

// Composant principal de gestion des utilisateurs
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  // Charger les utilisateurs
  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users',{ withCredentials: true });
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (err) {
      setError('Impossible de charger les utilisateurs');
    }
  };

  // Composant pour la modal de gestion des permissions
  const PermissionsModal = ({ user, onClose, onUpdate }) => {
    const [permissions, setPermissions] = useState({
      can_view: false,
      can_edit: false,
      can_manage: false
    });

    useEffect(() => {
      // Charger les permissions actuelles de l'utilisateur
      const fetchUserPermissions = async () => {
        try {
          const response = await axios.get(`/api/users/${user.id}/permissions`,{ withCredentials: true });
          setPermissions(response.data);
        } catch (err) {
          setError('Impossible de charger les permissions');
        }
      };

      fetchUserPermissions();
    }, [user.id]);

    const handlePermissionChange = (permission) => {
      setPermissions(prev => ({
        ...prev,
        [permission]: !prev[permission]
      }));
    };

    const savePermissions = async () => {
      try {
        await axios.put(`/api/users/${user.id}/permissions`, permissions,{ withCredentials: true });
        onUpdate();
        onClose();
      } catch (err) {
        setError('Erreur lors de la mise à jour des permissions');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
          <h2 className="text-xl font-bold mb-4">Permissions pour {user.name_user}</h2>
          
          <div className="space-y-4">
            <PermissionCheckbox 
              label="Peut Voir" 
              checked={permissions.can_view}
              onChange={() => handlePermissionChange('can_view')}
            />
            <PermissionCheckbox 
              label="Peut Éditer" 
              checked={permissions.can_edit}
              onChange={() => handlePermissionChange('can_edit')}
            />
            <PermissionCheckbox 
              label="Peut Gérer" 
              checked={permissions.can_manage}
              onChange={() => handlePermissionChange('can_manage')}
            />
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
            <button 
              onClick={savePermissions} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Composant de case à cocher personnalisée
  const PermissionCheckbox = ({ label, checked, onChange }) => (
    <div className="flex items-center">
      <input 
        type="checkbox" 
        checked={checked}
        onChange={onChange}
        className="mr-2 h-4 w-4"
      />
      <span>{label}</span>
    </div>
  );

  // Composant principal de la liste des utilisateurs
  return (
    <Layout> 
      <Main_container_head text="Gestion des Utilisateurs" />
      {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    )}

    <table className="w-full bg-white shadow-md rounded">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-3 text-left">Nom d'Utilisateur</th>
          <th className="p-3 text-left">Rôle</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className="border-b hover:bg-gray-100">
            <td className="p-3">{user.name_user}</td>
            <td className="p-3">{user.role}</td>
            <td className="p-3 text-center">
              <button 
                onClick={() => setSelectedUser(user)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Gérer Permissions
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {selectedUser && (
      <PermissionsModal 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)}
        onUpdate={fetchUsers}
      />
    )}</Layout>
     );
};

export default UserManagement;