
import { supabase } from "@/integrations/supabase/client";

export interface AccessibilityLog {
  feature: string;  // e.g. "darkMode", "fontSize", "contrastMode"
  action: string;   // e.g. "toggle", "increase", "decrease"
  value?: string;   // e.g. "on", "off", "large"
}

export async function logAccessibilityAction(log: AccessibilityLog): Promise<void> {
  // Only log if user is authenticated
  if (!(await supabase.auth.getSession()).data.session) {
    console.log("Accessibility action not logged: User not authenticated");
    return;
  }

  const { error } = await supabase
    .from("accessibility_logs")
    .insert([log]);
  
  if (error) {
    console.error("Error logging accessibility action:", error);
    // Don't throw here to prevent disrupting user experience
  }
}
