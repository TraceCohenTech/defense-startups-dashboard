"use client";

import { useState, useMemo } from "react";
import companiesData from "../data/companies.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Treemap,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

type Company = (typeof companiesData)[number];

const BUCKET_COLORS: Record<string, string> = {
  autonomy_platforms: "#0ea5e9",
  frontline_hardware: "#f97316",
  defense_ai_software: "#22d3ee",
  space_hypersonics: "#f43f5e",
  sensing_detection: "#a3e635",
  manufacturing_infrastructure: "#fbbf24",
  logistics_support: "#34d399",
  communications_networks: "#c084fc",
};

const BUCKET_LABELS: Record<string, string> = {
  autonomy_platforms: "Autonomy Platforms",
  frontline_hardware: "Frontline Hardware",
  defense_ai_software: "Defense AI / Software",
  space_hypersonics: "Space & Hypersonics",
  sensing_detection: "Sensing & Detection",
  manufacturing_infrastructure: "Manufacturing",
  logistics_support: "Logistics",
  communications_networks: "Communications",
};

const REGION_COLORS: Record<string, string> = {
  "North America": "#0ea5e9",
  Europe: "#f97316",
};

const QUALITY_COLORS: Record<string, string> = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
};

const FLAG_EMOJI: Record<string, string> = {
  US: "\u{1F1FA}\u{1F1F8}",
  DE: "\u{1F1E9}\u{1F1EA}",
  PT: "\u{1F1F5}\u{1F1F9}",
  FR: "\u{1F1EB}\u{1F1F7}",
  ES: "\u{1F1EA}\u{1F1F8}",
  NL: "\u{1F1F3}\u{1F1F1}",
  FI: "\u{1F1EB}\u{1F1EE}",
  EE: "\u{1F1EA}\u{1F1EA}",
};

