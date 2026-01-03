import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import useStore from '../store/useStore';
import styles from './CreateTrip.module.css';

const CreateTrip = () => {
  const navigate = useNavigate();
  const { currentUser, addTrip } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTrip = {
      id: Date.now().toString(),
      userId: currentUser?.id,
      ...formData,
      cities: [],
      budget: {
        total: 0,
        transport: 0,
        stay: 0,
        food: 0,
        activities: 0,
      },
      isPublic: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addTrip(newTrip);
    navigate(`/trip/${newTrip.id}/itinerary`);
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Create New Trip</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Trip Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="e.g., European Adventure"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={styles.textarea}
              placeholder="Tell us about your trip..."
            />
          </div>

          <div className={styles.dateGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate" className={styles.label}>
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate" className={styles.label}>
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="coverImage" className={styles.label}>
              Cover Image
            </label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.input}
            />
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Cover preview"
                className={styles.imagePreview}
              />
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
              Create Trip
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-trips')}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateTrip;

