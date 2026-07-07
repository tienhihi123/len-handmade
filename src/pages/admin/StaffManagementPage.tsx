import { useState, FormEvent } from "react";
import { Plus, UserCog } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getStaffDirectory, inviteStaff, updateStaffStatusLocal } from "../../data/staff.mock";
import { STAFF_ROLE_LABELS, ROLE_PERMISSIONS } from "../../lib/permissions";
import { StaffRoleId, StaffStatus } from "../../types";

const STATUS_BADGE: Record<StaffStatus, string> = {
  active: "bg-green-100 text-green-700",
  invited: "bg-blue-100 text-blue-700",
  suspended: "bg-amber-100 text-amber-700",
  disabled: "bg-red-100 text-red-700"
};

const ROLE_OPTIONS = Object.keys(ROLE_PERMISSIONS) as StaffRoleId[];

export default function StaffManagementPage() {
  const { currentUser } = useApp();
  const { staff: actorStaff, can } = useAdminAuth();
  const [staffList, setStaffList] = useState(() => getStaffDirectory());
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<StaffRoleId>("order_operations");
  const [error, setError] = useState("");
  const [reasonDraft, setReasonDraft] = useState<Record<string, string>>({});

  const refresh = () => setStaffList(getStaffDirectory());

  const handleInvite = (e: FormEvent) => {
    e.preventDefault();
    if (!actorStaff || !currentUser) return;
    setError("");
    const res = inviteStaff(inviteEmail, inviteName, inviteRole, { uid: actorStaff.uid, name: currentUser.name, roleId: actorStaff.roleId });
    if (!res.ok) {
      setError(res.error || "Không thể mời nhân viên.");
      return;
    }
    refresh();
    setInviteEmail("");
    setInviteName("");
    setShowInvite(false);
  };

  const handleStatusChange = (uid: string, status: StaffStatus) => {
    if (!actorStaff || !currentUser) return;
    const reason = reasonDraft[uid]?.trim();
    if (!reason) {
      setError("Vui lòng nhập lý do trước khi thay đổi trạng thái.");
      return;
    }
    const res = updateStaffStatusLocal(uid, status, { uid: actorStaff.uid, name: currentUser.name, roleId: actorStaff.roleId }, reason);
    if (!res.ok) {
      setError(res.error || "Không thể cập nhật trạng thái.");
      return;
    }
    setError("");
    refresh();
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Quản trị nội bộ</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Nhân viên ({staffList.length})</h1>
        </div>
        {can("staff.create") && (
          <button onClick={() => setShowInvite((v) => !v)} className="inline-flex items-center gap-2 rounded-full bg-[#CEAF75] text-white px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] cursor-pointer">
            <Plus size={14} /> Mời nhân viên
          </button>
        )}
      </div>

      {error && <p className="text-xs font-semibold text-[#BA1A1A] bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{error}</p>}

      {showInvite && (
        <form onSubmit={handleInvite} className="bg-white p-5 rounded-2xl border border-[#E8DDD1] grid gap-3 sm:grid-cols-4">
          <input required type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Email nhân viên" className="rounded-xl border border-[#E8DDD1] px-3.5 py-2.5 text-sm outline-none" />
          <input required value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Họ tên" className="rounded-xl border border-[#E8DDD1] px-3.5 py-2.5 text-sm outline-none" />
          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as StaffRoleId)} className="rounded-xl border border-[#E8DDD1] px-3.5 py-2.5 text-sm outline-none">
            {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{STAFF_ROLE_LABELS[r]}</option>)}
          </select>
          <button type="submit" className="rounded-xl bg-[#412C20] text-white text-xs font-bold py-2.5 cursor-pointer">Gửi lời mời</button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-[#E8DDD1] overflow-x-auto">
        <table className="w-full text-xs text-left min-w-[820px]">
          <thead className="bg-[#FAF6F0] text-[#75645A] uppercase text-[10px]">
            <tr>
              <th className="p-3">Nhân viên</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Đăng nhập gần nhất</th>
              <th className="p-3">Lý do thao tác</th>
              <th className="p-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DDD1]">
            {staffList.map((s) => (
              <tr key={s.uid} className="hover:bg-[#FAF6F0]/60">
                <td className="p-3">
                  <div className="flex items-center gap-2.5">
                    <UserCog size={14} className="text-[#CEAF75]" />
                    <div>
                      <p className="font-semibold">{s.displayName}</p>
                      <p className="text-[10px] text-[#75645A]">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{STAFF_ROLE_LABELS[s.roleId]}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${STATUS_BADGE[s.status]}`}>{s.status}</span></td>
                <td className="p-3 font-mono text-[10px] text-[#75645A]">{s.lastLoginAt ? new Date(s.lastLoginAt).toLocaleString("vi-VN") : "Chưa đăng nhập"}</td>
                <td className="p-3">
                  {can("staff.disable") && (
                    <input
                      value={reasonDraft[s.uid] || ""}
                      onChange={(e) => setReasonDraft((prev) => ({ ...prev, [s.uid]: e.target.value }))}
                      placeholder="Lý do..."
                      className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-[#E8DDD1] outline-none"
                    />
                  )}
                </td>
                <td className="p-3 text-right">
                  {can("staff.disable") && (
                    <div className="flex gap-1.5 justify-end flex-wrap">
                      {s.status !== "active" && (
                        <button onClick={() => handleStatusChange(s.uid, "active")} className="px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 text-[10px] font-bold cursor-pointer">Kích hoạt</button>
                      )}
                      {s.status === "active" && (
                        <button onClick={() => handleStatusChange(s.uid, "suspended")} className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-bold cursor-pointer">Tạm khóa</button>
                      )}
                      {s.status !== "disabled" && (
                        <button onClick={() => handleStatusChange(s.uid, "disabled")} className="px-2.5 py-1.5 rounded-lg bg-red-50 text-[#BA1A1A] text-[10px] font-bold cursor-pointer">Vô hiệu hóa</button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
