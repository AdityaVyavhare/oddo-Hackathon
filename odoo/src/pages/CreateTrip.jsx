import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Reveal from "../components/Reveal";
import useStore from "../store/useStore";
import { createTrip } from "../services/tripService";
import styles from "./CreateTrip.module.css";

const CreateTrip = () => {
  const navigate = useNavigate();
  const { currentUser } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    coverImage: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Create FormData for file upload
      const tripData = new FormData();
      tripData.append("name", formData.name);
      tripData.append("description", formData.description);
      tripData.append("startDate", formData.startDate);
      tripData.append("endDate", formData.endDate);

      if (formData.coverImage) {
        tripData.append("coverImage", formData.coverImage);
      }

      const response = await createTrip(tripData);

      if (response.success) {
        navigate(`/trip/${response.data.trip.id}/itinerary`);
      }
    } catch (err) {
      console.error("Error creating trip:", err);
      setError(err.message || "Failed to create trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <Reveal animation="fade">
          <h1 className={styles.title}>Create New Trip</h1>
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

        <Reveal animation="up" delay={0.1}>
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
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className={styles.imagePreview}
                />
              )}
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={`${styles.button} ${styles.buttonPrimary}`}
                disabled={isLoading}
              >
                {isLoading ? "Creating Trip..." : "Create Trip"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/my-trips")}
                className={`${styles.button} ${styles.buttonSecondary}`}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </MainLayout>
  );
};

export default CreateTrip;
