import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../services/chatApi";

export const useChatWindow = (conversationId) => {
  const queryClient = useQueryClient();

  // جلب الرسائل
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["chat", "messages", conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });

  // إرسال رسالة
  const { mutate: sendNewMessage, isPending: isSending } = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      // عمل ريفريش فوراً للرسائل عشان تظهر الجديدة
      queryClient.invalidateQueries(["chat", "messages", conversationId]);
      queryClient.invalidateQueries(["chat", "inbox"]);
    },
  });

  return {
    messages: messagesData?.data?.messages || messagesData || [],
    isLoadingMessages,
    sendNewMessage,
    isSending,
  };
};
