import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useApp } from "./AppContext";
import { subscribeToStaff } from "../lib/staffService";
import { hasStaffPermission, isStaffActive, PermissionKey } from "../lib/permissions";
import { StaffDoc } from "../types";
import { isFirebaseConfigured } from "../lib/firebase";

interface AdminAuthContextValue {
  staff: StaffDoc | null;
  isStaff: boolean;
  isActiveStaff: boolean;
  isLoading: boolean;
  can: (key: PermissionKey) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useApp();
  const [staff, setStaff] = useState<StaffDoc | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Real-time subscription to staff/{uid} document in Firestore
  useEffect(() => {
    if (!isFirebaseConfigured || !currentUser) {
      setStaff(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToStaff(currentUser.id, (staffDoc) => {
      setStaff(staffDoc);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const value: AdminAuthContextValue = {
    staff,
    isStaff: !!staff,
    isActiveStaff: isStaffActive(staff),
    isLoading,
    can: (key: PermissionKey) => {
      if (!staff) return false;
      if (staff.status !== "active") return false;
      if (staff.roleId === "admin") return true;
      return hasStaffPermission(staff, key);
    }
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
