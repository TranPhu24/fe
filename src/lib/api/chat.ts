import { API_BASE } from "./index";
import { ApiResponse,} from "./types";
export async function chatGeminiApi(
  message: string
): Promise<ApiResponse<string>> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Chat thất bại",
    };
  }

  return {
    success: true,
    message: "Chat thành công",
    data: data.reply, 
  };
}
