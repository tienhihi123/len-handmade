import { useMemo, useState } from "react";
import { History, AlertOctagon, Wallet, Layers, Coins, ShieldCheck, Settings } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getAuditLogs, getRefundRequests } from "../../data/staff.mock";

export default function AuditDashboardPage() {
  const { logs, inventoryLogs } = useApp();
  const [auditLogs] = useState(() => getAuditLogs());
  const [refunds] = useState(() => getRefundRequests());

  const failedActions = auditLogs.filter((a) => a.result === "failure");
  const roleChanges = auditLogs.filter((a) => a.action === "staff.assign_role");
  const stockAdjustments = inventoryLogs.filter((l) => l.changeType === "adjustment");

  const cards = [
    { label: "Hoạt động gần đây", value: logs.length, icon: History },
    { label: "Hành động thất bại", value: failedActions.length, icon: AlertOctagon },
    { label: "Refund", value: refunds.length, icon: Wallet },
    { label: "Điều chỉnh kho", value: stockAdjustments.length, icon: Layers },
    { label: "Điều chỉnh Xu", value: 0, icon: Coins },
    { label: "Thay đổi role", value: roleChanges.length, icon: ShieldCheck },
    { label: "Thay đổi cài đặt", value: 0, icon: Settings }
  ];

  const importantChanges = useMemo(() => auditLogs.slice(0, 15), [auditLogs]);

  return (
    <div className="space-y-8 text-left">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Dashboard kiểm toán (chỉ đọc)</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Kiểm toán viên</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white p-5 rounded-2xl border border-[#E8DDD1] shadow-sm space-y-1.5">
              <span className="text-[10px] text-[#75645A] uppercase font-bold">{c.label}</span>
              <div className="flex items-center justify-between">
                <strong className="text-lg font-mono font-black text-[#412C20]">{c.value}</strong>
                <Icon className="text-[#CEAF75]" size={17} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
        <h4 className="font-serif font-bold text-xs uppercase border-b border-[#E8DDD1] pb-3">Thay đổi dữ liệu quan trọng gần đây</h4>
        {importantChanges.length === 0 ? (
          <p className="text-xs text-[#75645A] italic py-6 text-center">Chưa có audit log nào được ghi nhận.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[600px]">
              <thead className="text-[#75645A] uppercase text-[10px]">
                <tr><th className="py-2 pr-3">Thời gian</th><th className="py-2 pr-3">Người thực hiện</th><th className="py-2 pr-3">Hành động</th><th className="py-2 pr-3">Module</th><th className="py-2 text-right">Kết quả</th></tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD1]">
                {importantChanges.map((a) => (
                  <tr key={a.id}>
                    <td className="py-2.5 pr-3 font-mono text-[10px] text-[#75645A]">{new Date(a.createdAt).toLocaleString("vi-VN")}</td>
                    <td className="py-2.5 pr-3 font-semibold">{a.actorName}</td>
                    <td className="py-2.5 pr-3 font-mono">{a.action}</td>
                    <td className="py-2.5 pr-3">{a.module}</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${a.result === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{a.result}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
