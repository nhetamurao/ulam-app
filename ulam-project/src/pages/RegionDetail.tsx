import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { buildApiUrl } from "../lib/api";

type Province = { id: number; name: string; psgc_code: string };
type Region = {
  id: number;
  name: string;
  psgc_code: string;
  provinces: Province[];
};

export default function RegionDetail() {
  const { regionId } = useParams<{ regionId: string }>();
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetch(buildApiUrl(`/regions/${regionId}`))
      .then((res) => res.json())
      .then((data) => {
        setRegion(data);
        setLoading(false);
      });
  }, [regionId]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : region ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{region.name}</h1>
          <p className="mb-4">PSGC Code: {region.psgc_code}</p>
          <h2 className="text-xl font-semibold mb-2">Provinces</h2>
          <ul className="space-y-1">
            {region.provinces.map((province) => (
              <li key={province.id}>
                <Link
                  to={`/province/${province.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {province.name} ({province.psgc_code})
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link to="/" className="text-gray-600 hover:underline">
              &larr; Back to Regions
            </Link>
          </div>
        </>
      ) : (
        <p>Region not found.</p>
      )}
    </div>
  );
}