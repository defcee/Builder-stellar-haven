import React, { useState } from "react";
import { useMobilePlatform } from "@/hooks/useMobilePlatform";

const DashboardReact: React.FC = () => {
  const mobile = useMobilePlatform();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock user data
  const user = {
    name: "John Farmer",
    businessType: "Organic Vegetables",
  };

  // Mock products data
  const products = [
    {
      id: "1",
      title: "Fresh Organic Tomatoes",
      description:
        "Premium quality organic tomatoes grown without pesticides. Perfect for salads and cooking.",
      price: 5.99,
      category: "Vegetables",
      inStock: true,
      views: 45,
      inquiries: 8,
    },
    {
      id: "2",
      title: "Farm Fresh Chicken Eggs",
      description:
        "Free-range chicken eggs from happy, healthy chickens. Rich in nutrients and flavor.",
      price: 3.49,
      category: "Dairy & Eggs",
      inStock: true,
      views: 32,
      inquiries: 5,
    },
  ];

  const stats = {
    activeProducts: products.filter((p) => p.inStock).length,
    totalViews: products.reduce((sum, p) => sum + p.views, 0),
    totalInquiries: products.reduce((sum, p) => sum + p.inquiries, 0),
  };

  const handleAddProduct = async () => {
    await mobile.triggerHaptic("medium");
    await mobile.showToast("Add Product feature coming soon!");
  };

  const handleCampaigns = () => {
    window.location.href = "/social-campaigns";
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
        <div
          css={{
            padding: "16px",
          }}
        >
          <div
            css={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div css={{ flex: 1 }}>
              <h1
                css={{
                  color: "rgb(17, 24, 39)",
                  fontSize: "20px",
                  fontWeight: "700",
                  lineHeight: "28px",
                  marginBottom: "4px",
                }}
              >
                Welcome back, {user.name.split(" ")[0]}! 👋
              </h1>
              <p
                css={{
                  color: "rgb(107, 114, 128)",
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                {user.businessType}
              </p>
            </div>
            <button
              css={{
                position: "relative",
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
                  width: "20px",
                  height: "20px",
                  color: "rgb(107, 114, 128)",
                  stroke: "currentColor",
                  fill: "none",
                }}
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span
                css={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  backgroundColor: "rgb(239, 68, 68)",
                  color: "rgb(255, 255, 255)",
                  fontSize: "10px",
                  fontWeight: "600",
                  padding: "2px 6px",
                  borderRadius: "50px",
                  minWidth: "16px",
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                3
              </span>
            </button>
          </div>

          <div css={{ position: "relative" }}>
            <svg
              css={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "16px",
                height: "16px",
                color: "rgb(156, 163, 175)",
                stroke: "currentColor",
                fill: "none",
              }}
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search your products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              css={{
                width: "100%",
                backgroundColor: "rgb(255, 255, 255)",
                border: "1px solid rgb(209, 213, 219)",
                borderRadius: "8px",
                color: "rgb(17, 24, 39)",
                fontSize: "14px",
                lineHeight: "20px",
                padding: "12px 16px 12px 40px",
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
        </div>
      </header>

      {/* Main Content */}
      <main
        css={{
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Quick Stats */}
        <section>
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
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                  </svg>
                ),
                value: stats.activeProducts,
                label: "Active Products",
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
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ),
                value: "4.8",
                label: "Rating",
                color: "rgb(245, 158, 11)",
                bgColor: "rgb(254, 240, 138)",
              },
            ].map((stat, index) => (
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
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    css={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: stat.bgColor,
                      color: stat.color,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      css={{
                        width: "16px",
                        height: "16px",
                        stroke: "currentColor",
                        fill: "none",
                      }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div css={{ flex: 1 }}>
                    <p
                      css={{
                        color: "rgb(17, 24, 39)",
                        fontSize: "24px",
                        fontWeight: "700",
                        lineHeight: "32px",
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      css={{
                        color: "rgb(107, 114, 128)",
                        fontSize: "12px",
                        lineHeight: "16px",
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div
            css={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}
          >
            <button
              onClick={handleAddProduct}
              css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "rgb(22, 163, 74)",
                border: "none",
                borderRadius: "8px",
                color: "rgb(255, 255, 255)",
                cursor: "pointer",
                height: "80px",
                padding: "16px",
                transition: "all 0.15s ease",
                ":hover": {
                  backgroundColor: "rgb(21, 128, 61)",
                },
                ":active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              <svg
                css={{
                  width: "24px",
                  height: "24px",
                  stroke: "currentColor",
                  fill: "none",
                }}
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
              <span
                css={{
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Add Product
              </span>
            </button>

            <button
              onClick={handleCampaigns}
              css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "rgb(255, 255, 255)",
                border: "1px solid rgb(209, 213, 219)",
                borderRadius: "8px",
                color: "rgb(75, 85, 99)",
                cursor: "pointer",
                height: "80px",
                padding: "16px",
                transition: "all 0.15s ease",
                ":hover": {
                  borderColor: "rgb(156, 163, 175)",
                  backgroundColor: "rgb(249, 250, 251)",
                },
              }}
            >
              <svg
                css={{
                  width: "24px",
                  height: "24px",
                  stroke: "currentColor",
                  fill: "none",
                }}
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
              <span
                css={{
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Campaigns
              </span>
            </button>
          </div>
        </section>

        {/* Products Section */}
        <section
          css={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              css={{
                color: "rgb(17, 24, 39)",
                fontSize: "18px",
                fontWeight: "600",
                lineHeight: "28px",
              }}
            >
              Your Products
            </h2>
            <div
              css={{
                backgroundColor: "rgb(243, 244, 246)",
                color: "rgb(75, 85, 99)",
                fontSize: "12px",
                fontWeight: "500",
                padding: "4px 8px",
                borderRadius: "50px",
              }}
            >
              {products.length} products
            </div>
          </div>

          <div
            css={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                css={{
                  backgroundColor: "rgb(255, 255, 255)",
                  borderRadius: "8px",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
                  border: "1px solid rgb(229, 231, 235)",
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "all 0.15s ease",
                  ":hover": {
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <div
                  css={{
                    position: "relative",
                    height: "192px",
                    overflow: "hidden",
                    backgroundColor: "rgb(243, 244, 246)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    css={{
                      color: "rgb(107, 114, 128)",
                      fontSize: "14px",
                    }}
                  >
                    Product Image
                  </span>
                  <button
                    css={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      padding: "8px",
                      transition: "all 0.15s ease",
                      ":hover": {
                        backgroundColor: "rgb(255, 255, 255)",
                      },
                    }}
                  >
                    <svg
                      css={{
                        width: "16px",
                        height: "16px",
                        color: "rgb(75, 85, 99)",
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

                <div css={{ padding: "16px" }}>
                  <div
                    css={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      gap: "12px",
                    }}
                  >
                    <h3
                      css={{
                        color: "rgb(17, 24, 39)",
                        fontSize: "16px",
                        fontWeight: "600",
                        lineHeight: "24px",
                        flex: 1,
                      }}
                    >
                      {product.title}
                    </h3>
                    <span
                      css={{
                        color: "rgb(22, 163, 74)",
                        fontSize: "18px",
                        fontWeight: "700",
                        lineHeight: "28px",
                        flexShrink: 0,
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <p
                    css={{
                      color: "rgb(107, 114, 128)",
                      fontSize: "14px",
                      lineHeight: "20px",
                      marginBottom: "12px",
                    }}
                  >
                    {product.description}
                  </p>

                  <div css={{ marginBottom: "12px" }}>
                    <span
                      css={{
                        backgroundColor: "rgb(243, 244, 246)",
                        border: "1px solid rgb(209, 213, 219)",
                        borderRadius: "50px",
                        color: "rgb(75, 85, 99)",
                        fontSize: "12px",
                        fontWeight: "500",
                        padding: "4px 12px",
                      }}
                    >
                      {product.category}
                    </span>
                  </div>

                  <div
                    css={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      css={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "rgb(107, 114, 128)",
                        fontSize: "14px",
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
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>{product.views}</span>
                    </div>
                    <div
                      css={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "rgb(107, 114, 128)",
                        fontSize: "14px",
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
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span>{product.inquiries}</span>
                    </div>
                  </div>
                </div>

                <div css={{ padding: "0 16px 16px" }}>
                  <button
                    css={{
                      width: "100%",
                      backgroundColor: "rgb(22, 163, 74)",
                      border: "none",
                      borderRadius: "6px",
                      color: "rgb(255, 255, 255)",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      height: "40px",
                      transition: "background-color 0.15s ease",
                      ":hover": {
                        backgroundColor: "rgb(21, 128, 61)",
                      },
                    }}
                  >
                    Contact Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
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
            {
              path: "/dashboard",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              ),
              label: "Home",
              isActive: true,
            },
            {
              path: "/social-campaigns",
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
              label: "Campaign",
              isActive: false,
            },
            {
              path: "/add-product",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
              ),
              label: "Add",
              isActive: false,
              isSpecial: true,
            },
            {
              path: "/chat",
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
              label: "Chat",
              isActive: false,
            },
            {
              path: "/profile",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              ),
              label: "Profile",
              isActive: false,
            },
          ].map(({ path, icon, label, isActive, isSpecial }) => (
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
                position: "relative",
              }}
            >
              {isSpecial ? (
                <div
                  css={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgb(22, 163, 74)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 8px rgba(22, 163, 74, 0.3)",
                    transition: "all 0.15s ease",
                    ":hover": {
                      backgroundColor: "rgb(21, 128, 61)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <div
                    css={{
                      width: "24px",
                      height: "24px",
                      color: "rgb(255, 255, 255)",
                      stroke: "currentColor",
                      fill: "none",
                    }}
                  >
                    {icon}
                  </div>
                </div>
              ) : (
                <>
                  <div
                    css={{
                      width: "24px",
                      height: "24px",
                      stroke: "currentColor",
                      fill: "none",
                      marginBottom: "4px",
                    }}
                  >
                    {icon}
                  </div>
                  <span
                    css={{
                      fontSize: "12px",
                      fontWeight: "500",
                      lineHeight: "16px",
                    }}
                  >
                    {label}
                  </span>
                </>
              )}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DashboardReact;
