import { redirect } from "react-router";

/**
 * Root route that redirects to the home page
 */
export function loader() {
  return redirect("/home");
} 