import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { trackEvent } from "../api/analytics";

/** Prefer a real download; Drive share links become uc?export=download. */
function toDownloadHref(href: string) {
  const driveId = href.match(/\/file\/d\/([^/]+)/)?.[1];
  if (driveId) {
    return `https://drive.google.com/uc?export=download&id=${driveId}`;
  }
  const idParam = href.match(/[?&]id=([^&]+)/)?.[1];
  if (href.includes("drive.google.com") && idParam) {
    return `https://drive.google.com/uc?export=download&id=${idParam}`;
  }
  return href;
}

export default function DownloadPdfButton({
  href,
  label = "Download CV",
  source = "hero",
  className = "btn-ghost",
}: {
  href: string;
  label?: string;
  source?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    setBusy(true);
    try {
      await trackEvent("resume_download", { source });
      const url = toDownloadHref(href);
      const a = document.createElement("a");
      a.href = url;
      a.rel = "noopener noreferrer";
      if (!url.includes("drive.google.com")) {
        a.download = "DivyMakwana.pdf";
      }
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" onClick={onClick} className={className} disabled={busy}>
      <FiDownload />
      {label}
    </button>
  );
}
