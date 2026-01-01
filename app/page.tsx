"use client";

import { useState, useEffect } from "react";
import styles from "./Home.module.css";

import { QRCodeCanvas } from "qrcode.react";

type ExcuseResponse = {
  excuse: string;
  type: "classic" | "ai";
  error?: string;
};

export default function Home() {
  const [excuse, setExcuse] = useState<string>("Click generate for a rejection.");
  const [isAiMode, setIsAiMode] = useState<boolean>(false);
  const [inputContext, setInputContext] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedStyle, setSelectedStyle] = useState<string>("Humorous");
  const [language, setLanguage] = useState<string>("English");

  // Output Options State
  const [format, setFormat] = useState<string>("text");
  const [useEmoji, setUseEmoji] = useState<boolean>(false);
  const [memeMode, setMemeMode] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);

  // Model Manager State
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [provider, setProvider] = useState<string>("google");
  const [model, setModel] = useState<string>("gemini-2.0-flash");
  const [apiKey, setApiKey] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<Record<string, string[]>>({});

  // Integrations State
  const [slackWebhook, setSlackWebhook] = useState<string>("");

  useEffect(() => {
    // Load Slack webhook from local storage
    const savedWebhook = localStorage.getItem("slackWebhook");
    if (savedWebhook) setSlackWebhook(savedWebhook);
  }, []);

  useEffect(() => {
    // Save Slack webhook to local storage
    if (slackWebhook) {
      localStorage.setItem("slackWebhook", slackWebhook);
    }
  }, [slackWebhook]);

  const sendToSlack = async () => {
    if (!slackWebhook) {
      alert("Please configure your Slack Webhook in settings first.");
      setShowSettings(true);
      return;
    }
    if (!excuse || excuse.startsWith("Click generate") || excuse.startsWith("Error")) {
      alert("Please generate a valid rejection first.");
      return;
    }

    try {
      const res = await fetch("/api/slack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: slackWebhook, message: excuse }),
      });

      if (res.ok) {
        alert("Sent to Slack successfully!");
      } else {
        const err = await res.json();
        alert("Failed to send to Slack: " + (err.error || "Unknown error"));
      }
    } catch (e) {
      alert("Failed to send to Slack.");
      console.error(e);
    }
  };

  useEffect(() => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => setAvailableModels(data))
      .catch((err) => console.error("Failed to fetch models", err));
  }, []);

  const stylesList = [
    { id: "Humorous", icon: "😂", label: "Humorous" },
    { id: "Professional", icon: "💼", label: "Professional" },
    { id: "Poetic", icon: "🎭", label: "Poetic" },
    { id: "Passive-Aggressive", icon: "😏", label: "Passive-Aggressive" },
    { id: "Philosophical", icon: "🤔", label: "Philosophical" },
    { id: "Gen-Z", icon: "💀", label: "Gen-Z" },
    { id: "Medieval", icon: "⚔️", label: "Medieval" },
    { id: "Corporate Buzzword", icon: "📊", label: "Corporate Buzzword" },
    { id: "British Humor", icon: "🇬🇧", label: "British Humor" },
    { id: "American Humor", icon: "🇺🇸", label: "American Humor" },
  ];

  const languages = ["English", "Spanish", "French", "German", "Hindi", "Japanese", "Chinese", "Italian", "Tamil"];
  const formats = ["text", "html", "markdown", "slack", "discord"];

  const fetchExcuse = async () => {
    setLoading(true);
    setShowQr(false); // Hide QR when generating new
    try {
      const options: RequestInit = {
        method: isAiMode ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: isAiMode ? JSON.stringify({
          context: inputContext,
          style: selectedStyle,
          provider,
          model,
          apiKey: apiKey || undefined,
          language,
          format,
          emoji: useEmoji,
          meme: memeMode
        }) : undefined,
      };

      const url = isAiMode ? "/api/no" : `/api/no?language=${language}`;
      const res = await fetch(url, options);
      const data: ExcuseResponse = await res.json();

      if (data.error) {
        setExcuse("Error: " + data.error);
      } else {
        setExcuse(data.excuse);
      }
    } catch (error) {
      setExcuse("Something went wrong. Just say No.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(excuse);
    // Could add a toast here
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.branding}>
          <h1 className={styles.logo}>NO.</h1>
          <span className={styles.serviceName}>as a Service</span>
        </div>
        <button className={styles.settingsButton} onClick={() => setShowSettings(true)}>
          <span>⚙️</span>
          <span className={styles.settingsLabel}>Settings</span>
        </button>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.card}>
          {showSettings && (
            <div className={styles.modalOverlay} onClick={(e) => {
              if (e.target === e.currentTarget) setShowSettings(false);
            }}>
              <div className={styles.modal}>
                <h2 className={styles.modalTitle}>AI Model Settings</h2>

                <div className={styles.modalSection}>
                  <label className={styles.modalLabel}>Provider</label>
                  <select
                    className={styles.select}
                    value={provider}
                    onChange={(e) => {
                      setProvider(e.target.value);
                      if (availableModels[e.target.value]) {
                        setModel(availableModels[e.target.value][0]);
                      }
                    }}
                  >
                    <option value="google">Google Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="ollama">Ollama (Local)</option>
                  </select>
                </div>

                <div className={styles.modalSection}>
                  <label className={styles.modalLabel}>Model</label>
                  <select
                    className={styles.select}
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  >
                    {availableModels[provider]?.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    )) || <option value={model}>{model}</option>}
                  </select>
                </div>

                {provider === "openai" && (
                  <div className={styles.modalSection}>
                    <label className={styles.modalLabel}>API Key</label>
                    <input
                      type="password"
                      className={styles.input}
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                )}

                <div className={styles.modalSection}>
                  <label className={styles.modalLabel}>Slack Integration</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="Slack Webhook URL"
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                  />
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>Your webhook is stored locally in your browser.</p>
                </div>

                <button className={styles.closeButton} onClick={() => setShowSettings(false)}>
                  Save & Close
                </button>
              </div>
            </div>
          )}

          {/* Title removed from here, now in header */}
          {/* <h1 className={styles.title}>NO.</h1> */}

          <div className={styles.toggle}>
            <span className={styles.label} style={{ opacity: !isAiMode ? 1 : 0.5 }}>Classic</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isAiMode}
                onChange={() => setIsAiMode(!isAiMode)}
              />
              <span className={styles.slider}></span>
            </label>
            <span className={styles.label} style={{ opacity: isAiMode ? 1 : 0.5 }}>AI Enhanced</span>
          </div>

          <div className={styles.styleSection}>
            <h3 className={styles.sectionTitle}>Language</h3>
            <select
              className={styles.cardSelect}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ marginBottom: '1rem' }}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {isAiMode && (
            <>
              <input
                type="text"
                className={styles.input}
                placeholder="What are you rejecting? (e.g., 'A date with my ex')"
                value={inputContext}
                onChange={(e) => setInputContext(e.target.value)}
              />


              {/* Output Options */}

              {/* Output Options */}
              <div className={styles.styleSection}>
                <h3 className={styles.sectionTitle}>Format & Options</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <select
                    className={styles.cardSelect}
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    style={{ flex: 1, minWidth: '120px' }}
                  >
                    {formats.map(f => (
                      <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                    ))}
                  </select>

                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" checked={useEmoji} onChange={(e) => setUseEmoji(e.target.checked)} />
                    <span>Emoji 🎨</span>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" checked={memeMode} onChange={(e) => setMemeMode(e.target.checked)} />
                    <span>Meme Mode 🐸</span>
                  </label>
                </div>
              </div>

              <div className={styles.styleSection}>
                <h3 className={styles.sectionTitle}>Rejection Style</h3>
                <div className={styles.styleGrid}>
                  {stylesList.map((s) => (
                    <button
                      key={s.id}
                      className={`${styles.styleButton} ${selectedStyle === s.id ? styles.active : ""}`}
                      onClick={() => setSelectedStyle(s.id)}
                    >
                      <span>{s.icon}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className={`${styles.excuse} ${loading ? styles.loading : ""}`}>
            {format === 'html' || format === 'markdown' ? (
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}>{excuse}</pre>
            ) : (
              `"${excuse}"`
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={fetchExcuse}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Rejection"}
            </button>

            <button className={styles.button} onClick={copyToClipboard}>
              Copy Text
            </button>

            <button className={styles.button} onClick={sendToSlack}>
              Run Slack Work
            </button>

            <button className={`${styles.button} ${showQr ? styles.active : ""}`} onClick={() => setShowQr(!showQr)}>
              {showQr ? "Hide QR" : "Show QR"}
            </button>
          </div>

          {showQr && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', background: 'white', padding: '1rem', borderRadius: '12px' }}>
              <QRCodeCanvas value={excuse} size={200} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Powered by Gemini 2.0 • No as a Service</p>
      </footer>
    </div>
  );
}
