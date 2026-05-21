import { useCallback, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import ClassPage from './pages/ClassPage';
import StoryPage from './pages/StoryPage';
import SettingsPage from './pages/SettingsPage';
import {
  loadData,
  saveData,
  resetData,
  addStory,
  updateStory,
  deleteStory
} from './utils/storage';

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const handleAddStory = useCallback((classId, quarterId, storyData) => {
    setData((prev) => addStory(prev, classId, quarterId, storyData));
  }, []);

  const handleUpdateStory = useCallback(
    (classId, quarterId, storyId, updates) => {
      setData((prev) => updateStory(prev, classId, quarterId, storyId, updates));
    },
    []
  );

  const handleDeleteStory = useCallback((classId, quarterId, storyId) => {
    setData((prev) => deleteStory(prev, classId, quarterId, storyId));
  }, []);

  const handleReset = useCallback(() => {
    setData(resetData());
  }, []);

  const handleImport = useCallback((imported) => {
    saveData(imported);
    setData(imported);
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage data={data} />} />
        <Route
          path="/sinf/:classId"
          element={
            <ClassPage
              data={data}
              onAddStory={handleAddStory}
              onUpdateStory={handleUpdateStory}
              onDeleteStory={handleDeleteStory}
              showToast={showToast}
            />
          }
        />
        <Route
          path="/sinf/:classId/chorak/:quarterId/matn/:storyId"
          element={
            <StoryPage
              data={data}
              onUpdateStory={handleUpdateStory}
              onDeleteStory={handleDeleteStory}
              showToast={showToast}
            />
          }
        />
        <Route
          path="/sozlamalar"
          element={
            <SettingsPage
              data={data}
              onReset={handleReset}
              onImport={handleImport}
              showToast={showToast}
            />
          }
        />
      </Routes>
      <Footer />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </>
  );
}
