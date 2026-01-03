import { useState } from 'react';
import { Camera } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useStore from '../store/useStore';
import styles from './Profile.module.css';

const Profile = () => {
  const { currentUser, setCurrentUser } = useStore();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    language: currentUser?.language || 'en',
    avatar: currentUser?.avatar || null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setCurrentUser({ ...currentUser, ...formData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion is not implemented in this demo.');
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Profile Settings</h1>

        <div className={styles.profileCard}>
          {/* Avatar Section */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Profile"
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {formData.name.charAt(0).toUpperCase()}
                </div>
              )}
              {isEditing && (
                <label className={styles.avatarUploadButton}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.avatarUploadInput}
                  />
                  <Camera size={18} />
                </label>
              )}
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{formData.name}</h2>
              <p className={styles.userEmail}>{formData.email}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="language" className={styles.formLabel}>
                Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                disabled={!isEditing}
                className={styles.formSelect}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionsSection}>
            {isEditing ? (
              <>
                <button onClick={handleSave} className={styles.saveButton}>
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: currentUser?.name || '',
                      email: currentUser?.email || '',
                      language: currentUser?.language || 'en',
                      avatar: currentUser?.avatar || null,
                    });
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Saved Destinations */}
          <div className={`${styles.sectionDivider} ${styles.savedDestinations}`}>
            <h3 className={styles.sectionTitle}>Saved Destinations</h3>
            <p className={styles.emptyDestinations}>No saved destinations yet.</p>
          </div>

          {/* Danger Zone */}
          <div className={`${styles.sectionDivider} ${styles.dangerZone}`}>
            <h3 className={styles.dangerTitle}>Danger Zone</h3>
            <button
              onClick={handleDeleteAccount}
              className={styles.deleteButton}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;

