<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Http\Resources\RegionResource;

class RegionController extends Controller
{
    public function index()
    {
        // Eager load provinces for each region
        return RegionResource::collection(
            Region::with('provinces')->get()
        );
    }

    public function show($id)
    {
        $region = Region::with('provinces.localities')->findOrFail($id);
        return new RegionResource($region);
    }
}
