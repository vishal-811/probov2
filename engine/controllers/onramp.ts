import { INR_BALANCES } from "../data/balance";
import { publishMessage } from "../utils";
export function handleOnramp(uid: string, data: any) {
  try {
    const { amount, userId } = data;
    if (!INR_BALANCES[userId]) {
      throw new Error("User does not exist with this UserId");
    }
    INR_BALANCES[userId].balance += amount;
    publishMessage(
      `channel_${uid}`,
      `On ramped ${userId} with amount ${amount}`
    );
    return;
  } catch (error: any) {
    publishMessage(`channel_${uid}`, { error: error.message });
  }
}
