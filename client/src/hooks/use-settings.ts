import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useSettings() {
  return useQuery({
    queryKey: [api.settings.list.path],
    queryFn: async () => {
      const res = await fetch(api.settings.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch settings");
      return api.settings.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const url = buildUrl(api.settings.update.path, { key });
      const res = await fetch(url, {
        method: api.settings.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update setting");
      return api.settings.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.settings.list.path] }),
  });
}

export function useServerStatus() {
  return useQuery({
    queryKey: [api.server.status.path],
    queryFn: async () => {
      const res = await fetch(api.server.status.path);
      if (!res.ok) throw new Error("Failed to fetch server status");
      return api.server.status.responses[200].parse(await res.json());
    },
    // Refetch every 30 seconds for live count
    refetchInterval: 30000,
  });
}
