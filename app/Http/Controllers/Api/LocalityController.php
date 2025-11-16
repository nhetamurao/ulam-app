<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Locality;
use App\Http\Resources\LocalityResource;
use Illuminate\Http\Request;

class LocalityController extends Controller
{
    public function index(Request $request)
    {
        $query = Locality::query();

        if ($request->filled('province_id')) {
            $query->where('province_id', $request->input('province_id'));
        }

        return LocalityResource::collection(
            $query->orderBy('name')->get()
        );
    }

    public function show($id)
    {
        $locality = Locality::findOrFail($id);
        return new LocalityResource($locality);
    }

    // Optional helper similar to byRegion()
    public function byProvince($province_id)
    {
        $localities = Locality::where('province_id', $province_id)
            ->orderBy('name')
            ->get();

        return LocalityResource::collection($localities);
    }
}
