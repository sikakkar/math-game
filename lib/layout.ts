import { useWindowDimensions } from "react-native";

/** Width at which we switch from the phone layout to the desktop/tablet layout. */
export const WIDE_BREAKPOINT = 768;

/** Max width of the centered content column on wide screens. */
export const CONTENT_MAX_WIDTH = 640;

export function useIsWide() {
  const { width } = useWindowDimensions();
  return width >= WIDE_BREAKPOINT;
}
