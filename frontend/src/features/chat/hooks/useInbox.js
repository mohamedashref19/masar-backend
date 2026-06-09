import { useQuery } from "@tanstack/react-query";
import { getInbox } from "../services/chatApi";

export const useInbox = () => {
  return useQuery({
    queryKey: ["chat", "inbox"],
    queryFn: getInbox,
    refetchInterval: 5000, // Polling كل 5 ثوانٍ كـ Fallback لو الـ Socket مش شغالة في الفرونت
  });
};
