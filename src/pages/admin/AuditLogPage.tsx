import { useState } from "react";
import { getAuditLogs } from "../../data/staff.mock";

export default function AuditLogPage() {
  const [logs] = useState(() => getAuditLogs());

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Bảo mật</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Nhật ký kiểm toán ({logs.length})</h1>
        <p className="text-xs text-[#75645A] mt-1">Append-only — không thể sửa hoặc xóa từ giao diện này.</p>
      </div>

      {logs.length === 0 ? (
        <p className="text-xs text-[#75645A] italic py-8 text-center bg-white rounded-2xl border border-dashed border-[#E8DDD1]">Chưa có audit log nào.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8DDD1] overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[760px]">
            <thead className="bg-[#FAF6F0] text-[#75645A] uppercase text-[10px]">
              <tr>
                <th className="p-3">Thời gian</th>
                <th className="p-3">Người thực hiện</th>
                <th className="p-3">Vai trò</th>
                <th className="p-3">Hành động</th>
                <th className="p-3">Module</th>
                <th className="p-3">Lý do</th>
                <th className="p-3 text-right">Kết quả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDD1]">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-[#FAF6F0]/60">
                  <td className="p-3 font-mono text-[10px] text-[#75645A]">{new Date(l.createdAt).toLocaleString("vi-VN")}</td>
                  <td className="p-3 font-semibold">{l.actorName}</td>
                  <td className="p-3 text-[#75645A]">{l.actorRole}</td>
                  <td className="p-3 font-mono">{l.action}</td>
                  <td className="p-3">{l.module}</td>
                  <td className="p-3 text-[#75645A] max-w-[220px] truncate" title={l.reason}>{l.reason || "—"}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${l.result === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{l.result}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
