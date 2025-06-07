import React, { useState } from "react";
import { useMobilePlatform } from "@/hooks/useMobilePlatform";
import { useNavigate } from "react-router-dom";

const AuthReact: React.FC = () => {
  const mobile = useMobilePlatform();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    login: { email: "", password: "" },
    register: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "farmer",
      location: "",
      businessType: "",
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await mobile.triggerHaptic("medium");

    // Simulate API call
    setTimeout(async () => {
      await mobile.showToast("Welcome back!");
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await mobile.triggerHaptic("medium");

    // Simulate API call
    setTimeout(async () => {
      await mobile.showToast("Account created successfully!");
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const updateFormData = (
    tab: "login" | "register",
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], [field]: value },
    }));
  };

  return (
    <div
      css={{
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: "16px",
        color: "rgb(2, 8, 23)",
        background:
          "linear-gradient(to right bottom, rgb(240, 253, 244), rgb(239, 246, 255))",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <header
        css={{
          backgroundColor: "rgb(255, 255, 255)",
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
          position: "relative",
        }}
      >
        <div
          css={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          <button
            onClick={() => navigate("/")}
            css={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              color: "rgb(75, 85, 99)",
              cursor: "pointer",
              fontSize: "14px",
              padding: "8px",
              borderRadius: "6px",
              transition: "all 0.15s ease",
              ":hover": {
                backgroundColor: "rgb(249, 250, 251)",
                color: "rgb(17, 24, 39)",
              },
            }}
          >
            <svg
              css={{
                width: "16px",
                height: "16px",
                stroke: "currentColor",
                fill: "none",
              }}
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span>Back</span>
          </button>

          <div
            css={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              css={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "rgb(22, 163, 74)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                css={{
                  width: "16px",
                  height: "16px",
                  color: "rgb(255, 255, 255)",
                  stroke: "currentColor",
                  fill: "none",
                }}
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <span
              css={{
                fontWeight: "700",
                color: "rgb(17, 24, 39)",
                fontSize: "18px",
              }}
            >
              Bizzleap
            </span>
          </div>

          <div css={{ width: "64px" }}></div>
        </div>
      </header>

      {/* Main Content */}
      <main
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <div
          css={{
            width: "100%",
            maxWidth: "448px",
          }}
        >
          <div
            css={{
              backgroundColor: "rgb(255, 255, 255)",
              borderRadius: "12px",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
            }}
          >
            {/* Card Header */}
            <div
              css={{
                textAlign: "center",
                padding: "32px 24px 24px",
              }}
            >
              <h1
                css={{
                  color: "rgb(22, 163, 74)",
                  fontSize: "32px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Bizzleap
              </h1>
              <p
                css={{
                  color: "rgb(107, 114, 128)",
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                {activeTab === "login"
                  ? "Welcome back! Please sign in to your account."
                  : "Join our community of farmers and entrepreneurs."}
              </p>
            </div>

            {/* Card Content */}
            <div css={{ padding: "0 24px 32px" }}>
              {/* Tab Navigation */}
              <div
                css={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  backgroundColor: "rgb(243, 244, 246)",
                  borderRadius: "8px",
                  padding: "4px",
                  marginBottom: "24px",
                }}
              >
                {["login", "register"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    css={{
                      background: "none",
                      border: "none",
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color:
                        activeTab === tab
                          ? "rgb(17, 24, 39)"
                          : "rgb(107, 114, 128)",
                      cursor: "pointer",
                      borderRadius: "6px",
                      transition: "all 0.15s ease",
                      backgroundColor:
                        activeTab === tab
                          ? "rgb(255, 255, 255)"
                          : "transparent",
                      boxShadow:
                        activeTab === tab
                          ? "0 1px 2px rgba(0, 0, 0, 0.05)"
                          : "none",
                    }}
                  >
                    {tab === "login" ? "Login" : "Sign Up"}
                  </button>
                ))}
              </div>

              {/* Login Form */}
              {activeTab === "login" && (
                <form
                  onSubmit={handleLogin}
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div
                    css={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label
                      css={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.login.email}
                      onChange={(e) =>
                        updateFormData("login", "email", e.target.value)
                      }
                      required
                      css={{
                        backgroundColor: "rgb(255, 255, 255)",
                        border: "1px solid rgb(209, 213, 219)",
                        borderRadius: "6px",
                        color: "rgb(17, 24, 39)",
                        fontSize: "14px",
                        lineHeight: "20px",
                        padding: "12px 16px",
                        transition: "all 0.15s ease",
                        ":focus": {
                          borderColor: "rgb(22, 163, 74)",
                          outline: "none",
                          boxShadow: "0 0 0 3px rgba(22, 163, 74, 0.1)",
                        },
                        "::placeholder": {
                          color: "rgb(156, 163, 175)",
                        },
                      }}
                    />
                  </div>

                  <div
                    css={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label
                      css={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={formData.login.password}
                      onChange={(e) =>
                        updateFormData("login", "password", e.target.value)
                      }
                      required
                      css={{
                        backgroundColor: "rgb(255, 255, 255)",
                        border: "1px solid rgb(209, 213, 219)",
                        borderRadius: "6px",
                        color: "rgb(17, 24, 39)",
                        fontSize: "14px",
                        lineHeight: "20px",
                        padding: "12px 16px",
                        transition: "all 0.15s ease",
                        ":focus": {
                          borderColor: "rgb(22, 163, 74)",
                          outline: "none",
                          boxShadow: "0 0 0 3px rgba(22, 163, 74, 0.1)",
                        },
                        "::placeholder": {
                          color: "rgb(156, 163, 175)",
                        },
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    css={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      backgroundColor: "rgb(22, 163, 74)",
                      border: "none",
                      borderRadius: "6px",
                      color: "rgb(255, 255, 255)",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      height: "44px",
                      marginTop: "8px",
                      padding: "0 16px",
                      transition: "all 0.15s ease",
                      width: "100%",
                      opacity: isLoading ? 0.7 : 1,
                      ":hover": !isLoading
                        ? {
                            backgroundColor: "rgb(21, 128, 61)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 8px rgba(22, 163, 74, 0.3)",
                          }
                        : {},
                      ":disabled": {
                        cursor: "not-allowed",
                        transform: "none",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {isLoading && (
                      <div
                        css={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgb(255, 255, 255)",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    )}
                    <span>{isLoading ? "Signing In..." : "Sign In"}</span>
                  </button>
                </form>
              )}

              {/* Register Form */}
              {activeTab === "register" && (
                <form
                  onSubmit={handleRegister}
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div
                    css={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label
                      css={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.register.name}
                      onChange={(e) =>
                        updateFormData("register", "name", e.target.value)
                      }
                      required
                      css={{
                        backgroundColor: "rgb(255, 255, 255)",
                        border: "1px solid rgb(209, 213, 219)",
                        borderRadius: "6px",
                        color: "rgb(17, 24, 39)",
                        fontSize: "14px",
                        lineHeight: "20px",
                        padding: "12px 16px",
                        transition: "all 0.15s ease",
                        ":focus": {
                          borderColor: "rgb(22, 163, 74)",
                          outline: "none",
                          boxShadow: "0 0 0 3px rgba(22, 163, 74, 0.1)",
                        },
                        "::placeholder": {
                          color: "rgb(156, 163, 175)",
                        },
                      }}
                    />
                  </div>

                  <div
                    css={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label
                      css={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.register.email}
                      onChange={(e) =>
                        updateFormData("register", "email", e.target.value)
                      }
                      required
                      css={{
                        backgroundColor: "rgb(255, 255, 255)",
                        border: "1px solid rgb(209, 213, 219)",
                        borderRadius: "6px",
                        color: "rgb(17, 24, 39)",
                        fontSize: "14px",
                        lineHeight: "20px",
                        padding: "12px 16px",
                        transition: "all 0.15s ease",
                        ":focus": {
                          borderColor: "rgb(22, 163, 74)",
                          outline: "none",
                          boxShadow: "0 0 0 3px rgba(22, 163, 74, 0.1)",
                        },
                        "::placeholder": {
                          color: "rgb(156, 163, 175)",
                        },
                      }}
                    />
                  </div>

                  <div
                    css={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label
                      css={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      I am a:
                    </label>
                    <div
                      css={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {[
                        { value: "farmer", label: "Farmer" },
                        {
                          value: "business_owner",
                          label: "Small Business Owner",
                        },
                        { value: "buyer", label: "Buyer" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          css={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer",
                            padding: "8px",
                            borderRadius: "6px",
                            transition: "background-color 0.15s ease",
                            ":hover": {
                              backgroundColor: "rgb(249, 250, 251)",
                            },
                          }}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={option.value}
                            checked={formData.register.role === option.value}
                            onChange={(e) =>
                              updateFormData("register", "role", e.target.value)
                            }
                            css={{ display: "none" }}
                          />
                          <div
                            css={{
                              position: "relative",
                              width: "16px",
                              height: "16px",
                              border: "2px solid rgb(209, 213, 219)",
                              borderRadius: "50%",
                              backgroundColor: "rgb(255, 255, 255)",
                              transition: "all 0.15s ease",
                              ...(formData.register.role === option.value && {
                                borderColor: "rgb(22, 163, 74)",
                                backgroundColor: "rgb(22, 163, 74)",
                                "::after": {
                                  content: '""',
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  width: "6px",
                                  height: "6px",
                                  backgroundColor: "rgb(255, 255, 255)",
                                  borderRadius: "50%",
                                  transform: "translate(-50%, -50%)",
                                },
                              }),
                            }}
                          />
                          <span
                            css={{
                              fontSize: "14px",
                              color: "rgb(17, 24, 39)",
                              fontWeight: "500",
                            }}
                          >
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div
                    css={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label
                      css={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="City, Country"
                      value={formData.register.location}
                      onChange={(e) =>
                        updateFormData("register", "location", e.target.value)
                      }
                      required
                      css={{
                        backgroundColor: "rgb(255, 255, 255)",
                        border: "1px solid rgb(209, 213, 219)",
                        borderRadius: "6px",
                        color: "rgb(17, 24, 39)",
                        fontSize: "14px",
                        lineHeight: "20px",
                        padding: "12px 16px",
                        transition: "all 0.15s ease",
                        ":focus": {
                          borderColor: "rgb(22, 163, 74)",
                          outline: "none",
                          boxShadow: "0 0 0 3px rgba(22, 163, 74, 0.1)",
                        },
                        "::placeholder": {
                          color: "rgb(156, 163, 175)",
                        },
                      }}
                    />
                  </div>

                  <div
                    css={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label
                      css={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Create a password"
                      value={formData.register.password}
                      onChange={(e) =>
                        updateFormData("register", "password", e.target.value)
                      }
                      required
                      css={{
                        backgroundColor: "rgb(255, 255, 255)",
                        border: "1px solid rgb(209, 213, 219)",
                        borderRadius: "6px",
                        color: "rgb(17, 24, 39)",
                        fontSize: "14px",
                        lineHeight: "20px",
                        padding: "12px 16px",
                        transition: "all 0.15s ease",
                        ":focus": {
                          borderColor: "rgb(22, 163, 74)",
                          outline: "none",
                          boxShadow: "0 0 0 3px rgba(22, 163, 74, 0.1)",
                        },
                        "::placeholder": {
                          color: "rgb(156, 163, 175)",
                        },
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    css={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      backgroundColor: "rgb(22, 163, 74)",
                      border: "none",
                      borderRadius: "6px",
                      color: "rgb(255, 255, 255)",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      height: "44px",
                      marginTop: "8px",
                      padding: "0 16px",
                      transition: "all 0.15s ease",
                      width: "100%",
                      opacity: isLoading ? 0.7 : 1,
                      ":hover": !isLoading
                        ? {
                            backgroundColor: "rgb(21, 128, 61)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 8px rgba(22, 163, 74, 0.3)",
                          }
                        : {},
                      ":disabled": {
                        cursor: "not-allowed",
                        transform: "none",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {isLoading && (
                      <div
                        css={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgb(255, 255, 255)",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    )}
                    <span>
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthReact;
