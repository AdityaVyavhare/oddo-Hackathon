import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import Reveal from "../components/Reveal";
import { mockUsers } from "../data/users";
import useStore from "../store/useStore";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/userService";
import styles from "./Profile.module.css";

const Profile = () => {
  const { currentUser, setCurrentUser } = useStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    city: "",
    country: "",
    preferredLanguage: "en",
    avatar: null,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getProfile();
        if (response.success) {
          const user = response.data.user;
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            bio: user.bio || "",
            city: user.city || "",
            country: user.country || "",
            preferredLanguage: user.preferredLanguage || "en",
            avatar: null,
          });
          setAvatarPreview(user.profilePicture || null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        // Use mock user data as fallback
        const mockUser = mockUsers[0];
        setFormData({
          firstName: mockUser.name?.split(" ")[0] || "John",
          lastName: mockUser.name?.split(" ")[1] || "Doe",
          email: mockUser.email || "user@example.com",
          phoneNumber: "+1 (555) 123-4567",
          bio: "Travel enthusiast exploring the world one city at a time.",
          city: "San Francisco",
          country: "United States",
          preferredLanguage: "en",
          avatar: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const profileData = new FormData();
      profileData.append("firstName", formData.firstName);
      profileData.append("lastName", formData.lastName);
      profileData.append("email", formData.email);
      profileData.append("phoneNumber", formData.phoneNumber);
      profileData.append("bio", formData.bio);
      profileData.append("city", formData.city);
      profileData.append("country", formData.country);
      profileData.append("preferredLanguage", formData.preferredLanguage);

      if (formData.avatar) {
        profileData.append("profilePicture", formData.avatar);
      }

      const response = await updateProfile(profileData);

      if (response.success) {
        setCurrentUser(response.data.user);
        setIsEditing(false);
        setSuccess("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setIsSaving(true);

    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsChangingPassword(false);
        setSuccess("Password changed successfully!");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.message || "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert("Account deletion is not implemented in this demo.");
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <Reveal animation="fade">
          <h1 className={styles.title}>Profile Settings</h1>
        </Reveal>

        {error && (
          <div
            style={{
              padding: "var(--space-md)",
              backgroundColor: "var(--error)",
              color: "white",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-lg)",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "var(--space-md)",
              backgroundColor: "var(--success)",
              color: "white",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-lg)",
            }}
          >
            {success}
          </div>
        )}

        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-2xl)",
              color: "var(--text-secondary)",
            }}
          >
            Loading profile...
          </div>
        ) : (
          <Reveal animation="up" delay={0.1}>
            <div className={styles.profileCard}>
              {/* Avatar Section */}
              <div className={styles.avatarSection}>
                <div className={styles.avatarContainer}>
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {formData.firstName?.charAt(0)?.toUpperCase() || "U"}
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
                  <h2 className={styles.userName}>
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className={styles.userEmail}>{formData.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName" className={styles.formLabel}>
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.formLabel}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
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
                  <label htmlFor="phoneNumber" className={styles.formLabel}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="bio" className={styles.formLabel}>
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="city" className={styles.formLabel}>
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="country" className={styles.formLabel}>
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label
                    htmlFor="preferredLanguage"
                    className={styles.formLabel}
                  >
                    Preferred Language
                  </label>
                  <select
                    id="preferredLanguage"
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
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
                    <button
                      onClick={handleSave}
                      className={styles.saveButton}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setError("");
                        setSuccess("");
                      }}
                      className={styles.cancelButton}
                      disabled={isSaving}
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

              {/* Password Change Section */}
              <div className={`${styles.sectionDivider}`}>
                <h3 className={styles.sectionTitle}>Change Password</h3>
                {!isChangingPassword ? (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className={styles.editButton}
                  >
                    Change Password
                  </button>
                ) : (
                  <div className={styles.formSection}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.actionsSection}>
                      <button
                        onClick={handlePasswordUpdate}
                        className={styles.saveButton}
                        disabled={isSaving}
                      >
                        {isSaving ? "Updating..." : "Update Password"}
                      </button>
                      <button
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className={styles.cancelButton}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
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
          </Reveal>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;
