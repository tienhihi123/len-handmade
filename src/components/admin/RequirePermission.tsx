import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { PermissionKey } from "../../lib/permissions";

interface RequirePermissionProps {
  permission: PermissionKey;
  children: ReactNode;
}

/**
 * Per-route permission gate. Wrap every /admin/* page (not just the /admin
 * root) so a staff member can only ever reach a page their role grants
 * `<module>.view` (or the specific action key) for. Redirects before any
 * child component — and therefore any sensitive data fetch — mounts.
 */
export default function RequirePermission({ permission, children }: RequirePermissionProps) {
  const { can } = useAdminAuth();

  if (!can(permission)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <>{children}</>;
}
