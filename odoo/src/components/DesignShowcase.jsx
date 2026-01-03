import { useState } from "react";
import { Palette, Type, Layout, Zap, Moon, Sun, Check } from "lucide-react";
import styles from "./DesignShowcase.module.css";

/**
 * Design System Showcase Component
 * Demonstrates the premium GlobeTrotter design system
 */
const DesignShowcase = () => {
  const [activeTab, setActiveTab] = useState("colors");

  const colors = [
    { name: "Primary Blue", var: "--color-primary", hex: "#4A7DB0" },
    { name: "Teal Accent", var: "--color-accent", hex: "#2A9D8F" },
    { name: "Sunset Orange", var: "--color-cta", hex: "#F4A261" },
  ];

  const spacing = [
    { name: "xs", value: "4px" },
    { name: "sm", value: "8px" },
    { name: "md", value: "16px" },
    { name: "lg", value: "24px" },
    { name: "xl", value: "32px" },
    { name: "2xl", value: "48px" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Palette size={32} />
          GlobeTrotter Design System
        </h1>
        <p className={styles.subtitle}>
          Premium Blue-Teal Theme with Light & Dark Modes
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "colors" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("colors")}
        >
          <Palette size={18} />
          Colors
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "typography" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("typography")}
        >
          <Type size={18} />
          Typography
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "components" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("components")}
        >
          <Layout size={18} />
          Components
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "effects" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("effects")}
        >
          <Zap size={18} />
          Effects
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === "colors" && (
          <div className={styles.section}>
            <h2>Brand Colors</h2>
            <div className={styles.colorGrid}>
              {colors.map((color) => (
                <div key={color.name} className={styles.colorCard}>
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className={styles.colorInfo}>
                    <h3>{color.name}</h3>
                    <code>{color.hex}</code>
                    <code>{color.var}</code>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{ marginTop: "var(--space-2xl)" }}>Gradients</h2>
            <div className={styles.gradientGrid}>
              <div className={styles.gradientCard}>
                <div
                  className={`${styles.gradientSwatch} ${styles.primaryGradient}`}
                />
                <p>Primary Gradient</p>
              </div>
              <div className={styles.gradientCard}>
                <div
                  className={`${styles.gradientSwatch} ${styles.heroGradient}`}
                />
                <p>Hero Gradient</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "typography" && (
          <div className={styles.section}>
            <h1>Heading 1 - Poppins Bold</h1>
            <h2>Heading 2 - Poppins Semibold</h2>
            <h3>Heading 3 - Poppins Semibold</h3>
            <h4>Heading 4 - Poppins Medium</h4>
            <p
              style={{
                fontSize: "var(--font-size-lg)",
                marginTop: "var(--space-xl)",
              }}
            >
              Large body text - Inter Regular. The quick brown fox jumps over
              the lazy dog.
            </p>
            <p style={{ marginTop: "var(--space-md)" }}>
              Body text - Inter Regular. Designed for readability and clarity
              across devices.
            </p>
            <p
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--text-secondary)",
                marginTop: "var(--space-md)",
              }}
            >
              Small text - Inter Regular. Used for captions and secondary
              information.
            </p>
          </div>
        )}

        {activeTab === "components" && (
          <div className={styles.section}>
            <h2>Buttons</h2>
            <div className={styles.buttonGrid}>
              <button className="btn-primary">Primary Button</button>
              <button className="btn-cta">CTA Button</button>
              <button className="btn-secondary">Secondary Button</button>
              <button className={`${styles.btnGhost} btn-ghost`}>
                Ghost Button
              </button>
            </div>

            <h2 style={{ marginTop: "var(--space-2xl)" }}>Cards</h2>
            <div className={styles.cardGrid}>
              <div className="premium-card">
                <h3>Premium Card</h3>
                <p>With shadow and hover effect</p>
              </div>
              <div className={`premium-card ${styles.glassCard}`}>
                <h3>Glass Effect</h3>
                <p>Frosted glass appearance</p>
              </div>
            </div>

            <h2 style={{ marginTop: "var(--space-2xl)" }}>Form Elements</h2>
            <div className={styles.formDemo}>
              <input type="text" placeholder="Text input" />
              <input type="email" placeholder="Email input" />
              <textarea placeholder="Textarea" rows={3} />
            </div>
          </div>
        )}

        {activeTab === "effects" && (
          <div className={styles.section}>
            <h2>Animations</h2>
            <div className={styles.effectsGrid}>
              <div className={`${styles.effectCard} ${styles.floatingCard}`}>
                <Zap size={32} />
                <p>Float Animation</p>
              </div>
              <div className={`${styles.effectCard} ${styles.pulseCard}`}>
                <Check size={32} />
                <p>Pulse Effect</p>
              </div>
              <div className={`${styles.effectCard} shimmer`}>
                <Palette size={32} />
                <p>Shimmer Effect</p>
              </div>
            </div>

            <h2 style={{ marginTop: "var(--space-2xl)" }}>Spacing Scale</h2>
            <div className={styles.spacingDemo}>
              {spacing.map((space) => (
                <div key={space.name} className={styles.spacingItem}>
                  <div
                    className={styles.spacingBar}
                    style={{ width: space.value }}
                  />
                  <span>
                    {space.name}: {space.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>
          <strong>GlobeTrotter Design System</strong> - Built for premium travel
          planning experiences
        </p>
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--text-tertiary)",
          }}
        >
          Toggle between light and dark modes to see the full color palette
        </p>
      </div>
    </div>
  );
};

export default DesignShowcase;
