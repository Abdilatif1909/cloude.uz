import { useEffect, useMemo, useState } from 'react';

import Sidebar from '../../components/Sidebar';
import SectionHeading from '../../components/shared/SectionHeading';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { contentService } from '../../services/contentService';
import { testService } from '../../services/testService';
import { downloadStorage } from '../../utils/storage';
import { normalizePaginated } from '../../utils/format';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';

function DashboardPage() {
  const { user, updateProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentResults, setStudentResults] = useState([]);
  const [teacherResults, setTeacherResults] = useState([]);
  const [tests, setTests] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (user?.role === 'student') {
          const results = await testService.getResults();
          setStudentResults(normalizePaginated(results));
        }

        if (user?.role === 'teacher') {
          const [teacherData, testsData] = await Promise.all([testService.getTeacherResults(), testService.getTests()]);
          setTeacherResults(teacherData);
          setTests(normalizePaginated(testsData));
        }

        if (user?.role === 'admin') {
          const usersData = await authService.getUsers();
          setUsers(normalizePaginated(usersData));
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const downloads = useMemo(() => downloadStorage.getDownloads(), []);

  const handleCreateUser = async (payload) => {
    await authService.createUser(payload);
    const data = await authService.getUsers();
    setUsers(normalizePaginated(data));
  };

  const handleUploadResource = async (type, formData) => {
    if (type === 'lectures') await contentService.uploadLecture(formData);
    if (type === 'practicals') await contentService.uploadPractical(formData);
    if (type === 'books') await contentService.uploadBook(formData);
  };

  const renderDashboard = () => {
    if (user?.role === 'teacher') return <TeacherDashboard tests={tests.filter((item) => item.created_by === user.id || item.created_by_name === user.full_name)} results={teacherResults} />;
    if (user?.role === 'admin') return <AdminDashboard users={users} onCreateUser={handleCreateUser} onUploadResource={handleUploadResource} />;
    return <StudentDashboard profile={user} results={studentResults} downloads={downloads} onSaveProfile={async (payload) => {
      await updateProfile(payload);
      await refreshProfile();
    }} />;
  };

  return (
    <section className="container-shell py-10">
      <SectionHeading
        eyebrow="Dashboard"
        title={`${user?.full_name || user?.username || 'User'} uchun shaxsiy kabinet`}
        description="Student, teacher va admin uchun alohida boshqaruv tajribasi, analytics va management interfeysi."
      />
      <div className="mt-8 grid gap-8 xl:grid-cols-[280px_1fr]">
        <Sidebar role={user?.role || 'student'} />
        <div>{loading ? <div className="glass-panel rounded-3xl p-8">Dashboard yuklanmoqda...</div> : renderDashboard()}</div>
      </div>
    </section>
  );
}

export default DashboardPage;