function formatUSD(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#131b2e] border border-slate-700 rounded-lg p-3 shadow-xl max-w-[260px]">
      <p className="text-sm font-medium text-white mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === "number" ? formatUSD(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"total_raised_usd" | "company_name">("total_raised_usd");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const companies = companiesData as Company[];

  const filtered = useMemo(() => {
    let result = companies;
    if (selectedBucket) result = result.filter((c) => c.category_bucket === selectedBucket);
    if (selectedRegion) result = result.filter((c) => c.region === selectedRegion);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.company_name.toLowerCase().includes(q) ||
          (c.company_description_short && c.company_description_short.toLowerCase().includes(q)) ||
          (c.notable_investors && c.notable_investors.toLowerCase().includes(q))
      );
    }
    result = [...result].sort((a, b) => {
      if (sortField === "total_raised_usd") {
        const av = (a.total_raised_usd as number) || 0;
        const bv = (b.total_raised_usd as number) || 0;
        return sortDir === "desc" ? bv - av : av - bv;
      }
      return sortDir === "desc"
        ? b.company_name.localeCompare(a.company_name)
        : a.company_name.localeCompare(b.company_name);
    });
    return result;
  }, [companies, selectedBucket, selectedRegion, searchTerm, sortField, sortDir]);

  const totalCapital = companies.reduce((s, c) => s + ((c.total_raised_usd as number) || 0), 0);
  const usCapital = companies
    .filter((c) => c.region === "North America")
    .reduce((s, c) => s + ((c.total_raised_usd as number) || 0), 0);
  const euCapital = companies
    .filter((c) => c.region === "Europe")
    .reduce((s, c) => s + ((c.total_raised_usd as number) || 0), 0);

  const top5Capital = [...companies]
    .sort((a, b) => ((b.total_raised_usd as number) || 0) - ((a.total_raised_usd as number) || 0))
    .slice(0, 5)
    .reduce((s, c) => s + ((c.total_raised_usd as number) || 0), 0);

  const bucketData = useMemo(() => {
    const map: Record<string, number> = {};
    companies.forEach((c) => {
      const bucket = c.category_bucket || "other";
      map[bucket] = (map[bucket] || 0) + ((c.total_raised_usd as number) || 0);
    });
    return Object.entries(map)
      .map(([name, value]) => ({
        name: BUCKET_LABELS[name] || name,
        value,
        key: name,
      }))
      .sort((a, b) => b.value - a.value);
  }, [companies]);

  const top10 = useMemo(() => {
    return [...companies]
      .sort((a, b) => ((b.total_raised_usd as number) || 0) - ((a.total_raised_usd as number) || 0))
      .slice(0, 10)
      .map((c) => ({
        name: c.company_name,
        total: (c.total_raised_usd as number) || 0,
        bucket: c.category_bucket,
      }));
  }, [companies]);

  const countryData = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    companies.forEach((c) => {
      const country = c.headquarters_country || "Unknown";
      if (!map[country]) map[country] = { total: 0, count: 0 };
      map[country].total += (c.total_raised_usd as number) || 0;
      map[country].count += 1;
    });
    return Object.entries(map)
      .map(([name, d]) => ({ name, ...d }))
      .sort((a, b) => b.total - a.total);
  }, [companies]);

  const qualityCounts = useMemo(() => {
    const map: Record<string, number> = { green: 0, yellow: 0, red: 0 };
    companies.forEach((c) => {
      const flag = (c.data_quality_flag as string) || "red";
      map[flag] = (map[flag] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [companies]);

  const scatterData = useMemo(() => {
    return companies
      .filter((c) => c.founded_year && c.total_raised_usd && c.company_name !== "TEKEVER")
      .map((c) => ({
        name: c.company_name,
        x: c.founded_year as number,
        y: (c.total_raised_usd as number) || 0,
        z: Math.sqrt((c.total_raised_usd as number) || 0) / 200,
        bucket: c.category_bucket,
      }));
  }, [companies]);

  const treemapData = useMemo(() => {
    return companies.map((c) => ({
      name: c.company_name,
      size: (c.total_raised_usd as number) || 0,
      color: BUCKET_COLORS[c.category_bucket || ""] || "#475569",
    }));
  }, [companies]);

  const investorFreq = useMemo(() => {
    const map: Record<string, number> = {};
    const seen = new Set<string>();
    companies.forEach((c) => {
      seen.clear();
      if (c.lead_investor_latest_round) {
        c.lead_investor_latest_round.split(";").forEach((inv) => {
          const name = inv.trim();
          if (name && !seen.has(name)) {
            seen.add(name);
            map[name] = (map[name] || 0) + 1;
          }
        });
      }
      if (c.notable_investors) {
        c.notable_investors.split("; ").forEach((inv) => {
          const name = inv.trim();
          if (name && !seen.has(name)) {
            seen.add(name);
            map[name] = (map[name] || 0) + 1;
          }
        });
      }
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [companies]);

  const handleSort = (field: "total_raised_usd" | "company_name") => {
    if (sortField === field) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const clearFilters = () => {
    setSelectedBucket(null);
    setSelectedRegion(null);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-slate-800/60">
        {/* Background layers */}
        <div className="absolute inset-0 hero-grid" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-transparent to-[#0a0f1a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a] via-transparent to-[#0a0f1a]" />

        {/* Radar element — top right */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-24 h-24 sm:w-36 sm:h-36 opacity-[0.12]">
          <div className="absolute inset-0 rounded-full border border-sky-500/40" />
          <div className="absolute inset-3 sm:inset-4 rounded-full border border-sky-500/25" />
          <div className="absolute inset-6 sm:inset-8 rounded-full border border-sky-500/15" />
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="radar-sweep absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left bg-gradient-to-r from-sky-400 to-transparent" />
          </div>
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400" />
        </div>

        {/* Decorative corner brackets */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2 border-sky-500/20 rounded-tl-sm" />
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2 border-sky-500/20 rounded-br-sm" />

        {/* Scan line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] overflow-hidden opacity-30">
          <div className="scan-line w-1/3 h-full bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 sm:pb-10">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
              </div>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">
                Defense &amp; National Security
              </span>
              <span className="hidden sm:inline text-slate-600 mx-1">/</span>
              <span className="hidden sm:inline text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500">
                Venture Capital Intelligence
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-mono">
              APR 2026
            </div>
          </div>

          {/* Title block */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-r from-sky-400 to-transparent" />
              <span className="text-[10px] sm:text-xs text-sky-400 uppercase tracking-[0.15em] font-medium">
                Market Report
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              $10M+ Defense
              <br />
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                Startup Rounds
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-400 mt-3 sm:mt-4 max-w-xl">
              {companies.length} companies across the US &amp; Europe &middot; 2025&ndash;2026
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[10px] sm:text-xs text-slate-500">
                Data via{" "}
                <a
                  href="https://x.com/IvanLandabaso/status/2041818661078413538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400/70 hover:text-sky-300 transition-colors"
                >
                  @IvanLandabaso
                </a>
                {" "}&middot; CrunchBase
              </span>
            </div>
          </div>

          {/* Hero KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            <div className="hero-stat-in hero-stat-in-d1 bg-white/[0.03] backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-white/[0.06]">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 mb-1">Total Capital</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">{formatUSD(totalCapital)}</p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">{companies.length} companies tracked</p>
            </div>
            <div className="hero-stat-in hero-stat-in-d2 bg-white/[0.03] backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-white/[0.06]">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 mb-1">US Capital</p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{formatUSD(usCapital)}</p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">{companies.filter((c) => c.region === "North America").length} companies</p>
            </div>
            <div className="hero-stat-in hero-stat-in-d3 bg-white/[0.03] backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-white/[0.06]">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 mb-1">Europe Capital</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-400">{formatUSD(euCapital)}</p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">{companies.filter((c) => c.region === "Europe").length} companies</p>
            </div>
            <div className="hero-stat-in hero-stat-in-d4 bg-white/[0.03] backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-white/[0.06]">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 mb-1">Top 5 Share</p>
              <p className="text-2xl sm:text-3xl font-bold text-rose-400">{((top5Capital / totalCapital) * 100).toFixed(0)}%</p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">{formatUSD(top5Capital)} concentrated</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-10">

        {/* Fun Facts */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              icon: "\u{1F6E1}\uFE0F",
              stat: `${companies.filter(c => (c.founded_year as number) >= 2022).length} of ${companies.length}`,
              label: "companies founded since 2022",
              detail: "The defense tech boom is brand new \u2014 most of these companies didn\u2019t exist 4 years ago",
            },
            {
              icon: "\u{1F680}",
              stat: formatUSD(top10[1]?.total || 0),
              label: "raised by Saronic in ~2 years",
              detail: "Founded in 2022, Saronic became one of the fastest defense startups to reach unicorn status",
            },
            {
              icon: "\u{1F3AF}",
              stat: `${companies.filter(c => c.notable_investors?.includes("Andreessen Horowitz")).length}`,
              label: "companies backed by a16z",
              detail: "Andreessen Horowitz is the most active investor in this dataset, spanning drones to hypersonics",
            },
            {
              icon: "\u{1F1EA}\u{1F1FA}",
              stat: `${companies.filter(c => c.region === "Europe").length} European cos`,
              label: `across ${Array.from(new Set(companies.filter(c => c.region === "Europe").map(c => c.headquarters_country))).filter(Boolean).length} countries`,
              detail: "European defense sovereignty is driving a new wave of homegrown defense tech startups",
            },
            {
              icon: "\u26A1",
              stat: `${companies.filter(c => ["counter_drone", "directed_energy"].includes(c.primary_category as string)).length} companies`,
              label: "focused on counter-drone",
              detail: "Counter-UAS is the hottest niche \u2014 from AI-guided guns to directed energy lasers",
            },
            {
              icon: "\u{1F4E1}",
              stat: `${companies.filter(c => c.hardware_software_mix === "software_only" || c.hardware_software_mix === "software_heavy").length} of ${companies.length}`,
              label: "are software-first",
              detail: "Unlike old defense, modern startups lead with AI and software before hardware",
            },
          ].map((fact, i) => (
            <div
              key={i}
              className="bg-[#0d1424] rounded-xl p-4 border border-slate-800/60 hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg sm:text-xl flex-shrink-0 mt-0.5">{fact.icon}</span>
                <div className="min-w-0">
                  <p className="text-white font-bold text-base sm:text-lg leading-tight">
                    {fact.stat}{" "}
                    <span className="text-slate-400 font-normal text-xs sm:text-sm">{fact.label}</span>
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {fact.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Charts Row 1: Top 10 + Category Breakdown */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-[#0d1424] rounded-xl p-4 sm:p-6 border border-slate-800 card-glow">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Top 10 Most-Funded Companies</h2>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={top10} layout="vertical" margin={{ left: 0, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => formatUSD(v)}
                  stroke="#475569"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  stroke="#475569"
                  tick={{ fill: "#e2e8f0", fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Total Raised" radius={[0, 4, 4, 0]}>
                  {top10.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={BUCKET_COLORS[entry.bucket || ""] || "#0ea5e9"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#0d1424] rounded-xl p-4 sm:p-6 border border-slate-800 card-glow">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Capital by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bucketData}
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="65%"
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {bucketData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={BUCKET_COLORS[entry.key] || "#475569"}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 justify-center">
              {bucketData.map((b) => (
                <button
                  key={b.key}
                  onClick={() =>
                    setSelectedBucket(selectedBucket === b.key ? null : b.key)
                  }
                  className={`flex items-center gap-1.5 text-[10px] sm:text-xs px-2 py-1 rounded-full border transition-all ${
                    selectedBucket === b.key
                      ? "border-white/40 bg-white/10"
                      : "border-slate-700 hover:border-slate-500"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: BUCKET_COLORS[b.key] || "#475569" }}
                  />
                  <span className="text-slate-300">{b.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Charts Row 2: Country + Investor Frequency */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-[#0d1424] rounded-xl p-4 sm:p-6 border border-slate-800 card-glow">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Capital by Country</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={countryData} margin={{ left: 0, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="name"
                  stroke="#475569"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tickFormatter={(v) => formatUSD(v)}
                  stroke="#475569"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Total Capital" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                  {countryData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={
                        entry.name === "United States"
                          ? "#0ea5e9"
                          : entry.name === "Germany"
                          ? "#f97316"
                          : entry.name === "Portugal"
                          ? "#22d3ee"
                          : entry.name === "France"
                          ? "#c084fc"
                          : entry.name === "Spain"
                          ? "#f43f5e"
                          : entry.name === "Netherlands"
                          ? "#34d399"
                          : "#94a3b8"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#0d1424] rounded-xl p-4 sm:p-6 border border-slate-800 card-glow">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Most Active Investors</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={investorFreq} layout="vertical" margin={{ left: 0, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  stroke="#475569"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  stroke="#475569"
                  tick={{ fill: "#e2e8f0", fontSize: 10 }}
                />
                <Tooltip />
                <Bar dataKey="count" name="Investments" fill="#22d3ee" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Charts Row 3: Scatter + Data Quality */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-[#0d1424] rounded-xl p-4 sm:p-6 border border-slate-800 card-glow">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-1">
              Founded Year vs Total Raised
            </h2>
            <p className="text-[10px] text-slate-500 mb-4">Excludes TEKEVER (est. 2001)</p>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ left: 0, right: 16, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="x"
                  name="Founded"
                  type="number"
                  domain={[2014, 2026]}
                  stroke="#475569"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <YAxis
                  dataKey="y"
                  name="Total Raised"
                  tickFormatter={(v) => formatUSD(v)}
                  stroke="#475569"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <ZAxis dataKey="z" range={[40, 400]} />
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#131b2e] border border-slate-700 rounded-lg p-3 shadow-xl">
                        <p className="text-sm font-medium text-white">{d.name}</p>
                        <p className="text-xs text-slate-400">Founded: {d.x}</p>
                        <p className="text-xs text-sky-400">Raised: {formatUSD(d.y)}</p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData}>
                  {scatterData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={BUCKET_COLORS[entry.bucket || ""] || "#0ea5e9"}
                      fillOpacity={0.75}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#0d1424] rounded-xl p-4 sm:p-6 border border-slate-800 card-glow">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Data Quality &amp; Breakdown</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {qualityCounts.map((q) => (
                <div key={q.name} className="text-center">
                  <div
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: QUALITY_COLORS[q.name] }}
                  >
                    {q.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400 capitalize mt-1">
                    {q.name === "green" ? "Verified" : q.name === "yellow" ? "Partial" : "Unverified"}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h3 className="text-xs sm:text-sm font-medium text-slate-300">Region Split</h3>
              {["North America", "Europe"].map((region) => {
                const count = companies.filter((c) => c.region === region).length;
                const capital = companies
                  .filter((c) => c.region === region)
                  .reduce((s, c) => s + ((c.total_raised_usd as number) || 0), 0);
                const pct = (capital / totalCapital) * 100;
                return (
                  <button
                    key={region}
                    onClick={() =>
                      setSelectedRegion(selectedRegion === region ? null : region)
                    }
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedRegion === region
                        ? "border-white/30 bg-white/5"
                        : "border-slate-700/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm text-white font-medium">{region}</span>
                      <span className="text-[10px] sm:text-xs text-slate-400">
                        {count} cos &middot; {formatUSD(capital)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: REGION_COLORS[region],
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 space-y-2.5">
              <h3 className="text-xs sm:text-sm font-medium text-slate-300">Hardware vs Software</h3>
              {["hardware_heavy", "software_only", "software_heavy", "mixed"].map((mix) => {
                const count = companies.filter((c) => c.hardware_software_mix === mix).length;
                if (count === 0) return null;
                const label = mix.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
                return (
                  <div key={mix} className="flex items-center gap-3">
                    <span className="text-[10px] sm:text-xs text-slate-400 w-24 sm:w-28 flex-shrink-0">{label}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-sky-500"
                        style={{ width: `${(count / companies.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-500 w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Treemap */}
        <section className="bg-[#0d1424] rounded-xl p-4 sm:p-6 border border-slate-800 card-glow">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
            Capital Treemap &mdash; Relative Funding Size
          </h2>
          <ResponsiveContainer width="100%" height={420}>
            <Treemap
              data={treemapData}
              dataKey="size"
              nameKey="name"
              aspectRatio={4 / 3}
              stroke="#0a0f1a"
              content={(props: any) => {
                const { x, y, width, height, name } = props;
                const value = props.size || props.value || 0;
                const fillColor = props.color || "#475569";
                if (!width || !height || width < 24 || height < 18) return <g />;
                const showName = width > 38 && height > 16;
                const showAmount = width > 55 && height > 32;
                const fs = width < 60 ? 9 : width < 90 ? 11 : width < 140 ? 13 : 14;
                const fsAmount = width < 80 ? 8 : width < 120 ? 10 : 11;
                return (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={fillColor}
                      fillOpacity={0.9}
                      rx={3}
                      stroke="#0a0f1a"
                      strokeWidth={2}
                    />
                    {showName && (
                      <text
                        x={x + width / 2}
                        y={y + height / 2 + (showAmount ? -7 : 0)}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="white"
                        fontSize={fs}
                        fontWeight="700"
                        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
                      >
                        {name}
                      </text>
                    )}
                    {showAmount && (
                      <text
                        x={x + width / 2}
                        y={y + height / 2 + 9}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="rgba(255,255,255,0.7)"
                        fontSize={fsAmount}
                        fontWeight="500"
                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                      >
                        {formatUSD(value)}
                      </text>
                    )}
                  </g>
                );
              }}
            />
          </ResponsiveContainer>
        </section>

        {/* Filters + Table */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-white">All Companies</h2>
            <div className="flex-1" />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search companies, investors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0d1424] border border-slate-700 rounded-lg px-3 sm:px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-full sm:w-72"
              />
              {(selectedBucket || selectedRegion || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-sky-400 hover:text-sky-300 whitespace-nowrap flex-shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 -mx-4 sm:mx-0">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-[#0d1424] border-b border-slate-800">
                  <th className="text-left px-3 sm:px-4 py-3 text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider w-8">
                    #
                  </th>
                  <th className="text-left px-3 sm:px-4 py-3 text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <button onClick={() => handleSort("company_name")} className="hover:text-white transition-colors">
                      Company {sortField === "company_name" && (sortDir === "asc" ? "\u2191" : "\u2193")}
                    </button>
                  </th>
                  <th className="text-left px-3 sm:px-4 py-3 text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-right px-3 sm:px-4 py-3 text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <button onClick={() => handleSort("total_raised_usd")} className="hover:text-white transition-colors">
                      Raised {sortField === "total_raised_usd" && (sortDir === "asc" ? "\u2191" : "\u2193")}
                    </button>
                  </th>
                  <th className="text-left px-3 sm:px-4 py-3 text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">
                    Investors
                  </th>
                  <th className="text-left px-3 sm:px-4 py-3 text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                    HQ
                  </th>
                  <th className="text-center px-3 sm:px-4 py-3 text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider w-10">
                    <span className="hidden sm:inline">Quality</span>
                    <span className="sm:hidden">Q</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr
                    key={c.normalized_company_name}
                    className="table-row-hover border-b border-slate-800/50"
                  >
                    <td className="px-3 sm:px-4 py-3 text-slate-500 text-xs">{i + 1}</td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm flex-shrink-0">
                          {FLAG_EMOJI[(c.country_code as string) || ""] || ""}
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium text-white text-xs sm:text-sm">{c.company_name}</div>
                          <div className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[180px] sm:max-w-[280px]">
                            {c.company_description_short}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">
                      <span
                        className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full border whitespace-nowrap"
                        style={{
                          color: BUCKET_COLORS[c.category_bucket || ""] || "#94a3b8",
                          borderColor:
                            (BUCKET_COLORS[c.category_bucket || ""] || "#94a3b8") + "40",
                          backgroundColor:
                            (BUCKET_COLORS[c.category_bucket || ""] || "#94a3b8") + "15",
                        }}
                      >
                        {BUCKET_LABELS[c.category_bucket || ""] || c.category_bucket}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right">
                      <span className="font-mono text-xs sm:text-sm text-white font-medium">
                        {formatUSD((c.total_raised_usd as number) || 0)}
                      </span>
                      {c.original_currency !== "USD" && (
                        <div className="text-[10px] text-slate-500">
                          {c.original_currency}{" "}
                          {((c.total_raised_original_currency as number) || 0) >= 1_000_000
                            ? `${((c.total_raised_original_currency as number) / 1_000_000).toFixed(0)}M`
                            : c.total_raised_original_currency}
                        </div>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-3 hidden md:table-cell">
                      <div className="text-[10px] sm:text-xs text-slate-300 max-w-[200px] truncate">
                        {c.notable_investors || "\u2014"}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-[10px] sm:text-xs text-slate-400 hidden lg:table-cell">
                      {c.headquarters_city
                        ? `${c.headquarters_city}, ${c.country_code}`
                        : c.headquarters_country || "\u2014"}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-center">
                      <span
                        className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            QUALITY_COLORS[(c.data_quality_flag as string) || "red"],
                        }}
                        title={`Data quality: ${c.data_quality_flag}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-2 px-4 sm:px-0">
            Showing {filtered.length} of {companies.length} companies
            {selectedBucket && ` \u00B7 ${BUCKET_LABELS[selectedBucket]}`}
            {selectedRegion && ` \u00B7 ${selectedRegion}`}
          </p>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 pt-6 pb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[10px] sm:text-xs text-slate-500 text-center sm:text-left">
              Data via{" "}
              <a
                href="https://x.com/IvanLandabaso/status/2041818661078413538"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 transition-colors"
              >
                @IvanLandabaso
              </a>
              {" "}&middot; CrunchBase &middot; Company websites &middot; 2025&ndash;Q1 2026
            </div>
            <div className="flex items-center gap-4 text-[10px] sm:text-xs text-slate-500">
              <a
                href="https://x.com/Trace_Cohen"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                @Trace_Cohen
              </a>
              <a
                href="mailto:t@nyvp.com"
                className="hover:text-sky-400 transition-colors"
              >
                t@nyvp.com
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
