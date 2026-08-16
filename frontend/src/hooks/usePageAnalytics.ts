import { useEffect } from "react";
import { trackEvent } from "../api/analytics";

export function usePageAnalytics() {
  useEffect(() => {
    trackEvent("page_view");
  }, []);
}
