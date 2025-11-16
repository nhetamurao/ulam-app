import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buildApiUrl } from "../lib/api";

type Region = { id: number; name: string; psgc_code: string };
export default function RegionList() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      fetch(buildApiUrl("/regions"))
      .then((res) => res.json())
      .then((data) => {
        setRegions(data.data);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Regions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {regions.map((region) => (
            <li key={region.id}>
              <Link
                to={`/region/${region.id}`}
                className="text-blue-600 hover:underline"
              >
                {region.name} ({region.psgc_code})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}