import { useState } from 'react';
import { FiBookOpen, FiUploadCloud, FiUserPlus, FiUsers } from 'react-icons/fi';

import DashboardCard from '../../components/DashboardCard';

function AdminDashboard({ users, onCreateUser, onUploadResource }) {
  const [userForm, setUserForm] = useState({ username: '', email: '', full_name: '', role: 'student', password: '' });
  const [uploadType, setUploadType] = useState('lectures');
  const [uploadForm, setUploadForm] = useState({ title: '', author: '', file: null, image: null });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Users" value={users.length} subtitle="All registered accounts" icon={FiUsers} />
        <DashboardCard title="Teachers" value={users.filter((item) => item.role === 'teacher').length} subtitle="Teacher accounts" icon={FiUserPlus} />
        <DashboardCard title="Students" value={users.filter((item) => item.role === 'student').length} subtitle="Student accounts" icon={FiBookOpen} />
        <DashboardCard title="Admins" value={users.filter((item) => item.role === 'admin').length} subtitle="Management accounts" icon={FiUploadCloud} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-[#0f172a]">User management</h3>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[#64748b]">
                <tr>
                  <th className="pb-3">Username</th>
                  <th className="pb-3">Full name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id} className="border-t border-[#e6edf7] text-[#334155]">
                    <td className="py-3">{item.username}</td>
                    <td className="py-3">{item.full_name}</td>
                    <td className="py-3">{item.email}</td>
                    <td className="py-3 capitalize">{item.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onCreateUser(userForm);
              setUserForm({ username: '', email: '', full_name: '', role: 'student', password: '' });
            }}
            className="mt-6 grid gap-3 md:grid-cols-2"
          >
            <input value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} placeholder="Username" className="input-shell" required />
            <input value={userForm.full_name} onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })} placeholder="Full name" className="input-shell" required />
            <input value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} type="email" placeholder="Email" className="input-shell" required />
            <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} className="input-shell">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            <input value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} type="password" placeholder="Password" className="input-shell md:col-span-2" required />
            <button type="submit" className="brand-primary md:col-span-2 rounded-2xl px-5 py-3 text-sm font-semibold">Create user</button>
          </form>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-[#0f172a]">Upload management</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.append('title', uploadForm.title);
              if (uploadType === 'books') {
                formData.append('author', uploadForm.author);
                if (uploadForm.image) formData.append('image', uploadForm.image);
              }
              if (uploadForm.file) formData.append('file', uploadForm.file);
              onUploadResource(uploadType, formData);
              setUploadForm({ title: '', author: '', file: null, image: null });
            }}
            className="mt-5 space-y-4"
          >
            <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} className="input-shell">
              <option value="lectures">Lecture upload</option>
              <option value="practicals">Practical upload</option>
              <option value="books">Book upload</option>
            </select>
            <input value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} placeholder="Title" className="input-shell" required />
            {uploadType === 'books' ? <input value={uploadForm.author} onChange={(e) => setUploadForm({ ...uploadForm, author: e.target.value })} placeholder="Author" className="input-shell" required /> : null}
            <input type="file" accept="application/pdf" onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })} className="w-full rounded-2xl border border-dashed border-[#dbe7f3] bg-[#f8fbff] px-4 py-4 text-sm text-[#334155]" required />
            {uploadType === 'books' ? <input type="file" accept="image/*" onChange={(e) => setUploadForm({ ...uploadForm, image: e.target.files?.[0] || null })} className="w-full rounded-2xl border border-dashed border-[#dbe7f3] bg-[#f8fbff] px-4 py-4 text-sm text-[#334155]" /> : null}
            <button type="submit" className="brand-primary w-full rounded-2xl px-5 py-3 text-sm font-semibold">Upload resource</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
