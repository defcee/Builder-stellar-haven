import React, { useState } from "react";
import { useMobilePlatform } from "@/hooks/useMobilePlatform";

const ProfileReact: React.FC = () => {
  const mobile = useMobilePlatform();
  const [currentTab, setCurrentTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data
  const user = {
    name: "John Farmer",
    email: "john@example.com",
    role: "farmer",
    location: "Nairobi, Kenya",
    businessType: "Organic Vegetables",
    bio: "Passionate farmer growing organic vegetables for the local community.",
    createdAt: new Date(),
  };

  const stats = {
    totalViews: 77,
    totalInquiries: 13,
    products: 2,
    avgRating: 4.8,
  };

  const reviews = [
    {
      id: "1",
      reviewer: "Sarah Johnson",
      rating: 5,
      comment:
        "Excellent quality produce! Always fresh and delivered on time. Highly recommended!",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      reviewer: "Mike Chen",
      rating: 4,
      comment:
        "Great communication and fair prices. Will definitely buy again.",
      createdAt: new Date(Date.now() - 172800000),
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        css={{
          width: "16px",
          height: "16px",
          color: index < rating ? "rgb(245, 158, 11)" : "rgb(209, 213, 219)",
          fill: "currentColor",
          stroke: "currentColor",
        }}
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ));
  };

  const handleLogout = async () => {
    await mobile.triggerHaptic("medium");
    await mobile.showToast("Signed out successfully");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div
      css={{
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: "16px",
        color: "rgb(2, 8, 23)",
        backgroundColor: "rgb(249, 250, 251)",
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >
      {/* Header */}
      <header
        css={{
          backgroundColor: "rgb(255, 255, 255)",
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
          borderBottom: "1px solid rgb(229, 231, 235)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div css={{ padding: "16px" }}>
          <div
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1
              css={{
                color: "rgb(17, 24, 39)",
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: "28px",
              }}
            >
              Profile
            </h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              css={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "6px",
                transition: "background-color 0.15s ease",
                ":hover": {
                  backgroundColor: "rgb(249, 250, 251)",
                },
              }}
            >
              <svg
                css={{
                  width: "16px",
                  height: "16px",
                  color: "rgb(107, 114, 128)",
                  stroke: "currentColor",
                  fill: "none",
                }}
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main css={{ padding: "24px 16px" }}>
        {/* Tabs */}
        <div css={{ marginBottom: "24px" }}>
          <div
            css={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              backgroundColor: "rgb(243, 244, 246)",
              borderRadius: "8px",
              padding: "4px",
            }}
          >
            {["overview", "reviews", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                css={{
                  background: "none",
                  border: "none",
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color:
                    currentTab === tab
                      ? "rgb(17, 24, 39)"
                      : "rgb(107, 114, 128)",
                  cursor: "pointer",
                  borderRadius: "6px",
                  transition: "all 0.15s ease",
                  backgroundColor:
                    currentTab === tab ? "rgb(255, 255, 255)" : "transparent",
                  boxShadow:
                    currentTab === tab
                      ? "0 1px 2px rgba(0, 0, 0, 0.05)"
                      : "none",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {currentTab === "overview" && (
          <div css={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Profile Card */}
            <div
              css={{
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: "8px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
                border: "1px solid rgb(229, 231, 235)",
              }}
            >
              <div css={{ padding: "24px" }}>
                <div
                  css={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    css={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "rgb(22, 163, 74)",
                      color: "rgb(255, 255, 255)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: "700",
                      letterSpacing: "1px",
                      flexShrink: 0,
                    }}
                  >
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div css={{ flex: 1, minWidth: 0 }}>
                    <div css={{ marginBottom: "12px" }}>
                      <h2
                        css={{
                          color: "rgb(17, 24, 39)",
                          fontSize: "20px",
                          fontWeight: "700",
                          lineHeight: "28px",
                          marginBottom: "4px",
                        }}
                      >
                        {user.name}
                      </h2>
                      <div
                        css={{
                          display: "inline-block",
                          backgroundColor: "rgb(22, 163, 74)",
                          color: "rgb(255, 255, 255)",
                          fontSize: "12px",
                          fontWeight: "600",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          textTransform: "capitalize",
                        }}
                      >
                        {user.role.replace("_", " ")}
                      </div>
                    </div>
                    <p
                      css={{
                        color: "rgb(107, 114, 128)",
                        fontSize: "14px",
                        lineHeight: "20px",
                      }}
                    >
                      {user.bio}
                    </p>
                  </div>
                </div>

                <div
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    color: "rgb(107, 114, 128)",
                    fontSize: "14px",
                  }}
                >
                  <div
                    css={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      css={{
                        width: "16px",
                        height: "16px",
                        stroke: "currentColor",
                        fill: "none",
                        flexShrink: 0,
                      }}
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{user.location}</span>
                  </div>
                  <div
                    css={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      css={{
                        width: "16px",
                        height: "16px",
                        stroke: "currentColor",
                        fill: "none",
                        flexShrink: 0,
                      }}
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    <span>
                      Joined{" "}
                      {user.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Metrics */}
            <div
              css={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              {[
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ),
                  value: stats.totalViews,
                  label: "Total Views",
                  color: "rgb(37, 99, 235)",
                  bgColor: "rgb(219, 234, 254)",
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  ),
                  value: stats.totalInquiries,
                  label: "Inquiries",
                  color: "rgb(147, 51, 234)",
                  bgColor: "rgb(233, 213, 255)",
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                    </svg>
                  ),
                  value: stats.products,
                  label: "Products",
                  color: "rgb(22, 163, 74)",
                  bgColor: "rgb(220, 252, 231)",
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ),
                  value: stats.avgRating.toFixed(1),
                  label: "Avg Rating",
                  color: "rgb(245, 158, 11)",
                  bgColor: "rgb(254, 240, 138)",
                },
              ].map((metric, index) => (
                <div
                  key={index}
                  css={{
                    backgroundColor: "rgb(255, 255, 255)",
                    borderRadius: "8px",
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
                    border: "1px solid rgb(229, 231, 235)",
                  }}
                >
                  <div
                    css={{
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      css={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: metric.bgColor,
                        color: metric.color,
                        margin: "0 auto 8px",
                      }}
                    >
                      <div
                        css={{
                          width: "24px",
                          height: "24px",
                          stroke: "currentColor",
                          fill: "none",
                        }}
                      >
                        {metric.icon}
                      </div>
                    </div>
                    <p
                      css={{
                        color: "rgb(17, 24, 39)",
                        fontSize: "24px",
                        fontWeight: "700",
                        lineHeight: "32px",
                        marginBottom: "4px",
                      }}
                    >
                      {metric.value}
                    </p>
                    <p
                      css={{
                        color: "rgb(107, 114, 128)",
                        fontSize: "12px",
                        lineHeight: "16px",
                      }}
                    >
                      {metric.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === "reviews" && (
          <div css={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Review Overview */}
            <div
              css={{
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: "8px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
                border: "1px solid rgb(229, 231, 235)",
              }}
            >
              <div
                css={{
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <p
                  css={{
                    color: "rgb(17, 24, 39)",
                    fontSize: "48px",
                    fontWeight: "700",
                    lineHeight: 1,
                    marginBottom: "8px",
                  }}
                >
                  {stats.avgRating.toFixed(1)}
                </p>
                <div
                  css={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    marginBottom: "8px",
                  }}
                >
                  {renderStars(Math.floor(stats.avgRating))}
                </div>
                <p
                  css={{
                    color: "rgb(107, 114, 128)",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  Based on {reviews.length} reviews
                </p>
              </div>
            </div>

            {/* Reviews List */}
            <div
              css={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <h3
                css={{
                  color: "rgb(17, 24, 39)",
                  fontSize: "18px",
                  fontWeight: "600",
                  lineHeight: "28px",
                }}
              >
                All Reviews
              </h3>

              {reviews.map((review) => (
                <div
                  key={review.id}
                  css={{
                    backgroundColor: "rgb(255, 255, 255)",
                    borderRadius: "8px",
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
                    border: "1px solid rgb(229, 231, 235)",
                  }}
                >
                  <div css={{ padding: "16px" }}>
                    <div
                      css={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        css={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(22, 163, 74)",
                          color: "rgb(255, 255, 255)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "600",
                          flexShrink: 0,
                        }}
                      >
                        {review.reviewer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div css={{ flex: 1 }}>
                        <h4
                          css={{
                            color: "rgb(17, 24, 39)",
                            fontSize: "14px",
                            fontWeight: "500",
                            marginBottom: "2px",
                          }}
                        >
                          {review.reviewer}
                        </h4>
                        <span
                          css={{
                            color: "rgb(107, 114, 128)",
                            fontSize: "12px",
                            lineHeight: "16px",
                          }}
                        >
                          {review.createdAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div
                      css={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      {renderStars(review.rating)}
                      <span
                        css={{
                          color: "rgb(107, 114, 128)",
                          fontSize: "14px",
                        }}
                      >
                        ({review.rating}/5)
                      </span>
                    </div>

                    <p
                      css={{
                        color: "rgb(55, 65, 81)",
                        fontSize: "14px",
                        lineHeight: "20px",
                      }}
                    >
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === "settings" && (
          <div css={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              css={{
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: "8px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
                border: "1px solid rgb(229, 231, 235)",
              }}
            >
              <div
                css={{
                  padding: "20px 24px 16px",
                  borderBottom: "1px solid rgb(229, 231, 235)",
                }}
              >
                <h3
                  css={{
                    color: "rgb(17, 24, 39)",
                    fontSize: "18px",
                    fontWeight: "600",
                    lineHeight: "28px",
                  }}
                >
                  Account Settings
                </h3>
              </div>
              <div css={{ padding: "20px 24px" }}>
                <div
                  css={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {[
                    { label: "Notification Preferences", icon: "settings" },
                    { label: "Privacy Settings", icon: "settings" },
                    { label: "Account Security", icon: "lock" },
                  ].map((setting, index) => (
                    <button
                      key={index}
                      css={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "16px",
                        textAlign: "left",
                        transition: "background-color 0.15s ease",
                        borderBottom:
                          index < 2 ? "1px solid rgb(229, 231, 235)" : "none",
                        ":hover": {
                          backgroundColor: "rgb(249, 250, 251)",
                        },
                      }}
                    >
                      <svg
                        css={{
                          width: "20px",
                          height: "20px",
                          color: "rgb(107, 114, 128)",
                          stroke: "currentColor",
                          fill: "none",
                          flexShrink: 0,
                        }}
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        {setting.icon === "settings" ? (
                          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        ) : (
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                        )}
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span
                        css={{
                          flex: 1,
                          color: "rgb(17, 24, 39)",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {setting.label}
                      </span>
                      <svg
                        css={{
                          width: "16px",
                          height: "16px",
                          color: "rgb(156, 163, 175)",
                          stroke: "currentColor",
                          fill: "none",
                          flexShrink: 0,
                        }}
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              css={{
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: "8px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
                border: "1px solid rgb(229, 231, 235)",
              }}
            >
              <div css={{ padding: "16px" }}>
                <button
                  onClick={handleLogout}
                  css={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    backgroundColor: "rgb(239, 68, 68)",
                    border: "none",
                    borderRadius: "6px",
                    color: "rgb(255, 255, 255)",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    padding: "12px 24px",
                    transition: "background-color 0.15s ease",
                    width: "100%",
                    ":hover": {
                      backgroundColor: "rgb(220, 38, 38)",
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
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation - Same as Dashboard */}
      <nav
        css={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgb(255, 255, 255)",
          borderTop: "1px solid rgb(229, 231, 235)",
          zIndex: 50,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div
          css={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "8px 16px",
            maxWidth: "448px",
            margin: "0 auto",
          }}
        >
          {[
            { path: "/dashboard", label: "Home", isActive: false },
            { path: "/social-campaigns", label: "Campaign", isActive: false },
            {
              path: "/add-product",
              label: "Add",
              isActive: false,
              isSpecial: true,
            },
            { path: "/chat", label: "Chat", isActive: false },
            { path: "/profile", label: "Profile", isActive: true },
          ].map(({ path, label, isActive, isSpecial }) => (
            <a
              key={path}
              href={path}
              css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                borderRadius: "8px",
                transition: "color 0.15s ease",
                textDecoration: "none",
                color: isActive ? "rgb(22, 163, 74)" : "rgb(107, 114, 128)",
                minWidth: "48px",
                minHeight: "48px",
              }}
            >
              <span
                css={{
                  fontSize: "12px",
                  fontWeight: "500",
                  lineHeight: "16px",
                }}
              >
                {label}
              </span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default ProfileReact;
