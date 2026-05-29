import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { batchApi } from "@/lib/api";
import { toast } from "sonner";
import type { BatchWithProgress, BatchActivity, BatchDetail, Lecture, Homework, HomeworkWithBatch, Announcement } from "@/types/batch";

export function useMyBatches() {
  return useQuery<BatchWithProgress[]>({
    queryKey: ["batches", "mine"],
    queryFn: batchApi.getMyBatches,
    staleTime: 2 * 60_000,
  });
}

export function useBatchActivity() {
  return useQuery<BatchActivity | null>({
    queryKey: ["batches", "activity"],
    queryFn: batchApi.getActivity,
    staleTime: 2 * 60_000,
  });
}

export function useBatchDetail(slug: string) {
  return useQuery<BatchDetail>({
    queryKey: ["batches", slug],
    queryFn: () => batchApi.getBySlug(slug),
    staleTime: 2 * 60_000,
    enabled: !!slug,
  });
}

export function useBatchLectures(slug: string) {
  return useQuery<Lecture[]>({
    queryKey: ["batches", slug, "lectures"],
    queryFn: () => batchApi.getLectures(slug),
    staleTime: 2 * 60_000,
    enabled: !!slug,
  });
}

export function useLecture(slug: string, lectureId: string) {
  return useQuery({
    queryKey: ["batches", slug, "lectures", lectureId],
    queryFn: () => batchApi.getLecture(slug, lectureId),
    staleTime: 5 * 60_000,
    enabled: !!slug && !!lectureId,
  });
}

export function useBatchHomework(slug: string) {
  return useQuery<Homework[]>({
    queryKey: ["batches", slug, "homework"],
    queryFn: () => batchApi.getHomework(slug),
    staleTime: 2 * 60_000,
    enabled: !!slug,
  });
}

export function useBatchAnnouncements(slug: string) {
  return useQuery<Announcement[]>({
    queryKey: ["batches", slug, "announcements"],
    queryFn: () => batchApi.getAnnouncements(slug),
    staleTime: 5 * 60_000,
    enabled: !!slug,
  });
}

export function useAllHomework() {
  return useQuery<HomeworkWithBatch[]>({
    queryKey: ["homework", "all"],
    queryFn: batchApi.getAllHomework,
    staleTime: 2 * 60_000,
  });
}

export function useUpdateAnyHomeworkProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ hwId, batchSlug, status, solvedCount }: { hwId: string; batchSlug: string; status: string; solvedCount?: number }) =>
      batchApi.updateHomeworkProgress(batchSlug, hwId, status, solvedCount),
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: ["homework", "all"] });
      qc.invalidateQueries({ queryKey: ["batches", vars.batchSlug, "homework"] });
      qc.invalidateQueries({ queryKey: ["batches", "activity"] });
      if (vars.status === "completed") {
        toast.success(`Homework completed! +${data.xpGained} XP`);
      } else {
        toast.success("Progress updated");
      }
    },
    onError: () => toast.error("Failed to update homework"),
  });
}

export function useToggleLecture(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (lectureId: string) => batchApi.toggleComplete(slug, lectureId),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["batches", slug] });
      qc.invalidateQueries({ queryKey: ["batches", "activity"] });
      if (data.completed) {
        toast.success(`Lecture marked complete! +${data.xpGained} XP`);
      } else {
        toast.info("Lecture marked incomplete");
      }
    },
    onError: () => toast.error("Failed to update progress"),
  });
}

export function useUpdateHomeworkProgress(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ hwId, status, solvedCount }: { hwId: string; status: string; solvedCount?: number }) =>
      batchApi.updateHomeworkProgress(slug, hwId, status, solvedCount),
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: ["batches", slug, "homework"] });
      qc.invalidateQueries({ queryKey: ["batches", "activity"] });
      if (vars.status === "completed") {
        toast.success(`Homework completed! +${data.xpGained} XP`);
      } else {
        toast.success("Progress updated");
      }
    },
    onError: () => toast.error("Failed to update homework"),
  });
}
