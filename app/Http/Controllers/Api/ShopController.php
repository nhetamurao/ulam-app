<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Http\Resources\ShopResource;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class ShopController extends Controller
{
    /**
     * GET /api/shops
     * Supports filters for Discover page.
     */
    public function index(Request $request)
    {
        // Base query with relationships
        $query = Shop::with([
            'locality.province.region',
            'photos',
            'comments.user',
            'user',
        ])->where('is_published', true);

        // --------------------------
        // Filters
        // --------------------------

        // Search text: ?q=...
        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('long_description', 'like', "%{$search}%");
            });
        }

        // Locality filter: ?locality_id=123
        if ($localityId = $request->input('locality_id')) {
            $query->where('locality_id', $localityId);
        }

        // Province filter: ?province_id=456
        if ($provinceId = $request->input('province_id')) {
            $query->whereHas('locality.province', function ($q) use ($provinceId) {
                $q->where('id', $provinceId);
            });
        }

        // Region filter: ?region_id=789
        if ($regionId = $request->input('region_id')) {
            $query->whereHas('locality.province.region', function ($q) use ($regionId) {
                $q->where('id', $regionId);
            });
        }

        // Price filter: ?price_level=budget|mid|premium
        if ($priceLevel = $request->input('price_level')) {
            $query->where('avg_cost_hint', $priceLevel);
        }

        // --------------------------
        // Sorting (optional)
        // --------------------------
        $sort = $request->input('sort');

        switch ($sort) {
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            default:
                $query->orderByDesc('created_at');
                break;
        }

        // --------------------------
        // Pagination
        // --------------------------
        $perPage = (int) $request->input('per_page', 8);
        $perPage = max(1, min($perPage, 50));

        $shops = $query->paginate($perPage)->appends($request->query());

        return ShopResource::collection($shops);
    }

    /**
     * GET /api/shops/{shop}
     */
    public function show(Shop $shop)
    {
        $shop->load([
            'locality.province.region',
            'photos',
            'comments.user',
            'user',
        ]);

        return new ShopResource($shop);
    }

    /**
     * POST /api/shops
     */
    public function store(Request $request)
    {
        // 🔐 Resolve user via Sanctum token (Bearer)
        $tokenString = $request->bearerToken();
        $accessToken = $tokenString
            ? PersonalAccessToken::findToken($tokenString)
            : null;

        $user = $accessToken ? $accessToken->tokenable : null;

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // ✅ Validate payload
        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'locality_id'       => 'required|exists:localities,id',
            'short_description' => 'nullable|string|max:255',
            'long_description'  => 'nullable|string',
            'address_text'      => 'nullable|string|max:255',
            'cover_image_url'   => 'nullable|string|max:2000',
            'avg_cost_hint'     => 'nullable|in:budget,mid,premium',
            'is_published'      => 'nullable|boolean',
        ]);

        $shop = new Shop();
        $shop->user_id          = $user->id;
        $shop->locality_id      = $validated['locality_id'];
        $shop->name             = $validated['name'];
        $shop->short_description= $validated['short_description'] ?? null;
        $shop->long_description = $validated['long_description'] ?? null;
        $shop->address_text     = $validated['address_text'] ?? null;
        $shop->cover_image_url  = $validated['cover_image_url'] ?? null;
        $shop->avg_cost_hint    = $validated['avg_cost_hint'] ?? 'budget';
        $shop->is_published     = array_key_exists('is_published', $validated)
                                    ? (bool) $validated['is_published']
                                    : true;

        $shop->save();

        $shop->load(['locality.province.region', 'user']);

        return response()->json($shop, 201);
    }

    /**
     * PUT /api/shops/{shop}
     */
    public function update(Request $request, Shop $shop)
    {
        $data = $request->validate([
            'name'             => 'sometimes|required|string|max:255',
            'locality_id'      => 'sometimes|required|integer|exists:localities,id',
            'short_description'=> 'nullable|string',
            'long_description' => 'nullable|string',
            'address_text'     => 'nullable|string',
            'cover_image_url'  => 'nullable|string',
            'is_published'     => 'nullable|boolean',
        ]);

        if (array_key_exists('name', $data)) {
            $shop->name = $data['name'];
        }
        if (array_key_exists('locality_id', $data)) {
            $shop->locality_id = $data['locality_id'];
        }
        if (array_key_exists('short_description', $data)) {
            $shop->short_description = $data['short_description'];
        }
        if (array_key_exists('long_description', $data)) {
            $shop->long_description = $data['long_description'];
        }
        if (array_key_exists('address_text', $data)) {
            $shop->address_text = $data['address_text'];
        }
        if (array_key_exists('cover_image_url', $data)) {
            $shop->cover_image_url = $data['cover_image_url'];
        }
        if (array_key_exists('is_published', $data)) {
            $shop->is_published = $data['is_published'];
        }

        $shop->save();

        $shop->load([
            'locality.province.region',
            'photos',
            'comments.user',
            'user',
        ]);

        return new ShopResource($shop);
    }

    /**
     * DELETE /api/shops/{shop}
     */
    public function destroy(Shop $shop)
    {
        $shop->delete();

        return response()->json(['message' => 'Deleted'], 204);
    }

    /**
     * GET /api/me/shops  (requires auth:sanctum)
     */
    public function myShops(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $shops = Shop::with('locality.province.region')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($shops);
    }
}
