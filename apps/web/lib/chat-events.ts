/**
 * Lets anything on the page open the chat without threading state through the
 * layout — SiteChat owns its own open state and mounts as a sibling of the
 * page content, so there is no common provider to hang it off.
 */
export const OPEN_CHAT_EVENT = "arthur:open-chat"

/**
 * Fired when the panel closes. The trigger lives in the nav now, so the panel
 * can no longer hand focus back itself — whoever opened it listens for this and
 * takes focus back.
 */
export const CHAT_CLOSED_EVENT = "arthur:chat-closed"
