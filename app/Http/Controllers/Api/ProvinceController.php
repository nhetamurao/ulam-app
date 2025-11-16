<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Province;
use App\Http\Resources\ProvinceResource;
use Illuminate\Http\Request;

class ProvinceController extends Controller
{
    public function index(Request $request)
    {
        $query = Province::with('localities');

        // If region_id is passed, filter by it
        if ($request->filled('region_id')) {
            $query->where('region_id', $request->input('region_id'));
        }

        return ProvinceResource::collection(
            $query->orderBy('name')->get()
        );
    }

    public function show($id)
    {
        $province = Province::with('localities')->findOrFail($id);
        return new ProvinceResource($province);
    }

    // Optional: still keep this if you want a clean URL like /api/regions/{id}/provinces
    public function byRegion($region_id)
    {
        $provinces = Province::with('localities')
            ->where('region_id', $region_id)
            ->orderBy('name')
            ->get();

        return ProvinceResource::collection($provinces);
    }
}
