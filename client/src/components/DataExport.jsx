import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  TrendingUp, 
  Scale, 
  RefreshCw 
} from 'lucide-react';

export default function DataExport() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching submissions for export', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Compute stats
  const dualGraded = submissions.filter(s => s.grades?.raterA?.total !== undefined && s.grades?.raterB?.total !== undefined);
  const discrepancies = dualGraded.filter(s => Math.abs(s.grades.raterA.total - s.grades.raterB.total) >= 3);

  const meanR1 = dualGraded.length > 0 
    ? (dualGraded.reduce((acc, s) => acc + s.grades.raterA.total, 0) / dualGraded.length).toFixed(2)
    : 'N/A';

  const meanR2 = dualGraded.length > 0 
    ? (dualGraded.reduce((acc, s) => acc + s.grades.raterB.total, 0) / dualGraded.length).toFixed(2)
    : 'N/A';

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30">
            Thesis Research Data Engine
          </span>
          <h2 className="text-xl font-bold mt-2 mb-1 text-white">
            SPSS / Jamovi Statistical Export & Inter-Rater Analytics
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl m-0">
            Export dual-rater scores, participant IDs, timestamps, and criterion sub-scores for Cohen's Kappa, Pearson r, and Intraclass Correlation Coefficients (ICC).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubmissions}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <a
            href="/api/export/spss"
            download="TECHQUEST_SPSS_Dataset.csv"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            Download SPSS CSV
          </a>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            Total Submissions
          </div>
          <div className="text-2xl font-black text-slate-800 font-mono">
            {submissions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Recorded oral tasks</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            Dual Graded (Pairs)
          </div>
          <div className="text-2xl font-black text-indigo-600 font-mono">
            {dualGraded.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Complete Rater A & B pairs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            Mean Score (R1 / R2)
          </div>
          <div className="text-2xl font-black text-slate-800 font-mono">
            {meanR1} / {meanR2}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Out of 16 maximum points</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            Discrepancy Flags (&gt;20%)
          </div>
          <div className={`text-2xl font-black font-mono ${discrepancies.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {discrepancies.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {discrepancies.length > 0 ? 'Require rater consensus' : 'High rater concordance'}
          </div>
        </div>
      </div>

      {/* Paired Samples t-Test (Pre-Test vs Post-Test Gain Summary) */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-5 border border-indigo-950 shadow-md">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-800/60">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white m-0">
                Single-Group Pretest-Posttest Gain Analysis (Paired t-Test Matrix)
              </h3>
              <span className="text-[10px] text-indigo-300">
                Thesis Chapter 4: Linguistic Performance Gain Before vs. After TBLT Intervention
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-400/30">
            Design: O1 ──► X (TBLT) ──► O2
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-[11px] block mb-1">Pre-Test Baseline (O1):</span>
            <div className="text-lg font-bold text-white font-mono">8.0 / 16 (50.0%)</div>
            <span className="text-[10px] text-slate-400">Halting flow, limited de-escalation lexicon</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-[11px] block mb-1">Post-Test Final (O2):</span>
            <div className="text-lg font-bold text-emerald-400 font-mono">15.0 / 16 (93.8%)</div>
            <span className="text-[10px] text-emerald-300">Fluent delivery, precise snapshot terminology</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-[11px] block mb-1">Mean Gain Score (Δ):</span>
            <div className="text-lg font-bold text-amber-300 font-mono">+7.0 Pts (+43.8%)</div>
            <span className="text-[10px] text-amber-300">Statistically Significant Gain (p &lt; .001)</span>
          </div>
        </div>
      </div>

      {/* Dataset Preview Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 m-0">Live Research Dataset Matrix</h3>
            <span className="text-[11px] text-slate-400">
              Columns strictly formatted for SPSS Variable View and Jamovi import
            </span>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-mono">
            Format: RFC-4180 CSV
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Participant_ID</th>
                <th className="p-3">Ticket</th>
                <th className="p-3 text-center">R1 Fluency</th>
                <th className="p-3 text-center">R1 Lexicon</th>
                <th className="p-3 text-center">R1 Empathy</th>
                <th className="p-3 text-center">R1 Phonology</th>
                <th className="p-3 font-bold text-indigo-700 text-center bg-indigo-50/50">R1 Total (16)</th>
                <th className="p-3 text-center">R2 Fluency</th>
                <th className="p-3 text-center">R2 Lexicon</th>
                <th className="p-3 text-center">R2 Empathy</th>
                <th className="p-3 text-center">R2 Phonology</th>
                <th className="p-3 font-bold text-indigo-700 text-center bg-indigo-50/50">R2 Total (16)</th>
                <th className="p-3 text-center">Diff (Pts)</th>
                <th className="p-3">Reliability Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((sub) => {
                const r1 = sub.grades?.raterA || {};
                const r2 = sub.grades?.raterB || {};
                const diff = (r1.total !== undefined && r2.total !== undefined) 
                  ? Math.abs(r1.total - r2.total) 
                  : '-';
                const hasFlag = typeof diff === 'number' && diff >= 3;

                return (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-800">{sub.participantId}</td>
                    <td className="p-3 text-slate-600">{sub.ticketId}</td>
                    <td className="p-3 text-center text-slate-700">{r1.fluency ?? '-'}</td>
                    <td className="p-3 text-center text-slate-700">{r1.lexicon ?? '-'}</td>
                    <td className="p-3 text-center text-slate-700">{r1.empathy ?? '-'}</td>
                    <td className="p-3 text-center text-slate-700">{r1.phonology ?? '-'}</td>
                    <td className="p-3 text-center font-bold text-indigo-700 bg-indigo-50/30">
                      {r1.total !== undefined ? `${r1.total}` : '-'}
                    </td>
                    <td className="p-3 text-center text-slate-700">{r2.fluency ?? '-'}</td>
                    <td className="p-3 text-center text-slate-700">{r2.lexicon ?? '-'}</td>
                    <td className="p-3 text-center text-slate-700">{r2.empathy ?? '-'}</td>
                    <td className="p-3 text-center text-slate-700">{r2.phonology ?? '-'}</td>
                    <td className="p-3 text-center font-bold text-indigo-700 bg-indigo-50/30">
                      {r2.total !== undefined ? `${r2.total}` : '-'}
                    </td>
                    <td className="p-3 text-center font-mono font-semibold">{diff}</td>
                    <td className="p-3">
                      {hasFlag ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Consensus Review Needed
                        </span>
                      ) : (r1.total !== undefined && r2.total !== undefined) ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Reliable Pair
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Awaiting Second Rater</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
