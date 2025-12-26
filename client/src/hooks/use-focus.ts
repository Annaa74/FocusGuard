import { useMutation } from "@tanstack/react-query";
import { api, type AnalyzeFocusRequest, type AnalyzeFocusResponse } from "@shared/routes";

export function useAnalyzeFocus() {
  return useMutation({
    mutationFn: async (data: AnalyzeFocusRequest) => {
      const res = await fetch(api.focus.analyze.path, {
        method: api.focus.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze focus");
      }

      // We need to parse the response to match our types
      const result = await res.json();
      return api.focus.analyze.responses[200].parse(result);
    },
  });
}
