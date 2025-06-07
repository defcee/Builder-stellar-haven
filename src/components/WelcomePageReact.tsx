import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePageReact: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  return (
    <div
      css={{
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "24px",
        color: "rgb(2, 8, 23)",
        backgroundColor: "rgb(255, 255, 255)",
      }}
    >
      <div
        css={{
          backgroundImage:
            "linear-gradient(to right bottom, rgb(240, 253, 244), rgb(255, 255, 255), rgb(239, 246, 255))",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <header
          css={{
            backgroundColor: "rgb(255, 255, 255)",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            css={{
              backgroundImage:
                "linear-gradient(to right, rgba(22, 163, 74, 0.05), rgba(37, 99, 235, 0.05))",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <div
            css={{
              padding: "32px 24px",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              css={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                css={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgb(22, 163, 74)",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                }}
              >
                <svg
                  css={{
                    width: "20px",
                    height: "20px",
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
              <h1
                css={{
                  color: "rgb(17, 24, 39)",
                  fontSize: "30px",
                  fontWeight: "700",
                  lineHeight: "36px",
                }}
              >
                Bizzleap
              </h1>
            </div>

            <p
              css={{
                color: "rgb(75, 85, 99)",
                fontSize: "18px",
                lineHeight: "1.625",
                margin: "0 auto",
                maxWidth: "448px",
              }}
            >
              Empowering farmers and small businesses to grow, connect, and
              thrive in the digital marketplace
            </p>

            <div
              css={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "rgb(220, 252, 231)",
                borderRadius: "50px",
                color: "rgb(21, 128, 61)",
                fontSize: "12px",
                fontWeight: "600",
                lineHeight: "16px",
                marginTop: "16px",
                padding: "2px 10px",
                transition: "all 0.15s ease",
              }}
            >
              <svg
                css={{
                  width: "12px",
                  height: "12px",
                  marginRight: "4px",
                  stroke: "currentColor",
                  fill: "none",
                }}
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                <path d="M12 18h.01" />
              </svg>
              <span>Mobile Optimized</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          css={{
            padding: "32px 24px",
          }}
        >
          {/* Hero CTA */}
          <section
            css={{
              textAlign: "center",
              marginBottom: "48px",
            }}
          >
            <div
              css={{
                marginBottom: "24px",
              }}
            >
              <button
                onClick={handleGetStarted}
                css={{
                  display: "inline-flex",
                  alignItems: "center",
                  backgroundColor: "rgb(22, 163, 74)",
                  border: "none",
                  borderRadius: "6px",
                  color: "rgb(248, 250, 252)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  gap: "8px",
                  height: "44px",
                  justifyContent: "center",
                  lineHeight: "20px",
                  maxWidth: "320px",
                  padding: "0 32px",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  width: "100%",
                  ":hover": {
                    backgroundColor: "rgb(21, 128, 61)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 8px rgba(22, 163, 74, 0.3)",
                  },
                  ":active": {
                    transform: "translateY(0)",
                    backgroundColor: "rgb(20, 120, 58)",
                  },
                }}
              >
                <span>Get Started Free</span>
                <svg
                  css={{
                    width: "16px",
                    height: "16px",
                    stroke: "currentColor",
                    fill: "none",
                    marginLeft: "8px",
                  }}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>

              <p
                css={{
                  color: "rgb(107, 114, 128)",
                  fontSize: "14px",
                  lineHeight: "20px",
                  marginTop: "16px",
                }}
              >
                Already have an account?{" "}
                <a
                  onClick={handleSignIn}
                  css={{
                    color: "rgb(22, 163, 74)",
                    fontWeight: "500",
                    textDecoration: "none",
                    marginLeft: "4px",
                    cursor: "pointer",
                    ":hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign In
                </a>
              </p>
            </div>
          </section>

          {/* Features Section */}
          <section
            css={{
              marginBottom: "48px",
            }}
          >
            <h2
              css={{
                color: "rgb(17, 24, 39)",
                fontSize: "24px",
                fontWeight: "700",
                lineHeight: "32px",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              Built for Your Success
            </h2>

            <div
              css={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
                "@media (max-width: 640px)": {
                  gridTemplateColumns: "1fr",
                },
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
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                  ),
                  title: "For Farmers",
                  description:
                    "Showcase your fresh produce and connect directly with buyers",
                  color: "rgb(22, 163, 74)",
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                      <path d="m13 13 6 6" />
                    </svg>
                  ),
                  title: "Grow Your Business",
                  description:
                    "Market your products and services to a wider audience",
                  color: "rgb(37, 99, 235)",
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
                  title: "Direct Communication",
                  description:
                    "Chat directly with customers and build lasting relationships",
                  color: "rgb(147, 51, 234)",
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
                  title: "Build Your Reputation",
                  description: "Collect reviews and showcase your quality work",
                  color: "rgb(245, 158, 11)",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  css={{
                    backgroundColor: "rgb(255, 255, 255)",
                    borderRadius: "8px",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.15s ease",
                    cursor: "pointer",
                    ":hover": {
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <div
                    css={{
                      padding: "24px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      css={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: "rgb(249, 250, 251)",
                        marginBottom: "12px",
                        color: feature.color,
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
                        {feature.icon}
                      </div>
                    </div>
                    <h3
                      css={{
                        fontWeight: "600",
                        color: "rgb(17, 24, 39)",
                        marginBottom: "12px",
                        fontSize: "16px",
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      css={{
                        fontSize: "14px",
                        color: "rgb(75, 85, 99)",
                        lineHeight: "1.5",
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <section
            css={{
              marginBottom: "48px",
            }}
          >
            <h2
              css={{
                color: "rgb(17, 24, 39)",
                fontSize: "24px",
                fontWeight: "700",
                lineHeight: "32px",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              Everything You Need
            </h2>

            <div
              css={{
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: "8px",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
                padding: "24px",
              }}
            >
              <div
                css={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                {[
                  "Easy product listing and management",
                  "Social media campaign tools",
                  "Direct messaging with customers",
                  "Review and rating system",
                  "Mobile-first design",
                  "Secure payment integration",
                ].map((benefit, index) => (
                  <div
                    key={index}
                    css={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg
                      css={{
                        width: "20px",
                        height: "20px",
                        color: "rgb(22, 163, 74)",
                        stroke: "currentColor",
                        fill: "none",
                        flexShrink: 0,
                      }}
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                    <span
                      css={{
                        color: "rgb(55, 65, 81)",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Social Proof Section */}
          <section
            css={{
              textAlign: "center",
              marginBottom: "48px",
            }}
          >
            <div
              css={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: "👥", text: "1000+ Users" },
                { icon: "⭐", text: "4.8 Rating" },
                { icon: "📈", text: "Growing Fast" },
              ].map((stat, index) => (
                <div
                  key={index}
                  css={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "14px",
                    color: "rgb(75, 85, 99)",
                  }}
                >
                  <span css={{ fontSize: "16px" }}>{stat.icon}</span>
                  <span>{stat.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA Section */}
          <section
            css={{
              textAlign: "center",
              paddingBottom: "32px",
            }}
          >
            <h3
              css={{
                color: "rgb(17, 24, 39)",
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "16px",
              }}
            >
              Ready to grow your business?
            </h3>
            <button
              onClick={handleGetStarted}
              css={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "rgb(22, 163, 74)",
                border: "none",
                borderRadius: "6px",
                color: "rgb(248, 250, 252)",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                gap: "8px",
                height: "44px",
                justifyContent: "center",
                lineHeight: "20px",
                maxWidth: "320px",
                padding: "0 32px",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
                width: "100%",
                ":hover": {
                  backgroundColor: "rgb(21, 128, 61)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 8px rgba(22, 163, 74, 0.3)",
                },
              }}
            >
              <span>Join Bizzleap Today</span>
              <svg
                css={{
                  width: "16px",
                  height: "16px",
                  stroke: "currentColor",
                  fill: "none",
                  marginLeft: "8px",
                }}
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default WelcomePageReact;
