import { useState, FormEvent } from "react";
import { useApp } from "../../context/AppContext";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getStaffDirectory, assignStaffRole } from "../../data/staff.mock";
import { ROLE_PERMISSIONS, STAFF_ROLE_LABELS } from "../../lib/permissions";
import { StaffRoleId } from "../../types";

const ROLE_OPTIONS = Object.keys(ROLE_PERMISSIONS) as StaffRoleId[];

export default function RoleAssignmentPage() {
  const { currentUser } = useApp();
  const { staff: actorStaff, can } = useAdminAuth();
  const [staffList, setStaffList] = useState(() => getStaffDirectory());
  const [selectedUid, setSelectedUid] = useState("");
  const [nextRole, setNextRole] = useState<StaffRoleId>("order_operations");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleAssign = (e: FormEvent) => {
    e.preventDefault();
    if (!actorStaff || !currentUser || !selectedUid) return;
    const res = assignStaffRole(selectedUid, nextRole, { uid: actorStaff.uid, name: currentUser.name, roleId: actorStaff.roleId }, reason);
    if (!res.ok) {
      setMessage(res.error || "Không thể gán role.");
      return;
    }
    setMessage("Đã cập nhật role thành công.");
    setStaffList(getStaffDirectory());
    setReason("");
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Bảo mật</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Phân quyền (Role & Permission Matrix)</h1>
      </div>

      {can("roles.assign") && (
        <form onSubmit={handleAssign} className="bg-white p-5 rounded-2xl border border-[#E8DDD1] space-y-3">
          <h4 className="font-serif font-bold text-xs uppercase border-b border-[#E8DDD1] pb-2">Gán role cho nhân viên</h4>
          {message && <p className="text-xs font-semibold text-[#CEAF75]">{message}</p>}
          <div className="grid gap-3 sm:grid-cols-3">
            <select required value={selectedUid} onChange={(e) => setSelectedUid(e.target.value)} className="rounded-xl border border-[#E8DDD1] px-3.5 py-2.5 text-sm outline-none">
              <option value="">Chọn nhân viên...</option>
              {staffList.map((s) => <option key={s.uid} value={s.uid}>{s.displayName} ({STAFF_ROLE_LABELS[s.roleId]})</option>)}
            </select>
            <select value={nextRole} onChange={(e) => setNextRole(e.target.value as StaffRoleId)} className="rounded-xl border border-[#E8DDD1] px-3.5 py-2.5 text-sm outline-none">
              {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{STAFF_ROLE_LABELS[r]}</option>)}
            </select>
            <input required value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Lý do thay đổi role..." className="rounded-xl border border-[#E8DDD1] px-3.5 py-2.5 text-sm outline-none" />
          </div>
          <button type="submit" className="rounded-full bg-[#412C20] text-white text-xs font-bold uppercase tracking-[0.15em] px-5 py-2.5 cursor-pointer">Xác nhận gán role</button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-[#E8DDD1] overflow-x-auto">
        <table className="w-full text-xs text-left min-w-[900px]">
          <thead className="bg-[#FAF6F0] text-[#75645A] uppercase text-[10px]">
            <tr>
              <th className="p-3">Role</th>
              <th className="p-3">Tên hiển thị</th>
              <th className="p-3 text-right">Số permission</th>
              <th className="p-3">Ví dụ quyền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DDD1]">
            {ROLE_OPTIONS.map((r) => (
              <tr key={r} className="hover:bg-[#FAF6F0]/60">
                <td className="p-3 font-mono">{r}</td>
                <td className="p-3 font-semibold">{STAFF_ROLE_LABELS[r]}</td>
                <td className="p-3 text-right font-mono font-bold text-[#CEAF75]">{ROLE_PERMISSIONS[r].length}</td>
                <td className="p-3 text-[#75645A]">{ROLE_PERMISSIONS[r].slice(0, 5).join(", ")}{ROLE_PERMISSIONS[r].length > 5 ? "…" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
