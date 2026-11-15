/**
 * Tailwind CSS build config. Keep theme tokens aligned with the original QR Studio Pro design system.
 */
module.exports = {
  "darkMode": "class",
  "theme": {
    "extend": {
      "colors": {
        "inverse-surface": "#16181D",
        "secondary-fixed": "#F3E1B5",
        "surface-dim": "#F4F4F0",
        "secondary": "#B8860B",
        "background": "#FBFBF9",
        "surface-container-high": "#EAEAE4",
        "on-error-container": "#ffdad6",
        "outline-variant": "#E8E8E2",
        "on-secondary-container": "#00424e",
        "surface-container-low": "#F7F7F3",
        "on-tertiary-container": "#3e2400",
        "tertiary-fixed-dim": "#E2C98D",
        "primary-fixed-dim": "#E2C98D",
        "on-background": "#16181D",
        "on-surface": "#16181D",
        "on-error": "#690005",
        "outline": "#9A9A91",
        "on-primary-container": "#5D4308",
        "on-tertiary-fixed-variant": "#653e00",
        "secondary-container": "#F9F1DC",
        "on-secondary": "#16181D",
        "tertiary-fixed": "#F9F1DC",
        "surface-container-lowest": "#FFFFFF",
        "primary": "#C9A45C",
        "on-primary-fixed-variant": "#2f2ebe",
        "surface-container": "#F1F1EB",
        "on-tertiary": "#472a00",
        "on-surface-variant": "#64645D",
        "secondary-fixed-dim": "#E2C98D",
        "primary-fixed": "#FDF9EF",
        "error-container": "#93000a",
        "inverse-on-surface": "#2B2B28",
        "inverse-primary": "#996515",
        "tertiary": "#996515",
        "surface-tint": "#C9A45C",
        "surface-bright": "#FFFFFF",
        "surface-container-highest": "#E3E3DC",
        "on-primary": "#0B0B0C",
        "on-secondary-fixed-variant": "#004e5c",
        "primary-container": "#F3E1B5",
        "on-tertiary-fixed": "#2a1700",
        "on-secondary-fixed": "#001f26",
        "error": "#ffb4ab",
        "tertiary-container": "#F9F1DC",
        "on-primary-fixed": "#07006c",
        "surface": "#FFFFFF",
        "surface-variant": "#E8E8E2"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "space-md": "1.25rem",
        "margin-kiosk": "3rem",
        "space-sm": "0.75rem",
        "gutter": "1.5rem",
        "gutter-kiosk": "2rem",
        "margin": "2rem",
        "space-lg": "2rem",
        "space-xs": "0.5rem",
        "space-xl": "3rem"
      },
      "fontFamily": {
        "headline-xl-mobile": [
          "Geist"
        ],
        "label-md": [
          "Geist"
        ],
        "headline-xl": [
          "Geist"
        ],
        "body-lg": [
          "Inter"
        ],
        "body-xl": [
          "Inter"
        ],
        "headline-lg": [
          "Geist"
        ],
        "body-md": [
          "Inter"
        ],
        "hud-timer": [
          "Geist"
        ],
        "headline-sm": [
          "Geist"
        ],
        "headline-md": [
          "Geist"
        ],
        "label-sm": [
          "Geist"
        ],
        "display-hero-mobile": [
          "Geist"
        ],
        "display-hero": [
          "Geist"
        ],
        "label-lg": [
          "Geist"
        ]
      },
      "fontSize": {
        "headline-xl-mobile": [
          "36px",
          {
            "lineHeight": "42px",
            "letterSpacing": "-0.02em",
            "fontWeight": "700"
          }
        ],
        "label-md": [
          "14px",
          {
            "lineHeight": "18px",
            "letterSpacing": "0.04em",
            "fontWeight": "600"
          }
        ],
        "headline-xl": [
          "48px",
          {
            "lineHeight": "54px",
            "letterSpacing": "-0.02em",
            "fontWeight": "700"
          }
        ],
        "body-lg": [
          "18px",
          {
            "lineHeight": "26px",
            "fontWeight": "400"
          }
        ],
        "body-xl": [
          "20px",
          {
            "lineHeight": "28px",
            "fontWeight": "500"
          }
        ],
        "headline-lg": [
          "32px",
          {
            "lineHeight": "38px",
            "letterSpacing": "-0.01em",
            "fontWeight": "600"
          }
        ],
        "body-md": [
          "16px",
          {
            "lineHeight": "24px",
            "fontWeight": "400"
          }
        ],
        "hud-timer": [
          "96px",
          {
            "lineHeight": "96px",
            "letterSpacing": "-0.04em",
            "fontWeight": "700"
          }
        ],
        "headline-sm": [
          "20px",
          {
            "lineHeight": "26px",
            "letterSpacing": "0em",
            "fontWeight": "600"
          }
        ],
        "headline-md": [
          "24px",
          {
            "lineHeight": "30px",
            "letterSpacing": "0em",
            "fontWeight": "600"
          }
        ],
        "label-sm": [
          "11px",
          {
            "lineHeight": "14px",
            "letterSpacing": "0.06em",
            "fontWeight": "700"
          }
        ],
        "display-hero-mobile": [
          "48px",
          {
            "lineHeight": "52px",
            "letterSpacing": "-0.02em",
            "fontWeight": "700"
          }
        ],
        "display-hero": [
          "72px",
          {
            "lineHeight": "76px",
            "letterSpacing": "-0.03em",
            "fontWeight": "700"
          }
        ],
        "label-lg": [
          "18px",
          {
            "lineHeight": "22px",
            "letterSpacing": "0.02em",
            "fontWeight": "700"
          }
        ]
      }
    }
  },
  "content": [
    "./index.html",
    "./en/index.html",
    "./admin-settings.js",
    "./qrnode-upgrade.js"
  ],
  "safelist": [
    "hidden",
    "opacity-0",
    "opacity-100",
    "pointer-events-none",
    "translate-y-[-20px]",
    "translate-y-0",
    "bg-emerald-50",
    "border-emerald-300",
    "text-emerald-800",
    "bg-amber-50",
    "border-amber-300",
    "text-amber-900",
    "bg-red-50",
    "border-red-300",
    "text-red-800",
    "text-emerald-700",
    "text-amber-700",
    "text-red-700"
  ]
};
