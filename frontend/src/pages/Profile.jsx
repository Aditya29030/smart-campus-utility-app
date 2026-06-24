import React, { useState } from 'react';
import { Save } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    rollNumber: user?.rollNumber || '',
    department: user?.department || '',
    semester: user?.semester || '',
    phone: user?.phone || '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const { data } = await api.put('/users/profile', payload);
      updateUser(data);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'S';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-slate-800">My Profile</h2>
        <p className="text-sm text-slate-500">Manage your personal and academic details.</p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold text-white" style={{ backgroundColor: user?.avatarColor || '#6366f1' }}>
          {initials}
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-slate-800">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      {message && (
        <div className="rounded-lg bg-primary-50 px-4 py-2.5 text-sm text-primary-700">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-soft">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Full name</label>
          <input name="name" value={form.name} onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Roll number</label>
            <input name="rollNumber" value={form.rollNumber} onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Semester</label>
            <input type="number" min="1" max="12" name="semester" value={form.semester} onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Department</label>
          <input name="department" value={form.department} onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Phone number</label>
          <input name="phone" value={form.phone} onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">New password (optional)</label>
          <input type="password" name="password" value={form.password} onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
        </div>

        <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
