import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { buildApiUrl } from "../lib/api";

type Province = {
  id: number;
  name: string;
  psgc_code: string;
};

type Locality = {
  id: number;
  name: string;
  psgc_code: string;
};

export default function ProvinceDetail() {
  const { provinceId } = useParams<{ provinceId: string }>();

  const [province, setProvince] = useState<Province | null>(null);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!provinceId) return;

    const fetchProvince = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(buildApiUrl(`/provinces/${provinceId}`));
        if (!res.ok) {
          throw new Error("Failed to load province details.");
        }

        const data = await res.json();

        // Keeping your original expected shape:
        // { province: {...}, localities: [...] }
        setProvince(data.province ?? null);
        setLocalities(data.localities ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to load this province right now.");
        setProvince(null);
        setLocalities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProvince();
  }, [provinceId]);

  return (
    <div className="pt-20 md:pt-24 mx-auto max-w-4xl px-4 pb-12">
      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : province ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{province.name}</h1>
          <p className="mb-4 text-sm text-slate-600">
            PSGC Code: <span className="font-mono">{province.psgc_code}</span>
          </p>

          <h2 className="text-xl font-semibold mb-2">Localities</h2>
          <ul className="space-y-1 text-sm">
            {localities.length > 0 ? (
              localities.map((loc) => (
                <li key={loc.id}>
                  {loc.name} <span className="text-xs text-slate-500">({loc.psgc_code})</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 text-sm">No localities found.</li>
            )}
          </ul>

          <div className="mt-6">
            <Link
              to="/discover"
              className="text-sm text-gray-600 hover:underline"
            >
              &larr; Back to Discover
            </Link>
          </div>
        </>
      ) : (
        <p>Province not found.</p>
      )}
    </div>
  );
}
